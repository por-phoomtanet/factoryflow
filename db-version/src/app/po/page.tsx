"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Po {
  _id: string;
  PO_NO: string;
  CUSTOMER: string;
  PRODUCT: string;
  QTY_BAG: string;
  DUE_DATE: string;
  PRIORITY: string;
  STATUS: string;
}

type FormState = Omit<Po, "_id">;

const EMPTY: FormState = {
  PO_NO: "",
  CUSTOMER: "",
  PRODUCT: "",
  QTY_BAG: "",
  DUE_DATE: "",
  PRIORITY: "LOW",
  STATUS: "WAITING",
};

const PRIORITIES = ["HIGH", "MEDIUM", "LOW"];
const STATUSES = ["WAITING", "RUNNING", "FINISH"];

export default function PoManagementPage() {
  const [items, setItems] = useState<Po[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/po", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setItems(json as Po[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  const startEdit = (po: Po) => {
    setEditingId(po._id);
    setForm({
      PO_NO: po.PO_NO,
      CUSTOMER: po.CUSTOMER,
      PRODUCT: po.PRODUCT,
      QTY_BAG: po.QTY_BAG,
      DUE_DATE: po.DUE_DATE,
      PRIORITY: po.PRIORITY,
      STATUS: po.STATUS,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = editingId ? `/api/po/${editingId}` : "/api/po";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (po: Po) => {
    if (!confirm(`ลบ ${po.PO_NO} ?`)) return;
    try {
      const res = await fetch(`/api/po/${po._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      if (editingId === po._id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <main className="mx-auto max-w-6xl p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">จัดการ PO (MongoDB CRUD)</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← กลับ Dashboard
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ===== ฟอร์มเพิ่ม/แก้ไข ===== */}
      <form
        onSubmit={submit}
        className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
      >
        <h2 className="mb-3 font-semibold">
          {editingId ? "✏️ แก้ไข PO" : "➕ เพิ่ม PO ใหม่"}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm">
            PO_NO
            <input
              {...field("PO_NO")}
              required
              disabled={!!editingId}
              placeholder="PO250626-010"
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 disabled:bg-gray-100"
            />
          </label>
          <label className="text-sm">
            CUSTOMER
            <input {...field("CUSTOMER")} className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5" />
          </label>
          <label className="text-sm">
            PRODUCT
            <input {...field("PRODUCT")} className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5" />
          </label>
          <label className="text-sm">
            QTY_BAG
            <input {...field("QTY_BAG")} type="number" className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5" />
          </label>
          <label className="text-sm">
            DUE_DATE
            <input {...field("DUE_DATE")} type="date" className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5" />
          </label>
          <label className="text-sm">
            PRIORITY
            <select {...field("PRIORITY")} className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5">
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            STATUS
            <select {...field("STATUS")} className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5">
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "กำลังบันทึก..." : editingId ? "บันทึกการแก้ไข" : "เพิ่ม PO"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
            >
              ยกเลิก
            </button>
          )}
        </div>
      </form>

      {/* ===== ตาราง ===== */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          ทั้งหมด <b>{items.length}</b> รายการ
        </span>
        <button onClick={load} className="text-sm text-blue-600 hover:underline">
          รีเฟรช
        </button>
      </div>

      <div className="mt-2 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="px-3 py-2 font-medium">PO_NO</th>
              <th className="px-3 py-2 font-medium">CUSTOMER</th>
              <th className="px-3 py-2 font-medium">PRODUCT</th>
              <th className="px-3 py-2 text-right font-medium">QTY_BAG</th>
              <th className="px-3 py-2 font-medium">DUE_DATE</th>
              <th className="px-3 py-2 font-medium">PRIORITY</th>
              <th className="px-3 py-2 font-medium">STATUS</th>
              <th className="px-3 py-2 text-right font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((po) => (
              <tr key={po._id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-mono">{po.PO_NO}</td>
                <td className="px-3 py-2">{po.CUSTOMER}</td>
                <td className="px-3 py-2">{po.PRODUCT}</td>
                <td className="px-3 py-2 text-right tabular-nums">{po.QTY_BAG}</td>
                <td className="px-3 py-2">{po.DUE_DATE}</td>
                <td className="px-3 py-2">{po.PRIORITY}</td>
                <td className="px-3 py-2">{po.STATUS}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => startEdit(po)} className="text-blue-600 hover:underline">
                    แก้ไข
                  </button>
                  <span className="px-1 text-gray-300">|</span>
                  <button onClick={() => remove(po)} className="text-red-600 hover:underline">
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-gray-400">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
