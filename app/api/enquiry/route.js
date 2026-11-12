import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { enquirySchema, fieldErrors } from "../../../lib/validation";
import { sendMail, escapeHtml } from "../../../lib/mail";
import { withHttpLog } from "../../../lib/httpLog";
import { clientIp, readJson, bodyErrorResponse } from "../../../lib/http";
import { hit } from "../../../lib/rateLimit";
import { emailProblem } from "../../../lib/emailCheck";
import { SALES_EMAIL } from "../../../data/contactData";

// Per-IP limit on form submissions (kept in MongoDB, survives restarts)
const MAX_PER_HOUR = 10;

function notificationHtml(e, when) {
  const row = (label, value) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#555;vertical-align:top">${label}</td><td style="padding:6px 0;font-weight:600">${value}</td></tr>`;
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0b1526">
  <h2 style="color:#0b1f4b;margin:0 0 12px">New enquiry</h2>
  <p style="margin:0 0 16px">Someone sent an enquiry from the website. Reply to this email to answer them directly.</p>
  <table style="border-collapse:collapse">
    ${row("Full name", escapeHtml(e.name))}
    ${row("Company", escapeHtml(e.companyName))}
    ${row("Email", escapeHtml(e.email))}
    ${row("Phone / WhatsApp", escapeHtml(e.phone))}
    ${row("Country", escapeHtml(e.country))}
    ${row("Time", escapeHtml(when))}
  </table>
  <h3 style="color:#0b1f4b;margin:20px 0 8px">Message</h3>
  <p style="margin:0;white-space:pre-wrap">${escapeHtml(e.message)}</p>
</div>`;
}

export const POST = withHttpLog(async function POST(request, _context, log) {
  const ip = clientIp(request);
  if ((await hit(`enquiry:${ip}`, 60 * 60 * 1000)) > MAX_PER_HOUR) {
    log.warn({ ip }, "enquiry form throttled");
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body;
  try {
    body = await readJson(request);
  } catch (err) {
    return bodyErrorResponse(err);
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    // A filled honeypot means a bot: answer like a validation error without saying why
    if (fields.company) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    return NextResponse.json({ error: "Check the highlighted fields", fields }, { status: 400 });
  }
  const { company: _honeypot, ...enquiry } = parsed.data;

  const problem = await emailProblem(enquiry.email);
  if (problem) {
    log.info({ email: enquiry.email, reason: problem }, "enquiry email rejected");
    return NextResponse.json({ error: "Check the highlighted fields", fields: { email: problem } }, { status: 400 });
  }
  const now = new Date();

  // Kept in the database too, so no enquiry is lost if an email fails
  let enquiryId = crypto.randomUUID();
  try {
    const db = await getDb();
    const { insertedId } = await db.collection("enquiries").insertOne({ ...enquiry, ip, createdAt: now });
    enquiryId = insertedId.toString();
  } catch (err) {
    log.error({ err }, "could not save enquiry");
  }

  const to = (process.env.ENQUIRY_NOTIFY_TO || process.env.CATALOGUE_NOTIFY_TO || SALES_EMAIL)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  try {
    const when = now.toLocaleString("en-GB", { timeZone: "Asia/Dubai", dateStyle: "medium", timeStyle: "short" }) + " (UAE)";
    await sendMail({
      to,
      subject: `New enquiry from ${enquiry.name} (${enquiry.companyName})`,
      html: notificationHtml(enquiry, when),
      replyTo: enquiry.email,
    });
  } catch (err) {
    log.error({ err, enquiryId }, "enquiry notification email failed");
    // The team works from the email, so the visitor is told to retry rather than shown a false "sent"
    return NextResponse.json({ error: "We couldn't send your enquiry right now. Please try again later." }, { status: 503 });
  }

  log.info({ enquiryId, email: enquiry.email }, "enquiry received");
  return NextResponse.json({ ok: true });
});
