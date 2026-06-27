# FactoryFlow

ตัวอย่างโปรเจค Next.js 15 (App Router) สำหรับทดสอบการอ่านข้อมูล PO จาก Google Sheet ที่ Publish เป็น CSV โดยใช้ `papaparse`

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- TailwindCSS v4
- papaparse
- Docker Compose

## โครงสร้าง
```
src/
 ├ services/
 │   └ googleSheet.ts      # fetch CSV → parse เป็น JSON (PurchaseOrder[])
 ├ app/
 │   ├ api/po/route.ts     # GET /api/po  → คืน JSON
 │   └ test-po/page.tsx    # หน้าตาราง + จำนวน PO ทั้งหมด
```

## วิธีรัน

### แบบที่ 1: Docker Compose (แนะนำ — ใช้ Node 20)
```bash
docker compose up --build
```
เปิด:
- http://localhost:3000/test-po
- http://localhost:3000/api/po

### แบบที่ 2: รันตรง (ต้องใช้ Node 18.18+ ; Node 16 ใช้ไม่ได้กับ Next 15)
```bash
npm install
npm run dev
```

## API

`GET /api/po`

```json
[
  {
    "PO_NO": "PO250626-001",
    "CUSTOMER": "ลูกค้า A",
    "PRODUCT": "ปลาหมึก A",
    "QTY_BAG": "12000",
    "DUE_DATE": "2026-06-27",
    "PRIORITY": "HIGH",
    "STATUS": "WAITING"
  }
]
```

หาก fetch ไม่สำเร็จจะคืน HTTP 502 พร้อม `{ "error": "..." }`

## ตั้งค่า CSV URL (optional)
สามารถ override ผ่าน environment variable `GOOGLE_SHEET_CSV_URL`
