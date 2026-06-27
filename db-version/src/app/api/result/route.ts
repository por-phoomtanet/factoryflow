import { Result } from "@/models/models";
import { collectionRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET (list) + POST (create) /api/result
export const { GET, POST } = collectionRoute(Result, {
  sort: { DATE: 1, LINE: 1 },
});
