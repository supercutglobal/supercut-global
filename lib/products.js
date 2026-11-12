import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import { getDb } from "./db";

const PRODUCTS_TAG = "products";

/** All products in display order (oldest first, so the original catalogue leads) */
export async function listProducts() {
  const db = await getDb();
  const docs = await db.collection("products").find().sort({ createdAt: 1, _id: 1 }).toArray();
  return docs.map(serializeProduct);
}

export function serializeProduct(p) {
  return {
    _id: p._id.toString(),
    title: p.title,
    description: p.description,
    imageUrl: p.imageUrl,
    imagePublicId: p.imagePublicId,
  };
}

/**
 * Public product list, cached between requests so visitors don't hit MongoDB on every page view.
 * Tagged, so refreshProducts() makes the very next request read fresh data; hourly as a fallback.
 * The admin dashboard keeps using listProducts() directly so it always shows live data.
 */
export const listProductsCached = unstable_cache(listProducts, ["products-list"], { tags: [PRODUCTS_TAG], revalidate: 3600 });

/** Call after any product add / edit / delete: drops the cached list and the rendered Products page */
export function refreshProducts() {
  revalidateTag(PRODUCTS_TAG);
  revalidatePath("/products");
}
