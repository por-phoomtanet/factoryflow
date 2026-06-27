import { Line } from "@/models/models";
import { collectionRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET (list) + POST (create) /api/line — LINE ต้องไม่ซ้ำ
export const { GET, POST } = collectionRoute(Line, {
  unique: "LINE",
  sort: { LINE: 1 },
});
