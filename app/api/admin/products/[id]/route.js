import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAdmin } from "../../../../../lib/auth";
import { getDb } from "../../../../../lib/db";
import { serializeProduct, refreshProducts } from "../../../../../lib/products";
import { productUpdateSchema, fieldErrors } from "../../../../../lib/validation";
import { verifyUploadedImage, deleteImage } from "../../../../../lib/cloudinary";
import { withHttpLog } from "../../../../../lib/httpLog";
import { readJson, bodyErrorResponse } from "../../../../../lib/http";

const forbidden = () => NextResponse.json({ error: "Admin access required" }, { status: 403 });

async function findProduct(params) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return { error: NextResponse.json({ error: "Invalid product id" }, { status: 400 }) };
  const db = await getDb();
  const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
  if (!product) return { error: NextResponse.json({ error: "Product not found" }, { status: 404 }) };
  return { db, product };
}

export const PATCH = withHttpLog(async function PATCH(request, { params }, log) {
  const admin = await getAdmin();
  if (!admin) return forbidden();

  const { db, product, error } = await findProduct(params);
  if (error) return error;

  let body;
  try {
    body = await readJson(request);
  } catch (err) {
    return bodyErrorResponse(err);
  }

  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the highlighted fields", fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  const update = { updatedAt: new Date(), updatedBy: admin.email };
  if (parsed.data.title !== undefined) update.title = parsed.data.title;
  if (parsed.data.description !== undefined) update.description = parsed.data.description;

  const newImage = parsed.data.imagePublicId;
  const replacingImage = newImage && newImage !== product.imagePublicId;
  if (replacingImage) {
    const image = await verifyUploadedImage(newImage);
    if (!image.ok) {
      log.warn({ imagePublicId: newImage, reason: image.error }, "product image rejected");
      return NextResponse.json({ error: image.error, fields: { image: image.error } }, { status: 400 });
    }
    update.imagePublicId = newImage;
    update.imageUrl = image.url;
  }

  const updated = await db
    .collection("products")
    .findOneAndUpdate({ _id: product._id }, { $set: update }, { returnDocument: "after" });

  // Old image is no longer referenced once the new one is saved
  if (replacingImage) {
    await deleteImage(product.imagePublicId).catch((err) =>
      log.error({ err, imagePublicId: product.imagePublicId }, "could not delete replaced image")
    );
  }

  log.info(
    { productId: product._id.toString(), fields: Object.keys(parsed.data), admin: admin.email },
    "product updated"
  );
  refreshProducts();
  return NextResponse.json({ product: serializeProduct(updated) });
});

export const DELETE = withHttpLog(async function DELETE(request, { params }, log) {
  const admin = await getAdmin();
  if (!admin) return forbidden();

  const { db, product, error } = await findProduct(params);
  if (error) return error;

  await db.collection("products").deleteOne({ _id: product._id });
  await deleteImage(product.imagePublicId).catch((err) =>
    log.error({ err, imagePublicId: product.imagePublicId }, "could not delete product image")
  );

  log.info({ productId: product._id.toString(), title: product.title, admin: admin.email }, "product deleted");
  refreshProducts();
  return NextResponse.json({ ok: true });
});
