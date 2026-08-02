// Shared by the login API route (Node runtime) and middleware (Edge runtime),
// so it can only use Web Crypto (crypto.subtle), not Node's `crypto` module.
export async function hashAdminPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export const ADMIN_SESSION_COOKIE = "admin_session";

// /admin/* pages are gated by proxy.ts, but /api/admin/* routes are not
// (the matcher only covers page routes), so mutating API routes must check
// the same session cookie themselves before touching data.
export async function isAdminRequest(req: Request): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  if (!match) return false;

  const session = decodeURIComponent(match.slice(ADMIN_SESSION_COOKIE.length + 1));
  const expected = await hashAdminPassword(adminPassword);
  return session === expected;
}
