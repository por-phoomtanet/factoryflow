import { Plan } from "@/models/models";
import { itemRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET / PUT / DELETE /api/plan/:id
export const { GET, PUT, DELETE } = itemRoute(Plan);
