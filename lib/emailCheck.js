import { promises as dns } from "node:dns";

// Throwaway inbox services, so catalogue leads come with an address the team can reach later
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "guerrillamailblock.com",
  "sharklasers.com", "grr.la", "10minutemail.com", "10minutemail.net", "10minemail.com", "tempmail.com",
  "temp-mail.org", "temp-mail.io", "tempmail.net", "tempmailo.com", "tempail.com", "tempr.email",
  "throwawaymail.com", "trashmail.com", "trashmail.de", "trashmail.net", "yopmail.com", "yopmail.fr",
  "yopmail.net", "getnada.com", "nada.email", "dispostable.com", "maildrop.cc", "mailnesia.com",
  "mintemail.com", "mohmal.com", "emailondeck.com", "fakeinbox.com", "fakemail.net", "spamgourmet.com",
  "mailcatch.com", "moakt.com", "mytemp.email", "burnermail.io", "getairmail.com", "inboxkitten.com",
  "mail.tm", "mailpoof.com", "emailfake.com", "crazymailing.com", "discard.email", "spambox.us",
  "33mail.com", "anonaddy.me", "mailsac.com", "harakirimail.com", "1secmail.com", "1secmail.net",
  "1secmail.org", "emltmp.com", "linshiyouxiang.net", "byom.de", "trbvm.com", "zetmail.com",
]);

// Common typos of the big providers, answered with a "did you mean" hint
const TYPOS = {
  "gmial.com": "gmail.com", "gamil.com": "gmail.com", "gmai.com": "gmail.com", "gmail.co": "gmail.com",
  "gmaill.com": "gmail.com", "gnail.com": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.co": "hotmail.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.co": "yahoo.com",
  "outlok.com": "outlook.com", "outlook.co": "outlook.com", "iclod.com": "icloud.com",
};

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })), ms))]);

/**
 * Checks that an (already well-formed) email can really receive mail:
 * not a throwaway service, not a known typo, and its domain has mail servers (MX records).
 * Returns null when it looks deliverable, otherwise a message for the form.
 * DNS outages and timeouts are treated as "ok" so a slow resolver never blocks a real customer.
 */
export async function emailProblem(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return "Enter a valid email";
  if (TYPOS[domain]) return `Check your email. Did you mean ${email.split("@")[0]}@${TYPOS[domain]}?`;
  if (DISPOSABLE.has(domain)) return "Please use your work or personal email, not a temporary one";

  try {
    const mx = await withTimeout(dns.resolveMx(domain), 4000);
    // A "null MX" (RFC 7505) means the domain explicitly accepts no mail
    if (!mx.length || mx.every((r) => !r.exchange || r.exchange === ".")) return "This email domain can't receive mail";
  } catch (err) {
    if (err.code === "ENOTFOUND" || err.code === "ENODATA" || err.code === "ENOTIMP") {
      return "This email domain doesn't exist or can't receive mail";
    }
    return null;
  }

  return mailboxProblem(email);
}

/**
 * Asks ZeroBounce whether the exact inbox exists (e.g. catches a made-up name@gmail.com, which a
 * domain check can't). Only runs when ZEROBOUNCE_API_KEY is set; any API error, timeout or
 * "unknown" / "catch-all" answer lets the visitor through, so the download is never blocked by it.
 * https://www.zerobounce.net/docs/email-validation-api-quickstart/
 */
async function mailboxProblem(email) {
  const key = process.env.ZEROBOUNCE_API_KEY;
  if (!key) return null;

  try {
    const url = `https://api.zerobounce.net/v2/validate?api_key=${encodeURIComponent(key)}&email=${encodeURIComponent(email)}&ip_address=`;
    const res = await withTimeout(fetch(url), 5000);
    if (!res.ok) return null;
    const { status, sub_status: sub } = await res.json();
    if (status === "invalid") return "This email address doesn't exist. Please check it";
    if (status === "spamtrap" || status === "abuse") return "Please use a different email address";
    // do_not_mail also covers role addresses like sales@, which are fine for business enquiries
    if (status === "do_not_mail" && ["disposable", "toxic"].includes(sub)) {
      return "Please use your work or personal email, not a temporary one";
    }
    return null;
  } catch {
    return null;
  }
}
