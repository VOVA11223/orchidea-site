import { Resend } from "resend";

// Falls back to Resend's shared test sender when no custom domain is verified yet.
// Note: `onboarding@resend.dev` only delivers to the email address on the Resend
// account itself — for real delivery to orchidea_opt@mail.ru, verify a domain in
// the Resend dashboard and set RESEND_FROM_EMAIL to an address on that domain.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Orchidea <onboarding@resend.dev>";

export async function sendEmail(opts: { to: string; subject: string; text: string; html?: string }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[email stub] RESEND_API_KEY not set — would send to ${opts.to}:\nSubject: ${opts.subject}\n\n${opts.text}`);
    return { sent: false };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    ...(opts.html ? { html: opts.html } : {}),
  });

  if (error) {
    console.error("[email] Resend error:", error);
    throw new Error(error.message || "Failed to send email");
  }

  return { sent: true };
}
