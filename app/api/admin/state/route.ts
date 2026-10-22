import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readState, writeState, type StoreState } from "@/lib/store";
import { bySlug } from "@/lib/catalog";
import { revalidatePath } from "next/cache";

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as StoreState | null;
  if (!body || typeof body.products !== "object") {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }
  const current = await readState();
  const products: StoreState["products"] = { ...current.products };
  for (const [slug, ps] of Object.entries(body.products)) {
    const item = bySlug(slug);
    if (!item) continue;
    const flavors: Record<string, boolean> = {};
    for (const f of item.flavors) flavors[f] = Boolean(ps.flavors?.[f]);
    const price = typeof ps.price === "number" && ps.price > 0 ? Math.round(ps.price) : null;
    products[slug] = { price, flavors };
  }
  await writeState({ updatedAt: "", products });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
