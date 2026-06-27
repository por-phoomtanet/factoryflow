import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FactoryFlow (MongoDB)",
  description: "FactoryFlow เวอร์ชัน MongoDB — web + API + database",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
