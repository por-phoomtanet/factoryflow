import type {
  AllSheets,
  ProductionPlan,
  PurchaseOrder,
} from "@/services/googleSheet";

// ===== helper =====
const num = (v: string | undefined): number => {
  const n = parseFloat(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export type Severity = "GOOD" | "MEDIUM" | "LOW";

export interface MaterialStatus {
  material: string;
  unit: string;
  need: number; // ความต้องการตามแผนวันนี้ (คำนวณจาก BOM)
  stock: number;
  balance: number; // stock - need
  coverageDays: number | null; // stock / need (null = ไม่มีความต้องการ)
  status: Severity;
}

export interface BagStatus {
  pkg: string;
  size: string;
  stock: number;
  minimum: number;
  status: Severity;
}

export interface LineCapacity {
  line: string;
  capacity: number;
  planned: number; // รวม TARGET ตามแผนวันนี้
  utilizationPct: number;
}

export interface DashboardData {
  planDate: string; // วันที่ใช้เป็น "วันนี้"
  generatedAt: string;
  shift: string;
  kpis: {
    poWaiting: number;
    todayCapacityPct: number;
    runningLine: { running: number; total: number };
    materialAlert: number;
    bagAlert: number;
    overduePo: number;
  };
  poWaiting: PurchaseOrder[];
  planByLine: { line: string; plans: ProductionPlan[] }[];
  productLegend: string[];
  materials: MaterialStatus[];
  bags: BagStatus[];
  lines: LineCapacity[];
  changeover: {
    line: string;
    from: string;
    to: string;
    cleaningMin: number;
  } | null;
  notes: { level: "info" | "warn" | "critical"; text: string }[];
}

/**
 * รวมข้อมูลดิบทั้ง 7 แท็บ → คำนวณเป็น view model สำหรับ dashboard
 *
 * นิยาม "วันนี้" = วันที่ล่าสุดที่มีในแท็บ PRODUCTION_PLAN
 * (เพื่อให้ dashboard มีข้อมูลแสดงเสมอแม้ข้อมูลตัวอย่างจะไม่ใช่วันปัจจุบัน)
 */
export function buildDashboard(s: AllSheets): DashboardData {
  // ----- หา "วันนี้" จากแผนล่าสุด -----
  const planDate =
    s.plans.map((p) => p.PLAN_DATE).sort().at(-1) ??
    new Date().toISOString().slice(0, 10);

  const todayPlans = s.plans.filter((p) => p.PLAN_DATE === planDate);

  // ----- PO ที่รอวางแผน -----
  const poWaiting = s.poList.filter((p) => p.STATUS?.toUpperCase() === "WAITING");

  // ----- PO เกินกำหนด (DUE < วันนี้ และยังไม่เสร็จ) -----
  const overduePo = s.poList.filter(
    (p) =>
      p.DUE_DATE &&
      p.DUE_DATE < planDate &&
      !["FINISH", "DONE"].includes(p.STATUS?.toUpperCase())
  ).length;

  // ----- คำนวณความต้องการวัตถุดิบจาก BOM ตามแผนวันนี้ -----
  // need[material] += (TARGET / 1000) * QTY_PER_1000_BAG
  const needByMaterial = new Map<string, number>();
  for (const plan of todayPlans) {
    const target = num(plan.TARGET);
    const bom = s.boms.filter((b) => b.PRODUCT === plan.PRODUCT);
    for (const b of bom) {
      const add = (target / 1000) * num(b.QTY_PER_1000_BAG);
      needByMaterial.set(b.MATERIAL, (needByMaterial.get(b.MATERIAL) ?? 0) + add);
    }
  }

  const materials: MaterialStatus[] = s.materials.map((m) => {
    const need = Math.round(needByMaterial.get(m.MATERIAL) ?? 0);
    const stock = num(m.STOCK);
    const safety = num(m.SAFETY_STOCK);
    const balance = stock - need;
    const coverageDays = need > 0 ? +(stock / need).toFixed(2) : null;
    let status: Severity = "GOOD";
    if (balance < 0) status = "LOW";
    else if (stock < safety || balance < safety) status = "MEDIUM";
    return { material: m.MATERIAL, unit: m.UNIT, need, stock, balance, coverageDays, status };
  });
  const materialAlert = materials.filter((m) => m.status === "LOW").length;

  // ----- สถานะถุงบรรจุ -----
  const bags: BagStatus[] = s.packaging.map((p) => {
    const stock = num(p.STOCK);
    const minimum = num(p.MINIMUM);
    let status: Severity = "GOOD";
    if (stock < minimum) status = "LOW";
    else if (stock < minimum * 1.5) status = "MEDIUM";
    return { pkg: p.PACKAGE, size: p.SIZE, stock, minimum, status };
  });
  const bagAlert = bags.filter((b) => b.status === "LOW").length;

  // ----- กำลังการผลิตต่อไลน์ -----
  const lines: LineCapacity[] = s.lines.map((l) => {
    const planned = todayPlans
      .filter((p) => p.LINE === l.LINE)
      .reduce((sum, p) => sum + num(p.TARGET), 0);
    const capacity = num(l.CAPACITY);
    const utilizationPct = capacity > 0 ? Math.round((planned / capacity) * 100) : 0;
    return { line: l.LINE, capacity, planned, utilizationPct };
  });

  const totalPlanned = lines.reduce((s, l) => s + l.planned, 0);
  const totalCapacity = lines.reduce((s, l) => s + l.capacity, 0);
  const todayCapacityPct =
    totalCapacity > 0 ? Math.round((totalPlanned / totalCapacity) * 100) : 0;

  const usedLines = new Set(todayPlans.map((p) => p.LINE)).size;

  // ----- แผนผลิตจัดกลุ่มตามไลน์ -----
  const planByLine = s.lines.map((l) => ({
    line: l.LINE,
    plans: todayPlans
      .filter((p) => p.LINE === l.LINE)
      .sort((a, b) => a.START.localeCompare(b.START)),
  }));

  const productLegend = Array.from(new Set(todayPlans.map((p) => p.PRODUCT)));

  // ----- changeover: ไลน์แรกที่มีแผน >= 2 และสินค้าต่างกัน -----
  let changeover: DashboardData["changeover"] = null;
  for (const grp of planByLine) {
    if (grp.plans.length >= 2 && grp.plans[0].PRODUCT !== grp.plans[1].PRODUCT) {
      const lineInfo = s.lines.find((l) => l.LINE === grp.line);
      changeover = {
        line: grp.line,
        from: grp.plans[0].PRODUCT,
        to: grp.plans[1].PRODUCT,
        cleaningMin: num(lineInfo?.CHANGEOVER),
      };
      break;
    }
  }

  // ----- โน้ต / แจ้งเตือน -----
  const notes: DashboardData["notes"] = [];
  const critMats = materials.filter((m) => m.status === "LOW").map((m) => m.material);
  if (critMats.length) {
    notes.push({ level: "critical", text: `วัตถุดิบ ${critMats.join(", ")} ต่ำกว่าเกณฑ์` });
  }
  const lowBags = bags.filter((b) => b.status === "LOW").map((b) => b.pkg);
  if (lowBags.length) {
    notes.push({ level: "warn", text: `ถุงบรรจุ ${lowBags.join(", ")} ใกล้หมด` });
  }
  for (const po of s.poList) {
    if (po.DUE_DATE === planDate && po.STATUS?.toUpperCase() === "WAITING") {
      notes.push({ level: "info", text: `${po.PO_NO} ใกล้ครบกำหนดส่ง (${po.DUE_DATE})` });
    }
  }
  if (notes.length === 0) notes.push({ level: "info", text: "ไม่มีการแจ้งเตือน" });

  return {
    planDate,
    generatedAt: new Date().toISOString(),
    shift: "A",
    kpis: {
      poWaiting: poWaiting.length,
      todayCapacityPct,
      runningLine: { running: usedLines, total: s.lines.length },
      materialAlert,
      bagAlert,
      overduePo,
    },
    poWaiting,
    planByLine,
    productLegend,
    materials,
    bags,
    lines,
    changeover,
    notes,
  };
}
