import { redirect } from "next/navigation";
import { getAdmin } from "../../lib/auth";
import { getDb } from "../../lib/db";
import { AdminDashboard } from "../../components/admin/AdminDashboard";

export const metadata = { title: "Admin dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const db = await getDb();
  const productCount = await db.collection("products").countDocuments();

  return <AdminDashboard adminEmail={admin.email} productCount={productCount} />;
}
