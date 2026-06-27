import { Bom } from "@/models/models";
import { collectionRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET (list) + POST (create) /api/bom
export const { GET, POST } = collectionRoute(Bom, {
  sort: { PRODUCT: 1, MATERIAL: 1 },
});
