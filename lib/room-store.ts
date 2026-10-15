// Compare-and-swap keeps simultaneous answers from overwriting each other.
const TTL = 3 * 60 * 60;
const PREFIX = "tin12:battle:v2:";
const local = new Map<string, { value: string; expires: number }>();
function config() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) return { url, token };
  if (process.env.VERCEL) throw new Error("ROOM_STORAGE_NOT_CONFIGURED");
  return null;
}
async function command(args: (string | number)[]): Promise<unknown> {
  const env = config();
  if (!env) throw new Error("Redis is not configured");
  const response = await fetch(env.url, {
    method: "POST", cache: "no-store",
    headers: { Authorization: `Bearer ${env.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(args), signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("ROOM_STORAGE_UNAVAILABLE");
  const data = await response.json();
  if (data.error) throw new Error("ROOM_STORAGE_UNAVAILABLE");
  return data.result;
}
export async function readRoom(pin: string): Promise<string | null> {
  if (config()) return await command(["GET", PREFIX + pin]) as string | null;
  const item = local.get(pin);
  if (!item || item.expires <= Date.now()) { local.delete(pin); return null; }
  return item.value;
}
export async function createRoom(pin: string, value: unknown): Promise<boolean> {
  const raw = JSON.stringify(value);
  if (config()) return await command(["SET", PREFIX + pin, raw, "NX", "EX", TTL]) === "OK";
  local.forEach((item, key) => { if (item.expires <= Date.now()) local.delete(key); });
  if (local.has(pin)) return false;
  local.set(pin, { value: raw, expires: Date.now() + TTL * 1000 });
  return true;
}
const CAS = "if redis.call('GET',KEYS[1]) == ARGV[1] then redis.call('SET',KEYS[1],ARGV[2],'EX',ARGV[3]); return 1 else return 0 end";
export async function replaceRoom(pin: string, previous: string, value: unknown): Promise<boolean> {
  const next = JSON.stringify(value);
  if (next === previous) return true;
  if (config()) return await command(["EVAL", CAS, 1, PREFIX + pin, previous, next, TTL]) === 1;
  if (local.get(pin)?.value !== previous) return false;
  local.set(pin, { value: next, expires: Date.now() + TTL * 1000 });
  return true;
}
