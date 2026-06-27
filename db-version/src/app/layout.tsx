import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "FactoryFlow (MongoDB)",
  description: "FactoryFlow เวอร์ชัน MongoDB — web + API + database",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </body>
    </html>
  );
}
