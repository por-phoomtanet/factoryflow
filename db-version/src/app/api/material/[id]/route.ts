import { Material } from "@/models/models";
import { itemRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET / PUT / DELETE /api/material/:id
export const { GET, PUT, DELETE } = itemRoute(Material, { unique: "CODE" });
