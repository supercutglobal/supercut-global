import { ProductsGrid } from "../../components/ProductsGrid";
import { listProductsCached } from "../../lib/products";
import { PAGES } from "../../data/insertsData";
import { cldUrl } from "../../lib/cloudinaryUrl";

export const metadata = { title: "Products" };

// The product list itself is cached in lib/products.js and refreshed whenever an admin adds, edits or deletes a product

async function getItems() {
  try {
    const products = await listProductsCached();
    return products.map((p) => ({
      id: p._id,
      title: [p.title.toUpperCase()],
      image: cldUrl(p.imageUrl, 900),
      alt: p.title,
      desc: p.description,
    }));
  } catch (err) {
    // Database unreachable (e.g. env vars missing): show the built-in catalogue rather than an empty page
    console.error("Could not load products from MongoDB:", err.message);
    return PAGES.flatMap((p) => p.items);
  }
}

export default async function Page() {
  return <ProductsGrid items={await getItems()} />;
}
