"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CollectionConfig } from "@/lib/collections";

type Row = Record<string, unknown> & { _id: string };
type FormState = Record<string, string>;

export default function CrudManager({ config }: { config: CollectionConfig }) {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const empty = useMemo<FormState>(() => {
    const o: FormState = {};
    for (const f of config.fields) o[f.name] = f.options?.[f.options.length - 1] ?? "";
    return o;
  }, [config]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${config.key}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setItems(json as Row[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [config.key]);

  // โหลดใหม่ + เคลียร์ฟอร์มทุกครั้งที่สลับ collection
  useEffect(() => {
    setForm(empty);
    setEditingId(null);
    load();
  }, [load, empty]);

  const resetForm = () => {
    setForm(empty);
    setEditingId(null);
  };

  const startEdit = (row: Row) => {
    setEditingId(row._id);
    const f: FormState = {};
    for (const fld of config.fields) f[fld.name] = String(row[fld.name] ?? "");
    setForm(f);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = editingId ? `/api/${config.key}/${editingId}` : `/api/${config.key}`;
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

  const remove = async (row: Row) => {
    const idLabel = config.uniqueKey ? row[config.uniqueKey] : row._id;
    if (!confirm(`ลบ "${idLabel}" ?`)) return;
    try {
      const res = await fetch(`/api/${config.key}/${row._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      if (editingId === row._id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ===== ฟอร์มเพิ่ม/แก้ไข ===== */}
      <form onSubmit={submit} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h2 className="mb-3 font-semibold">
          {editingId ? `✏️ แก้ไข ${config.label}` : `➕ เพิ่ม ${config.label}`}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {config.fields.map((fld) => {
            const isLockedUnique = !!editingId && fld.name === config.uniqueKey;
            const common = {
              value: form[fld.name] ?? "",
              onChange: (
                e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
              ) => setForm((f) => ({ ...f, [fld.name]: e.target.value })),
              className:
                "mt-1 w-full rounded border border-gray-300 px-2 py-1.5 disabled:bg-gray-100",
            };
            return (
              <label key={fld.name} className="text-sm">
                {fld.name}
                {fld.required && <span className="text-red-500"> *</span>}
                {fld.type === "select" ? (
                  <select {...common}>
                    {fld.options?.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    {...common}
                    type={fld.type === "number" ? "number" : fld.type === "date" ? "date" : "text"}
                    required={fld.required}
                    disabled={isLockedUnique}
                  />
                )}
              </label>
            );
          })}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "กำลังบันทึก..." : editingId ? "บันทึกการแก้ไข" : "เพิ่ม"}
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
              {config.fields.map((f) => (
                <th key={f.name} className="px-3 py-2 font-medium">
                  {f.name}
                </th>
              ))}
              <th className="px-3 py-2 text-right font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id} className="border-t border-gray-100 hover:bg-gray-50">
                {config.fields.map((f) => (
                  <td
                    key={f.name}
                    className={`px-3 py-2 ${
                      f.type === "number" ? "text-right tabular-nums" : ""
                    } ${f.name === config.uniqueKey ? "font-mono" : ""}`}
                  >
                    {String(row[f.name] ?? "")}
                  </td>
                ))}
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  <button onClick={() => startEdit(row)} className="text-blue-600 hover:underline">
                    แก้ไข
                  </button>
                  <span className="px-1 text-gray-300">|</span>
                  <button onClick={() => remove(row)} className="text-red-600 hover:underline">
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={config.fields.length + 1} className="px-3 py-8 text-center text-gray-400">
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
