import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FactoryFlow",
  description: "ทดสอบการอ่านข้อมูล PO จาก Google Sheet (CSV)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
