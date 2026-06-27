# FactoryFlow — MongoDB Edition

เวอร์ชันที่ 2 ของ FactoryFlow — ทำงานเหมือนเวอร์ชัน Google Sheet แต่เปลี่ยนแหล่งข้อมูลเป็น **MongoDB** และรองรับ **CRUD** จริง

## Stack
- Next.js 15 (App Router) + TypeScript + TailwindCSS
- MongoDB 7 + Mongoose
- Docker Compose (web :4000 + mongo :27017)

## รัน
```bash
docker compose up --build
```
- MongoDB จะ seed ข้อมูลตัวอย่างอัตโนมัติเมื่อฐานข้อมูลว่าง (ครั้งแรก)
- เปิด:
  - http://localhost:4000/dashboard — Production Dashboard
  - http://localhost:4000/po — จัดการ PO (เพิ่ม/แก้/ลบ)

## API
| Method | Path | หน้าที่ |
|---|---|---|
| GET | `/api/dashboard` | ข้อมูล dashboard (คำนวณจากทุก collection) |
| GET | `/api/po` | รายการ PO ทั้งหมด |
| POST | `/api/po` | สร้าง PO ใหม่ |
| GET | `/api/po/:id` | ดู PO รายตัว |
| PUT | `/api/po/:id` | แก้ไข PO |
| DELETE | `/api/po/:id` | ลบ PO |
| POST | `/api/seed` | ล้างแล้ว seed ข้อมูลตัวอย่างใหม่ |

## Collections (7)
po_list, production_plan, production_result, raw_material, product_bom, packaging_stock, production_line

## หมายเหตุ
- ข้อมูล seed เป็น hardcode ใน `src/lib/seedData.ts` (ไม่พึ่ง Google API)
- ใช้พอร์ต 4000 จึงรันคู่กับเวอร์ชัน Google Sheet (พอร์ต 3000) ได้พร้อมกัน
