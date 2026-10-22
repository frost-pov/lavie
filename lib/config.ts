/**
 * Read at request time (bracket access stops Next from inlining it at build time),
 * so changing the variable on Vercel works after a plain redeploy.
 */
export function whatsappNumber(): string {
  const raw = process.env["WHATSAPP_NUMBER"] || process.env["NEXT_PUBLIC_" + "WHATSAPP_NUMBER"] || "";
  return raw.replace(/\D/g, "");
}
