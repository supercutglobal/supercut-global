import { redirect } from "next/navigation";
import { getAdmin } from "../../../lib/auth";
import { listProducts } from "../../../lib/products";
import { ProductsManager } from "../../../components/admin/ProductsManager";

export const metadata = { title: "Admin products", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return <ProductsManager adminEmail={admin.email} initialProducts={await listProducts()} />;
}
