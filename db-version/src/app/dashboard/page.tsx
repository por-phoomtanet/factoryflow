"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DashboardData, Severity } from "@/lib/dashboard";

const AUTO_REFRESH_MS = 15_000;

const PRODUCT_COLORS = [
  "bg-sky-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-violet-600",
  "bg-cyan-600",
  "bg-orange-600",
  "bg-teal-600",
  "bg-fuchsia-600",
  "bg-lime-600",
];

const SEV_TEXT: Record<Severity, string> = {
  GOOD: "text-emerald-400",
  MEDIUM: "text-amber-400",
  LOW: "text-rose-400",
};
const SEV_BADGE: Record<Severity, string> = {
  GOOD: "bg-emerald-600",
  MEDIUM: "bg-amber-600",
  LOW: "bg-rose-600",
};

function KpiCard({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string | number;
  unit?: string;
  accent: string;
}) {
  return (
    <div className={`rounded-lg border border-slate-700 ${accent} p-3 text-center`}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-300">
        {label}
      </div>
      <div className="mt-1 text-3xl font-bold leading-none text-white">{value}</div>
      {unit && <div className="text-[11px] text-slate-300">{unit}</div>}
    </div>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`flex flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800/60 ${className}`}>
      <h2 className="bg-slate-700/70 px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-slate-100">
        {title}
      </h2>
      <div className="flex-1 overflow-auto p-2">{children}</div>
    </section>
  );
}

