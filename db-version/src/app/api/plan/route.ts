import { Plan } from "@/models/models";
import { collectionRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET (list) + POST (create) /api/plan
export const { GET, POST } = collectionRoute(Plan, {
  sort: { PLAN_DATE: 1, LINE: 1, START: 1 },
});
