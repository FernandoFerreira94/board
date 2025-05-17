// app/dashboard/page.tsx
import { getAuthSession } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./index";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) redirect("/");

  return <DashboardClient session={session} />;
}
