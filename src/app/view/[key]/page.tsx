"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { VIEW_LABELS } from "@/lib/viewMeta";

const AUTO_REFRESH_MS = 15_000;
type Row = Record<string, string>;

export default function ViewPage() {
  const { key } = useParams<{ key: string }>();
  const label = VIEW_LABELS[key] ?? key;

  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sheet/${key}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setRows(json as Row[]);
      setError(null);
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  const saved = useRef(load);
  saved.current = load;
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => saved.current(), AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [autoRefresh]);

  // คอลัมน์ = key ของแถวแรก
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <main className="mx-auto max-w-6xl p-6 sm:p-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{label}</h1>
          <p className="mt-1 text-sm text-gray-500">ข้อมูลจาก Google Sheet (อ่านอย่างเดียว)</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4"
            />
            auto-refresh
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
          <p className="font-semibold">เกิดข้อผิดพลาด</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white">
              <span className="text-sm">ทั้งหมด</span>
              <span className="text-lg font-bold">{rows.length}</span>
            </span>
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
                  {columns.map((c) => (
                    <th key={c} className="px-3 py-2 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                    {columns.map((c) => (
                      <td key={c} className="px-3 py-2">
                        {row[c]}
                      </td>
                    ))}
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={Math.max(columns.length, 1)} className="px-3 py-8 text-center text-gray-400">
                      ไม่มีข้อมูล
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
