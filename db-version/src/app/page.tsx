import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">FactoryFlow — MongoDB Edition</h1>
      <p className="text-gray-600">
        web + API + MongoDB (พอร์ต 4000) — ข้อมูลมาจากฐานข้อมูล ไม่ใช่ Google Sheet
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-slate-800 px-5 py-2.5 text-white hover:bg-slate-900"
        >
          📊 Production Dashboard
        </Link>
        <Link
          href="/po"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
        >
          📋 จัดการ PO (CRUD)
        </Link>
      </div>
    </main>
  );
}
