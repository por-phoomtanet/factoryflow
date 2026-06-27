/**
 * ข้อมูลตัวอย่าง (hardcode) สำหรับ seed ลง MongoDB
 * ออกแบบให้สอดคล้องกัน เช่น ความต้องการวัตถุดิบ (BOM × แผน) เทียบสต็อกแล้วเกิด alert จริง
 */

export const seedData = {
  po_list: [
    { PO_NO: "PO250626-001", CUSTOMER: "ลูกค้า A", PRODUCT: "ปลาหมึก A", QTY_BAG: "12000", DUE_DATE: "2026-06-27", PRIORITY: "HIGH", STATUS: "WAITING" },
    { PO_NO: "PO250626-002", CUSTOMER: "ลูกค้า B", PRODUCT: "Fish Ball", QTY_BAG: "8500", DUE_DATE: "2026-06-28", PRIORITY: "HIGH", STATUS: "WAITING" },
    { PO_NO: "PO250626-003", CUSTOMER: "ลูกค้า C", PRODUCT: "Crab Stick", QTY_BAG: "10000", DUE_DATE: "2026-06-29", PRIORITY: "MEDIUM", STATUS: "WAITING" },
    { PO_NO: "PO250626-004", CUSTOMER: "ลูกค้า D", PRODUCT: "ลูกชิ้นปลา", QTY_BAG: "6000", DUE_DATE: "2026-06-30", PRIORITY: "MEDIUM", STATUS: "WAITING" },
    { PO_NO: "PO250626-005", CUSTOMER: "ลูกค้า E", PRODUCT: "Shrimp Ball", QTY_BAG: "7500", DUE_DATE: "2026-06-30", PRIORITY: "LOW", STATUS: "WAITING" },
    { PO_NO: "PO250626-006", CUSTOMER: "ลูกค้า F", PRODUCT: "Fish Cake", QTY_BAG: "5000", DUE_DATE: "2026-06-30", PRIORITY: "LOW", STATUS: "WAITING" },
    { PO_NO: "PO250626-007", CUSTOMER: "ลูกค้า G", PRODUCT: "Fish Tofu", QTY_BAG: "6500", DUE_DATE: "2026-07-01", PRIORITY: "LOW", STATUS: "WAITING" },
    { PO_NO: "PO250626-008", CUSTOMER: "ลูกค้า H", PRODUCT: "Seafood Mix", QTY_BAG: "4000", DUE_DATE: "2026-07-01", PRIORITY: "LOW", STATUS: "WAITING" },
    { PO_NO: "PO250620-009", CUSTOMER: "ลูกค้า I", PRODUCT: "Fish Ball", QTY_BAG: "3000", DUE_DATE: "2026-06-25", PRIORITY: "HIGH", STATUS: "WAITING" },
  ],
  production_plan: [
    { PLAN_DATE: "2026-06-26", LINE: "LINE1", PO_NO: "PO250626-001", PRODUCT: "ปลาหมึก A", START: "08:00", END: "10:30", TARGET: "12000" },
    { PLAN_DATE: "2026-06-26", LINE: "LINE1", PO_NO: "PO250626-002", PRODUCT: "Fish Ball", START: "10:30", END: "13:00", TARGET: "8500" },
    { PLAN_DATE: "2026-06-26", LINE: "LINE2", PO_NO: "PO250626-003", PRODUCT: "Crab Stick", START: "08:00", END: "12:00", TARGET: "10000" },
    { PLAN_DATE: "2026-06-26", LINE: "LINE3", PO_NO: "PO250626-004", PRODUCT: "ลูกชิ้นปลา", START: "08:00", END: "11:00", TARGET: "6000" },
    { PLAN_DATE: "2026-06-26", LINE: "LINE4", PO_NO: "PO250626-005", PRODUCT: "Shrimp Ball", START: "13:00", END: "17:00", TARGET: "7500" },
  ],
  production_result: [
    { DATE: "2026-06-26", LINE: "LINE1", PO_NO: "PO250626-001", PRODUCT: "ปลาหมึก A", TARGET: "12000", ACTUAL: "11500", REJECT: "500", STATUS: "RUNNING" },
    { DATE: "2026-06-26", LINE: "LINE2", PO_NO: "PO250626-003", PRODUCT: "Crab Stick", TARGET: "10000", ACTUAL: "9800", REJECT: "200", STATUS: "FINISH" },
    { DATE: "2026-06-26", LINE: "LINE3", PO_NO: "PO250626-004", PRODUCT: "ลูกชิ้นปลา", TARGET: "6000", ACTUAL: "5800", REJECT: "100", STATUS: "FINISH" },
  ],
  raw_material: [
    { CODE: "RM001", MATERIAL: "ปลา A", UNIT: "KG", STOCK: "3000", SAFETY_STOCK: "1000" },
    { CODE: "RM002", MATERIAL: "ปลา B", UNIT: "KG", STOCK: "2000", SAFETY_STOCK: "1000" },
    { CODE: "RM003", MATERIAL: "กุ้ง", UNIT: "KG", STOCK: "700", SAFETY_STOCK: "800" },
    { CODE: "RM004", MATERIAL: "หมึก", UNIT: "KG", STOCK: "1800", SAFETY_STOCK: "500" },
    { CODE: "RM005", MATERIAL: "แป้ง", UNIT: "KG", STOCK: "900", SAFETY_STOCK: "300" },
  ],
  product_bom: [
    { PRODUCT: "ปลาหมึก A", MATERIAL: "หมึก", QTY_PER_1000_BAG: "100", UNIT: "KG" },
    { PRODUCT: "ปลาหมึก A", MATERIAL: "แป้ง", QTY_PER_1000_BAG: "15", UNIT: "KG" },
    { PRODUCT: "Fish Ball", MATERIAL: "ปลา A", QTY_PER_1000_BAG: "120", UNIT: "KG" },
    { PRODUCT: "Fish Ball", MATERIAL: "แป้ง", QTY_PER_1000_BAG: "20", UNIT: "KG" },
    { PRODUCT: "Crab Stick", MATERIAL: "ปลา B", QTY_PER_1000_BAG: "150", UNIT: "KG" },
    { PRODUCT: "Crab Stick", MATERIAL: "แป้ง", QTY_PER_1000_BAG: "10", UNIT: "KG" },
    { PRODUCT: "ลูกชิ้นปลา", MATERIAL: "ปลา B", QTY_PER_1000_BAG: "130", UNIT: "KG" },
    { PRODUCT: "ลูกชิ้นปลา", MATERIAL: "แป้ง", QTY_PER_1000_BAG: "25", UNIT: "KG" },
    { PRODUCT: "Shrimp Ball", MATERIAL: "กุ้ง", QTY_PER_1000_BAG: "100", UNIT: "KG" },
    { PRODUCT: "Shrimp Ball", MATERIAL: "แป้ง", QTY_PER_1000_BAG: "15", UNIT: "KG" },
  ],
  packaging_stock: [
    { PACKAGE: "BAG001", SIZE: "15x25", STOCK: "9500", MINIMUM: "5000" },
    { PACKAGE: "BAG002", SIZE: "17x26", STOCK: "5200", MINIMUM: "5000" },
    { PACKAGE: "BAG003", SIZE: "20x30", STOCK: "800", MINIMUM: "2000" },
    { PACKAGE: "BAG004", SIZE: "22x32", STOCK: "4000", MINIMUM: "3000" },
    { PACKAGE: "BAG005", SIZE: "24x34", STOCK: "6500", MINIMUM: "3000" },
    { PACKAGE: "BAG006", SIZE: "26x38", STOCK: "900", MINIMUM: "1000" },
    { PACKAGE: "BAG007", SIZE: "28x40", STOCK: "7000", MINIMUM: "3000" },
    { PACKAGE: "BAG008", SIZE: "30x45", STOCK: "3500", MINIMUM: "2000" },
    { PACKAGE: "BAG009", SIZE: "32x50", STOCK: "10000", MINIMUM: "4000" },
    { PACKAGE: "BAG010", SIZE: "35x55", STOCK: "1200", MINIMUM: "2000" },
  ],
  production_line: [
    { LINE: "LINE1", CAPACITY: "12000", CHANGEOVER: "30" },
    { LINE: "LINE2", CAPACITY: "10000", CHANGEOVER: "35" },
    { LINE: "LINE3", CAPACITY: "8000", CHANGEOVER: "30" },
    { LINE: "LINE4", CAPACITY: "7000", CHANGEOVER: "40" },
    { LINE: "LINE5", CAPACITY: "9000", CHANGEOVER: "30" },
  ],
};
