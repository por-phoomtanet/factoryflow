import { Po } from "@/models/models";
import { collectionRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET /api/po (list) + POST /api/po (create) — PO_NO ต้องไม่ซ้ำ
export const { GET, POST } = collectionRoute(Po, {
  unique: "PO_NO",
  sort: { PO_NO: 1 },
});
