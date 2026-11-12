import { logger } from "./logger";

/**
 * Sends an email through the Resend API (https://resend.com/docs/api-reference/emails/send-email).
 * Needs RESEND_API_KEY; MAIL_FROM must be an address on a domain verified in Resend
 * (until then Resend only allows onboarding@resend.dev, and only to the Resend account's own email).
 */
export async function sendMail({ to, subject, html, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || "Super Cut Website <onboarding@resend.dev>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo && { reply_to: replyTo }),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Resend error ${res.status}`);
  logger.debug({ emailId: data.id, subject }, "email sent");
  return data;
}

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);
