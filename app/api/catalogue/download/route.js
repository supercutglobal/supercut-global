import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { CATALOGUE_FILE, verifyDownloadToken } from "../../../../lib/catalogue";
import { withHttpLog } from "../../../../lib/httpLog";

export const GET = withHttpLog(async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!(await verifyDownloadToken(token))) {
    return NextResponse.json({ error: "This download link has expired. Please fill in the form again." }, { status: 403 });
  }

  const pdf = await fs.readFile(path.join(process.cwd(), CATALOGUE_FILE));
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Super-Cut-Catalogue.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
});
