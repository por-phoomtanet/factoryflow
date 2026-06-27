"use client";

import { useState } from "react";
import { COLLECTIONS } from "@/lib/collections";
import CrudManager from "@/components/CrudManager";

export default function ManagePage() {
  const [active, setActive] = useState(COLLECTIONS[0].key);
  const config = COLLECTIONS.find((c) => c.key === active) ?? COLLECTIONS[0];

  return (
    <main className="mx-auto max-w-6xl p-6 sm:p-10">
      <h1 className="text-2xl font-bold">จัดการข้อมูล (MongoDB CRUD)</h1>

      {/* ===== แท็บเลือก collection ===== */}
      <div className="mt-4 flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {COLLECTIONS.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`rounded-t-lg px-3 py-1.5 text-sm font-medium ${
              active === c.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* key=active บังคับ remount เมื่อสลับแท็บ เพื่อรีเซ็ตฟอร์ม/สเตท */}
        <CrudManager key={active} config={config} />
      </div>
    </main>
  );
}
