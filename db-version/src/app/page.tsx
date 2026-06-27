import { redirect } from "next/navigation";

// default → หน้า Dashboard
export default function Home() {
  redirect("/dashboard");
}
