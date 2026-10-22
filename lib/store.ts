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

// Legacy service_role keys are JWTs and go in both headers; new sb_secret_ keys go in apikey only.
const sbHeaders = (): Record<string, string> =>
  sbKey!.startsWith("sb_") ? { apikey: sbKey! } : { apikey: sbKey!, Authorization: `Bearer ${sbKey}` };

export async function readState(): Promise<StoreState> {
  if (useSupabase) {
    const res = await fetch(`${sbUrl}/rest/v1/kv?key=eq.${KEY}&select=value`, {
      headers: sbHeaders(),
      cache: "no-store",
    });
    if (res.ok) {
      const rows = (await res.json()) as { value: StoreState }[];
      if (rows[0]?.value) return rows[0].value;
    } else {
      console.error("Supabase read failed", res.status, await res.text().catch(() => ""));
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
        ...sbHeaders(),
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ key: KEY, value: next }),
    });
    if (!res.ok) {
      const body = (await res.text().catch(() => "")).slice(0, 200);
      throw new Error(`Supabase write failed (${res.status}) ${body}`);
    }
    return;
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(next, null, 2));
}

export type StorageStatus = { ok: boolean; mode: "supabase" | "file"; detail: string };

/** Admin-only diagnostics: can this deployment actually reach its database? */
export async function getStorageStatus(): Promise<StorageStatus> {
  if (!useSupabase) {
    const hint = [!sbUrl && "SUPABASE_URL", !sbKey && "SUPABASE_SERVICE_KEY"].filter(Boolean).join(" and ");
    return {
      ok: false,
      mode: "file",
      detail: `${hint || "Supabase settings"} not set on this deployment. Changes cannot be saved here.`,
    };
  }
  try {
    const res = await fetch(`${sbUrl}/rest/v1/kv?select=key&limit=1`, { headers: sbHeaders(), cache: "no-store" });
    if (res.ok) return { ok: true, mode: "supabase", detail: "Connected to Supabase." };
    const body = (await res.text().catch(() => "")).slice(0, 160);
    return { ok: false, mode: "supabase", detail: `Supabase answered ${res.status}. ${body}` };
  } catch (e) {
    return { ok: false, mode: "supabase", detail: `Could not reach Supabase: ${(e as Error).message}` };
  }
}
