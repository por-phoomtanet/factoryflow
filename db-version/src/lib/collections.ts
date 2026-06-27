/**
 * config ของแต่ละ collection สำหรับ generic CRUD UI
 * (ไฟล์นี้ปลอดภัยฝั่ง client — ไม่ import โมดูล server)
 *
 * key       = path ของ API (/api/{key})
 * uniqueKey = field ที่ห้ามแก้ตอน edit (ตรงกับ unique ในฝั่ง API)
 * fields    = คอลัมน์/ช่องกรอก
 */

export type FieldType = "text" | "number" | "date" | "select";

export interface Field {
  name: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
}

export interface CollectionConfig {
  key: string;
  label: string;
  uniqueKey?: string;
  fields: Field[];
}

export const COLLECTIONS: CollectionConfig[] = [
  {
    key: "po",
    label: "PO_LIST",
    uniqueKey: "PO_NO",
    fields: [
      { name: "PO_NO", required: true },
      { name: "CUSTOMER" },
      { name: "PRODUCT" },
      { name: "QTY_BAG", type: "number" },
      { name: "DUE_DATE", type: "date" },
      { name: "PRIORITY", type: "select", options: ["HIGH", "MEDIUM", "LOW"] },
      { name: "STATUS", type: "select", options: ["WAITING", "RUNNING", "FINISH"] },
    ],
  },
  {
    key: "plan",
    label: "PRODUCTION_PLAN",
    fields: [
      { name: "PLAN_DATE", type: "date" },
      { name: "LINE" },
      { name: "PO_NO" },
      { name: "PRODUCT" },
      { name: "START" },
      { name: "END" },
      { name: "TARGET", type: "number" },
    ],
  },
  {
    key: "result",
    label: "PRODUCTION_RESULT",
    fields: [
      { name: "DATE", type: "date" },
      { name: "LINE" },
      { name: "PO_NO" },
      { name: "PRODUCT" },
      { name: "TARGET", type: "number" },
      { name: "ACTUAL", type: "number" },
      { name: "REJECT", type: "number" },
      { name: "STATUS", type: "select", options: ["RUNNING", "FINISH"] },
    ],
  },
  {
    key: "material",
    label: "RAW_MATERIAL",
    uniqueKey: "CODE",
    fields: [
      { name: "CODE", required: true },
      { name: "MATERIAL" },
      { name: "UNIT" },
      { name: "STOCK", type: "number" },
      { name: "SAFETY_STOCK", type: "number" },
    ],
  },
  {
    key: "bom",
    label: "PRODUCT_BOM",
    fields: [
      { name: "PRODUCT" },
      { name: "MATERIAL" },
      { name: "QTY_PER_1000_BAG", type: "number" },
      { name: "UNIT" },
    ],
  },
  {
    key: "packaging",
    label: "PACKAGING_STOCK",
    uniqueKey: "PACKAGE",
    fields: [
      { name: "PACKAGE", required: true },
      { name: "SIZE" },
      { name: "STOCK", type: "number" },
      { name: "MINIMUM", type: "number" },
    ],
  },
  {
    key: "line",
    label: "PRODUCTION_LINE",
    uniqueKey: "LINE",
    fields: [
      { name: "LINE", required: true },
      { name: "CAPACITY", type: "number" },
      { name: "CHANGEOVER", type: "number" },
    ],
  },
];
