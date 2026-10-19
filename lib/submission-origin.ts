/** Chấp nhận yêu cầu từ chính website, kể cả tên miền Vercel/miền riêng mới. */
export function dungMienNopBai(req: Request, env: Record<string, string | undefined> = process.env): boolean {
  const allowed = new Set([
    new URL(req.url).host,
    req.headers.get("host")?.toLowerCase(),
    "luyen-trac-nghiem-tin-12.vercel.app",
    "localhost:3000", "localhost:3001", "localhost:3002",
    "127.0.0.1:3000", "127.0.0.1:3001", "127.0.0.1:3002",
    env.VERCEL_URL, env.VERCEL_PROJECT_PRODUCTION_URL, env.VERCEL_BRANCH_URL,
    ...(env.MIEN_CHO_PHEP_THEM ?? "").split(",").map((host) => host.trim().toLowerCase()).filter(Boolean),
  ]);
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const url = new URL(origin);
    return (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username && !url.password && allowed.has(url.host);
  } catch {
    return false;
  }
}
