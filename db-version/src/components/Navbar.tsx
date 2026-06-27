"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/manage", label: "จัดการข้อมูล", icon: "📋" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900 text-slate-100">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-wide">FactoryFlow</span>
          <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold">
            MongoDB
          </span>
        </Link>

        {/* links */}
        <div className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active =
              pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="mr-1">{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
