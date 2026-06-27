import { redirect } from "next/navigation";

// /manage → ไปที่ collection แรก (PO_LIST)
export default function ManageIndex() {
  redirect("/manage/po");
}