function Gauge({ pct }: { pct: number }) {
  const color = pct >= 85 ? "#10b981" : pct >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <div
      className="relative h-14 w-14 rounded-full"
      style={{ background: `conic-gradient(${color} ${pct * 3.6}deg, #334155 0deg)` }}
    >
      <div className="absolute inset-[6px] flex items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
        {pct}%
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [d, setD] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setD(json as DashboardData);
      setError(null);
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saved = useRef(load);
  saved.current = load;
  useEffect(() => {
    const id = setInterval(() => saved.current(), AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-900 p-6 text-slate-200">
        <div className="rounded-lg border border-rose-700 bg-rose-950/50 p-4">
          <p className="font-bold text-rose-300">โหลด dashboard ไม่สำเร็จ</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </main>
    );
  }

  if (!d) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
        กำลังโหลด dashboard...
      </main>
    );
  }

  const colorOf = (product: string) => {
    const i = d.productLegend.indexOf(product);
    return PRODUCT_COLORS[i >= 0 ? i % PRODUCT_COLORS.length : 0];
  };

  return (
    <main className="min-h-screen bg-slate-900 p-3 text-slate-200">
      <header className="mb-3 flex items-center justify-between rounded-lg bg-slate-800 px-4 py-2">
        <div className="flex items-center gap-4 text-sm">
          <span>📅 {d.planDate}</span>
          <span className="font-semibold">SHIFT : {d.shift}</span>
        </div>
        <h1 className="text-xl font-bold tracking-wide text-white">
          PRODUCTION PLANNING DASHBOARD
        </h1>
        <div className="text-sm text-slate-300">
          🔄 Last Update : {updatedAt?.toLocaleTimeString("th-TH") ?? "-"}
        </div>
      </header>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="PO Waiting" value={d.kpis.poWaiting} unit="Orders" accent="bg-slate-800" />
        <KpiCard label="Today Capacity" value={`${d.kpis.todayCapacityPct}%`} accent="bg-emerald-900/50" />
        <KpiCard
          label="Running Line"
          value={`${d.kpis.runningLine.running} / ${d.kpis.runningLine.total}`}
          unit="Line"
          accent="bg-sky-900/50"
        />
        <KpiCard label="Material Alert" value={d.kpis.materialAlert} unit="Items" accent="bg-amber-900/50" />
        <KpiCard label="Bag Alert" value={d.kpis.bagAlert} unit="Items" accent="bg-rose-900/50" />
        <KpiCard label="Overdue PO" value={d.kpis.overduePo} unit="Orders" accent="bg-slate-800" />
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Panel title="PO Waiting For Plan">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400">
              <tr>
                <th className="px-1 py-1">PO NO.</th>
                <th className="px-1 py-1">CUSTOMER</th>
                <th className="px-1 py-1">PRODUCT</th>
                <th className="px-1 py-1 text-right">QTY</th>
                <th className="px-1 py-1">DUE</th>
                <th className="px-1 py-1">PRI</th>
              </tr>
            </thead>
            <tbody>
              {d.poWaiting.map((p) => (
                <tr key={p.PO_NO} className="border-t border-slate-700/60">
                  <td className="px-1 py-1 font-mono">{p.PO_NO}</td>
                  <td className="px-1 py-1">{p.CUSTOMER}</td>
                  <td className="px-1 py-1">{p.PRODUCT}</td>
                  <td className="px-1 py-1 text-right tabular-nums">{p.QTY_BAG}</td>
                  <td className="px-1 py-1">{p.DUE_DATE?.slice(5)}</td>
                  <td className="px-1 py-1">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        p.PRIORITY === "HIGH"
                          ? "bg-rose-600"
                          : p.PRIORITY === "MEDIUM"
                          ? "bg-amber-600"
                          : "bg-slate-600"
                      }`}
                    >
                      {p.PRIORITY}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title={`Production Plan (Today ${d.planDate})`}>
          <div className="space-y-1.5">
            {d.planByLine.map((g) => (
              <div key={g.line} className="flex items-center gap-1">
                <div className="w-14 shrink-0 text-xs font-semibold text-slate-300">{g.line}</div>
                <div className="flex flex-1 flex-wrap gap-1">
                  {g.plans.length === 0 ? (
                    <span className="text-xs text-slate-500">— ว่าง —</span>
                  ) : (
                    g.plans.map((p, i) => (
                      <div
                        key={i}
                        className={`${colorOf(p.PRODUCT)} rounded px-2 py-1 text-[10px] leading-tight text-white`}
                        title={`${p.PRODUCT} ${p.START}-${p.END} (${p.TARGET})`}
                      >
                        <div className="font-semibold">{p.PRODUCT}</div>
                        <div className="opacity-80">
                          {p.START}-{p.END}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-700 pt-2 text-[10px]">
            {d.productLegend.map((prod) => (
              <span key={prod} className="flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${colorOf(prod)}`} />
                {prod}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Raw Material Status">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400">
              <tr>
                <th className="px-1 py-1">MATERIAL</th>
                <th className="px-1 py-1 text-right">NEED</th>
                <th className="px-1 py-1 text-right">STOCK</th>
                <th className="px-1 py-1 text-right">BALANCE</th>
                <th className="px-1 py-1 text-right">COVER</th>
              </tr>
            </thead>
            <tbody>
              {d.materials.map((m) => (
                <tr key={m.material} className="border-t border-slate-700/60">
                  <td className="px-1 py-1">{m.material}</td>
                  <td className="px-1 py-1 text-right tabular-nums">{m.need.toLocaleString()}</td>
                  <td className="px-1 py-1 text-right tabular-nums">{m.stock.toLocaleString()}</td>
                  <td className={`px-1 py-1 text-right font-semibold tabular-nums ${SEV_TEXT[m.status]}`}>
                    {m.balance.toLocaleString()}
                  </td>
                  <td className="px-1 py-1 text-right tabular-nums">
                    {m.coverageDays === null ? "—" : `${m.coverageDays} วัน`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel title="Bag Stock Status (Unit : Bag)" className="mb-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10">
          {d.bags.map((b) => (
            <div key={b.pkg} className="rounded border border-slate-700 bg-slate-900/60 p-2 text-center">
              <div className="text-[10px] text-slate-400">{b.pkg}</div>
              <div className="text-[10px] text-slate-500">{b.size}</div>
              <div className="my-1 text-lg font-bold tabular-nums text-white">
                {b.stock.toLocaleString()}
              </div>
              <span className={`block rounded px-1 py-0.5 text-[10px] font-bold text-white ${SEV_BADGE[b.status]}`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Panel title="Changeover Alert">
          {d.changeover ? (
            <div className="p-2 text-sm">
              <div className="mb-2 text-base font-bold text-amber-400">{d.changeover.line}</div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-slate-700 px-2 py-1 text-xs">{d.changeover.from}</span>
                <span className="text-slate-400">→</span>
                <span className="rounded bg-slate-700 px-2 py-1 text-xs">{d.changeover.to}</span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                เวลาทำความสะอาด/เปลี่ยนรุ่น :{" "}
                <span className="font-bold text-white">{d.changeover.cleaningMin} นาที</span>
              </div>
            </div>
          ) : (
            <div className="p-2 text-sm text-slate-500">ไม่มี changeover</div>
          )}
        </Panel>

        <Panel title="Capacity Today">
          <div className="flex flex-wrap items-center justify-around gap-2 p-1">
            {d.lines.map((l) => (
              <div key={l.line} className="flex flex-col items-center gap-1">
                <Gauge pct={l.utilizationPct} />
                <span className="text-[11px] text-slate-300">{l.line}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Note / Alert">
          <ul className="space-y-1.5 p-1 text-xs">
            {d.notes.map((n, i) => (
              <li key={i} className="flex items-start gap-2">
                <span>{n.level === "critical" ? "🔴" : n.level === "warn" ? "🟡" : "🔵"}</span>
                <span
                  className={
                    n.level === "critical"
                      ? "text-rose-300"
                      : n.level === "warn"
                      ? "text-amber-300"
                      : "text-slate-300"
                  }
                >
                  {n.text}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </main>
  );
}
