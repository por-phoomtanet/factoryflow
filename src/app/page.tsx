import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">FactoryFlow</h1>
      <p className="text-gray-600">ทดสอบการอ่านข้อมูล PO จาก Google Sheet (CSV)</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-slate-800 px-5 py-2.5 text-white hover:bg-slate-900"
        >
          📊 Production Dashboard (/dashboard)
        </Link>
        <Link
          href="/test-po"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
        >
          ดูตาราง PO (/test-po)
        </Link>
        <Link
          href="/test-plan"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
        >
          ดูแผนการผลิต (/test-plan)
        </Link>
        <Link
          href="/api/po"
          className="rounded-lg border border-gray-300 px-5 py-2.5 hover:bg-gray-50"
        >
          API JSON (/api/po)
        </Link>
      </div>
    </main>
  );
}
