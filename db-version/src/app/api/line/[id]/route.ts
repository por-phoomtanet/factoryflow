import { Line } from "@/models/models";
import { itemRoute } from "@/lib/crud";

export const dynamic = "force-dynamic";

// GET / PUT / DELETE /api/line/:id
export const { GET, PUT, DELETE } = itemRoute(Line, { unique: "LINE" });
