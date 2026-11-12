import { redirect } from "next/navigation";
import { getAdmin } from "../../../lib/auth";
import { LoginForm } from "../../../components/admin/LoginForm";

export const metadata = { title: "Admin login", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  if (await getAdmin()) redirect("/admin");
  return <LoginForm />;
}
