import { Packaging } from "@/models/models";
import { collectionRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET (list) + POST (create) /api/packaging — PACKAGE ต้องไม่ซ้ำ
export const { GET, POST } = collectionRoute(Packaging, {
  unique: "PACKAGE",
  sort: { PACKAGE: 1 },
});
