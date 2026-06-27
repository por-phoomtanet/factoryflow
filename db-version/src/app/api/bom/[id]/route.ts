import { Bom } from "@/models/models";
import { itemRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET / PUT / DELETE /api/bom/:id
export const { GET, PUT, DELETE } = itemRoute(Bom);
