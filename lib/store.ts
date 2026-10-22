import { promises as fs } from "fs";
import path from "path";

/**
 * Stock state, keyed by product slug.
 * - `price`: your retail price in KES (null = "ask on WhatsApp")
 * - `flavors`: flavor name -> in stock?
 * A product shows on the storefront only if at least one flavor is in stock.
 */
export type ProductState = { price: number | null; flavors: Record<string, boolean> };
export type StoreState = { updatedAt: string; products: Record<string, ProductState> };

const empty = (): StoreState => ({ updatedAt: new Date().toISOString(), products: {} });

const FILE = path.join(process.cwd(), "data", "state.json");
const KEY = "lavie-stock";

const sbUrl = process.env.SUPABASE_URL;
const sbKey = process.env.SUPABASE_SERVICE_KEY;
const useSupabase = Boolean(sbUrl && sbKey);

export async function readState(): Promise<StoreState> {
  if (useSupabase) {
    const res = await fetch(`${sbUrl}/rest/v1/kv?key=eq.${KEY}&select=value`, {
      headers: { apikey: sbKey!, Authorization: `Bearer ${sbKey}` },
      cache: "no-store",
    });
    if (res.ok) {
      const rows = (await res.json()) as { value: StoreState }[];
      if (rows[0]?.value) return rows[0].value;
    }
    return empty();
  }
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as StoreState;
  } catch {
    return empty();
  }
}

export async function writeState(state: StoreState): Promise<void> {
  const next = { ...state, updatedAt: new Date().toISOString() };
  if (useSupabase) {
    const res = await fetch(`${sbUrl}/rest/v1/kv?on_conflict=key`, {
      method: "POST",
      headers: {
        apikey: sbKey!,
        Authorization: `Bearer ${sbKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ key: KEY, value: next }),
    });
    if (!res.ok) throw new Error(`Supabase write failed: ${res.status}`);
    return;
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(next, null, 2));
}
