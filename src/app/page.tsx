import Link from "next/link";

const CARDS = [
  {
    href: "/dashboard",
    icon: "📊",
    title: "Production Dashboard",
    desc: "ภาพรวมการผลิตเรียลไทม์ — KPI, แผนผลิต, วัตถุดิบ, ถุงบรรจุ, แจ้งเตือน",
  },
  {
    href: "/test-po",
    icon: "📋",
    title: "ตาราง PO",
    desc: "รายการ PO ทั้งหมดจาก Google Sheet (PO_LIST)",
  },
  {
    href: "/test-plan",
    icon: "🗓️",
    title: "แผนการผลิต",
    desc: "แผนการผลิตรายไลน์ (PRODUCTION_PLAN)",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">FactoryFlow — Google Sheet Edition</h1>
        <p className="mt-2 text-gray-600">
          ระบบวางแผนการผลิต — อ่านข้อมูลจาก Google Sheets API
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-400 hover:shadow-md"
          >
            <div className="text-4xl">{c.icon}</div>
            <h2 className="mt-3 text-lg font-semibold group-hover:text-blue-600">
              {c.title}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
