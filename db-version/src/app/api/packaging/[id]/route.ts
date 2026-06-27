import { Packaging } from "@/models/models";
import { itemRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET / PUT / DELETE /api/packaging/:id
export const { GET, PUT, DELETE } = itemRoute(Packaging, { unique: "PACKAGE" });
