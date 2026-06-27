import { connectDB } from "./mongodb";
import { seedData } from "./seedData";
import { Po, Plan, Result, Material, Bom, Packaging, Line } from "@/models/models";

/**
 * เคลียร์ทุก collection แล้ว insert ข้อมูลตัวอย่างใหม่ทั้งหมด
 */
export async function reseed() {
  await connectDB();
  await Promise.all([
    Po.deleteMany({}),
    Plan.deleteMany({}),
    Result.deleteMany({}),
    Material.deleteMany({}),
    Bom.deleteMany({}),
    Packaging.deleteMany({}),
    Line.deleteMany({}),
  ]);
  await Promise.all([
    Po.insertMany(seedData.po_list),
    Plan.insertMany(seedData.production_plan),
    Result.insertMany(seedData.production_result),
    Material.insertMany(seedData.raw_material),
    Bom.insertMany(seedData.product_bom),
    Packaging.insertMany(seedData.packaging_stock),
    Line.insertMany(seedData.production_line),
  ]);
  return {
    po_list: seedData.po_list.length,
    production_plan: seedData.production_plan.length,
    production_result: seedData.production_result.length,
    raw_material: seedData.raw_material.length,
    product_bom: seedData.product_bom.length,
    packaging_stock: seedData.packaging_stock.length,
    production_line: seedData.production_line.length,
  };
}

/**
 * seed อัตโนมัติเมื่อฐานข้อมูลว่าง (เรียกตอน read route ครั้งแรก)
 * เพื่อให้เปิดแอปแล้วมีข้อมูลแสดงทันที ไม่ต้องยิง /api/seed เอง
 */
export async function ensureSeeded() {
  await connectDB();
  const count = await Po.estimatedDocumentCount();
  if (count === 0) {
    console.log("[seed] ฐานข้อมูลว่าง — กำลัง seed ข้อมูลตัวอย่าง...");
    await reseed();
  }
}
