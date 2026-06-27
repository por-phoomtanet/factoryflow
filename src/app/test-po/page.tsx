"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PurchaseOrder } from "@/services/googleSheet";

const PRIORITY_STYLE: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
};

const STATUS_STYLE: Record<string, string> = {
  WAITING: "bg-gray-100 text-gray-700",
  RUNNING: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
};

const AUTO_REFRESH_MS = 10_000; // 10 วินาที

function Badge({ value, map }: { value: string; map: Record<string, string> }) {
  const cls = map[value?.toUpperCase()] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {value}
    </span>
  );
}

export default function TestPoPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/po", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error ?? `HTTP ${res.status}`);
      }
      setOrders(json as PurchaseOrder[]);
      setError(null);
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // โหลดครั้งแรก
  useEffect(() => {
    load();
  }, [load]);

  // auto-refresh ทุก 10 วินาที (เมื่อเปิดใช้งาน)
  const savedLoad = useRef(load);
  savedLoad.current = load;
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => savedLoad.current(), AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [autoRefresh]);

  return (
    <main className="mx-auto max-w-6xl p-6 sm:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">รายการ PO (Purchase Orders)</h1>
          <p className="mt-1 text-gray-600">ข้อมูลจาก Google Sheet (Published CSV)</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4"
            />
            auto-refresh (10 วิ)
          </label>
          <button
            onClick={load}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "กำลังโหลด..." : "ดึงข้อมูลใหม่"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">เกิดข้อผิดพลาดในการดึงข้อมูล</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white">
              <span className="text-sm">จำนวน PO ทั้งหมด</span>
              <span className="text-lg font-bold">{orders.length}</span>
            </div>
            {updatedAt && (
              <span className="text-xs text-gray-400">
                อัปเดตล่าสุด {updatedAt.toLocaleTimeString("th-TH")}
              </span>
            )}
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">PO_NO</th>
                  <th className="px-4 py-3 font-medium">CUSTOMER</th>
                  <th className="px-4 py-3 font-medium">PRODUCT</th>
                  <th className="px-4 py-3 text-right font-medium">QTY_BAG</th>
                  <th className="px-4 py-3 font-medium">DUE_DATE</th>
                  <th className="px-4 py-3 font-medium">PRIORITY</th>
                  <th className="px-4 py-3 font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((po, i) => (
                  <tr
                    key={po.PO_NO + i|| i}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-mono">{po.PO_NO}</td>
                    <td className="px-4 py-3">{po.CUSTOMER}</td>
                    <td className="px-4 py-3">{po.PRODUCT}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{po.QTY_BAG}</td>
                    <td className="px-4 py-3">{po.DUE_DATE}</td>
                    <td className="px-4 py-3">
                      <Badge value={po.PRIORITY} map={PRIORITY_STYLE} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge value={po.STATUS} map={STATUS_STYLE} />
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      ไม่มีข้อมูล PO
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
