"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}
interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    group: "ภาพรวม",
    items: [{ href: "/dashboard", label: "Dashboard", icon: "📊" }],
  },
  {
    group: "คำสั่งผลิต",
    items: [
      { href: "/view/po", label: "PO_LIST", icon: "📋" },
      { href: "/view/plan", label: "PRODUCTION_PLAN", icon: "🗓️" },
      { href: "/view/result", label: "PRODUCTION_RESULT", icon: "✅" },
    ],
  },
  {
    group: "คลังวัตถุดิบ/บรรจุ",
    items: [
      { href: "/view/material", label: "RAW_MATERIAL", icon: "🐟" },
      { href: "/view/bom", label: "PRODUCT_BOM", icon: "🧾" },
      { href: "/view/packaging", label: "PACKAGING_STOCK", icon: "📦" },
    ],
  },
  {
    group: "สายการผลิต",
    items: [{ href: "/view/line", label: "PRODUCTION_LINE", icon: "🏭" }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col overflow-y-auto border-r border-slate-800 bg-slate-900 text-slate-100">
      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-4">
        <span className="text-lg font-bold tracking-wide">FactoryFlow</span>
        <span className="rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-semibold">
          Google Sheet
        </span>
      </Link>

      <nav className="flex-1 px-2 pb-4">
        {NAV.map((g) => (
          <div key={g.group} className="mb-4">
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {g.group}
            </div>
            {g.items.map((it) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-slate-700 font-medium text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span>{it.icon}</span>
                  <span className="truncate">{it.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
