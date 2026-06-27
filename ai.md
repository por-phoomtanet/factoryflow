คุณคือ Senior Next.js Developer

ต้องการทดสอบการอ่านข้อมูลจาก Google Sheet ที่ Publish เป็น CSV

CSV URL:

https://docs.google.com/spreadsheets/d/e/2PACX-1vQDE4OZqH9FBqRYYHl6Cg141wx4RY_69IGcv3-2S7bkmTggKT-TVsn8CSj7CRCqljP3AeEKpb1ZnmtV/pub?gid=1379843816&single=true&output=csv

กรุณาสร้างตัวอย่างโปรเจค Next.js (App Router) สำหรับทดสอบดังนี้

Requirements:

1. ติดตั้ง papaparse
2. สร้าง service ชื่อ googleSheet.ts
3. fetch CSV จาก URL
4. แปลง CSV เป็น JSON
5. แสดงผลใน console
6. สร้าง API Route /api/po
7. สร้างหน้า /test-po
8. แสดงข้อมูลใน Table
9. แสดงจำนวน PO ทั้งหมด
10. จัดการ Error กรณี fetch ไม่สำเร็จ

Technology:
- Next.js 15
- TypeScript
- App Router
- TailwindCSS
- papaparse
- docker compose

Expected Result:

API:
GET /api/po

Response:

[
  {
    "PO_NO": "...",
    "CUSTOMER": "...",
    "PRODUCT": "...",
    "QTY_BAG": "...",
    "DUE_DATE": "...",
    "PRIORITY": "...",
    "STATUS": "..."
  }
]

Structure:

src/
 ├ services/
 │   └ googleSheet.ts
 ├ app/
 │   ├ api/
 │   │   └ po/
 │   │       └ route.ts
 │   └ test-po/
 │       └ page.tsx

กรุณาเขียนโค้ดที่สามารถรันได้ทันที พร้อม TypeScript Interface และ Error Handling