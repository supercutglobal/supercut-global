import { NextResponse } from "next/server";
import { getAdmin } from "../../../../lib/auth";
import { getDb } from "../../../../lib/db";
import { listProducts, serializeProduct, refreshProducts } from "../../../../lib/products";
import { productSchema, fieldErrors } from "../../../../lib/validation";
import { verifyUploadedImage } from "../../../../lib/cloudinary";
import { withHttpLog } from "../../../../lib/httpLog";
import { readJson, bodyErrorResponse } from "../../../../lib/http";

const forbidden = () => NextResponse.json({ error: "Admin access required" }, { status: 403 });

export const GET = withHttpLog(async function GET() {
  if (!(await getAdmin())) return forbidden();
  return NextResponse.json({ products: await listProducts() });
});

export const POST = withHttpLog(async function POST(request, _context, log) {
  const admin = await getAdmin();
  if (!admin) return forbidden();

  let body;
  try {
    body = await readJson(request);
  } catch (err) {
    return bodyErrorResponse(err);
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the highlighted fields", fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  const { title, description, imagePublicId } = parsed.data;

  // Don't trust the client: confirm the upload exists in our account and is a real image
  const image = await verifyUploadedImage(imagePublicId);
  if (!image.ok) {
    log.warn({ imagePublicId, reason: image.error }, "product image rejected");
    return NextResponse.json({ error: image.error, fields: { image: image.error } }, { status: 400 });
  }

  const db = await getDb();
  const doc = { title, description, imageUrl: image.url, imagePublicId, createdAt: new Date(), createdBy: admin.email };
  const { insertedId } = await db.collection("products").insertOne(doc);

  log.info({ productId: insertedId.toString(), title, admin: admin.email }, "product created");
  refreshProducts();
  return NextResponse.json({ product: serializeProduct({ ...doc, _id: insertedId }) }, { status: 201 });
});
