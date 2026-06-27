import { Material } from "@/models/models";
import { collectionRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET (list) + POST (create) /api/material — CODE ต้องไม่ซ้ำ
export const { GET, POST } = collectionRoute(Material, {
  unique: "CODE",
  sort: { CODE: 1 },
});
