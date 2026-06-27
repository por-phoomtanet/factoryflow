"use client";

import { useParams } from "next/navigation";
import { COLLECTIONS } from "@/lib/collections";
import CrudManager from "@/components/CrudManager";

export default function ManageCollectionPage() {
  const params = useParams<{ collection: string }>();
  const config = COLLECTIONS.find((c) => c.key === params.collection);

  if (!config) {
    return (
      <main className="mx-auto max-w-6xl p-6 sm:p-10">
        <p className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          ไม่พบ collection &quot;{params.collection}&quot;
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6 sm:p-10">
      <h1 className="text-2xl font-bold">{config.label}</h1>
      <p className="mt-1 text-sm text-gray-500">จัดการข้อมูล (เพิ่ม/แก้ไข/ลบ) ผ่าน MongoDB</p>
      <div className="mt-6">
        <CrudManager key={config.key} config={config} />
      </div>
    </main>
  );
}
