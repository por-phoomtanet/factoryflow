import mongoose, { Schema, model, models } from "mongoose";

/**
 * Schema ทั้ง 7 collection — ตรงกับ 7 แท็บใน Google Sheet เวอร์ชันเดิม
 * (timestamps เก็บ createdAt/updatedAt ให้อัตโนมัติ)
 */

const PoSchema = new Schema(
  {
    PO_NO: { type: String, required: true, unique: true },
    CUSTOMER: String,
    PRODUCT: String,
    QTY_BAG: String,
    DUE_DATE: String,
    PRIORITY: String,
    STATUS: String,
  },
  { timestamps: true }
);

const PlanSchema = new Schema(
  {
    PLAN_DATE: String,
    LINE: String,
    PO_NO: String,
    PRODUCT: String,
    START: String,
    END: String,
    TARGET: String,
  },
  { timestamps: true }
);

const ResultSchema = new Schema(
  {
    DATE: String,
    LINE: String,
    PO_NO: String,
    PRODUCT: String,
    TARGET: String,
    ACTUAL: String,
    REJECT: String,
    STATUS: String,
  },
  { timestamps: true }
);

const MaterialSchema = new Schema(
  {
    CODE: String,
    MATERIAL: String,
    UNIT: String,
    STOCK: String,
    SAFETY_STOCK: String,
  },
  { timestamps: true }
);

const BomSchema = new Schema(
  {
    PRODUCT: String,
    MATERIAL: String,
    QTY_PER_1000_BAG: String,
    UNIT: String,
  },
  { timestamps: true }
);

const PackagingSchema = new Schema(
  {
    PACKAGE: String,
    SIZE: String,
    STOCK: String,
    MINIMUM: String,
  },
  { timestamps: true }
);

const LineSchema = new Schema(
  {
    LINE: String,
    CAPACITY: String,
    CHANGEOVER: String,
  },
  { timestamps: true }
);

// ใช้ models.X ?? model(...) กัน OverwriteModelError ตอน hot-reload
export const Po = models.Po ?? model("Po", PoSchema, "po_list");
export const Plan = models.Plan ?? model("Plan", PlanSchema, "production_plan");
export const Result =
  models.Result ?? model("Result", ResultSchema, "production_result");
export const Material =
  models.Material ?? model("Material", MaterialSchema, "raw_material");
export const Bom = models.Bom ?? model("Bom", BomSchema, "product_bom");
export const Packaging =
  models.Packaging ?? model("Packaging", PackagingSchema, "packaging_stock");
export const Line = models.Line ?? model("Line", LineSchema, "production_line");

export type { mongoose };
