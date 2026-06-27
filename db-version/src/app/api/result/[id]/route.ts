import { Result } from "@/models/models";
import { itemRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET / PUT / DELETE /api/result/:id
export const { GET, PUT, DELETE } = itemRoute(Result);
