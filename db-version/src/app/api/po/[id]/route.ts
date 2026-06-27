import { Po } from "@/models/models";
import { itemRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET / PUT / DELETE /api/po/:id
export const { GET, PUT, DELETE } = itemRoute(Po, { unique: "PO_NO" });
