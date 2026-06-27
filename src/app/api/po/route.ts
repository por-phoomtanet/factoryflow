import { NextResponse } from "next/server";
import { fetchPurchaseOrders } from "@/services/googleSheet";

// บังคับให้รันแบบ dynamic เสมอ (ไม่ pre-render ตอน build)
export const dynamic = "force-dynamic";

/**
 * GET /api/po
 * คืนค่า array ของ PurchaseOrder ในรูปแบบ JSON
 */
export async function GET() {
  try {
    const orders = await fetchPurchaseOrders();
    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/po] error:", message);
    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}
