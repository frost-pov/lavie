"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CaretDown } from "@phosphor-icons/react";
import type { CatalogProduct } from "@/lib/catalog";
import type { ProductState, StorageStatus } from "@/lib/store";

type Products = Record<string, ProductState>;

const blank = (p: CatalogProduct): ProductState => ({
  price: null,
  flavors: Object.fromEntries(p.flavors.map((f) => [f, false])),
});

export function AdminClient({
  catalog,
  initial,
  storage,
  whatsapp,
}: {
  catalog: CatalogProduct[];
  initial: Products;
  storage: StorageStatus;
  whatsapp: string | null;
}) {
  const router = useRouter();
  const [data, setData] = useState<Products>(() =>
    Object.fromEntries(
      catalog.map((p) => {
        const s = initial[p.slug] ?? blank(p);
        return [p.slug, { price: s.price, flavors: { ...blank(p).flavors, ...s.flavors } }];
      }),
    ),
  );
  const [saved, setSaved] = useState(() => JSON.stringify(data));
  const [q, setQ] = useState("");
  const [onlyStocked, setOnlyStocked] = useState(false);
  const [openSlugs, setOpenSlugs] = useState<Set<string>>(() => new Set());
  const toggleOpen = (slug: string) =>
    setOpenSlugs((prev) => {
      const next = new Set(prev);
      if (!next.delete(slug)) next.add(slug);
      return next;
    });
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const dirty = JSON.stringify(data) !== saved;
  const stockedCount = (slug: string) => Object.values(data[slug].flavors).filter(Boolean).length;

  const list = useMemo(
    () =>
      catalog.filter(
        (p) =>
          (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
          (!onlyStocked || Object.values(data[p.slug].flavors).some(Boolean)),
      ),
    [catalog, q, onlyStocked, data],
  );

  const totalLive = catalog.filter((p) => stockedCount(p.slug) > 0).length;

  const patch = (slug: string, fn: (s: ProductState) => ProductState) =>
    setData((d) => ({ ...d, [slug]: fn(d[slug]) }));

  async function save() {
    setStatus("saving");
    const res = await fetch("/api/admin/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: data }),
    });
    if (res.ok) {
      setSaved(JSON.stringify(data));
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 1800);
    } else {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setErrorMsg(body.error ?? `HTTP ${res.status}`);
      setStatus("error");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Stock</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {totalLive} of {catalog.length} models live on the site
          </p>
        </div>
        <button onClick={logout} className="text-sm text-ink-soft underline">
          Sign out
        </button>
      </div>

      <div
        className={`mt-5 rounded-xl p-3 text-sm ${storage.ok ? "bg-surface text-ink-soft" : "bg-danger/10 text-danger"}`}
        role="status"
      >
        <p>
          <strong>Storage:</strong> {storage.detail}
        </p>
        <p className="mt-1">
          <strong>WhatsApp number:</strong>{" "}
          {whatsapp ? `set (ends ${whatsapp})` : "not set, orders will go nowhere"}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search models"
          aria-label="Search models"
          className="h-12 flex-1 rounded-xl border border-hairline bg-canvas px-4 outline-none focus:border-ink"
        />
        <label className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-hairline px-4 text-sm">
          <input
            type="checkbox"
            checked={onlyStocked}
            onChange={(e) => setOnlyStocked(e.target.checked)}
            className="h-4 w-4 accent-[var(--ink)]"
          />
          Only in stock
        </label>
      </div>

      <ul className="mt-6 space-y-3">
        {list.map((p) => {
          const s = data[p.slug];
          const n = stockedCount(p.slug);
          const open = openSlugs.has(p.slug);
          return (
            <li key={p.slug} className="overflow-hidden rounded-2xl border border-hairline">
              <button
                onClick={() => toggleOpen(p.slug)}
                aria-expanded={open}
                className="flex w-full items-center gap-4 p-3 text-left hover:bg-surface"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-panel">
                  {p.image && (
                    <Image src={`/products/${p.image}`} alt="" fill sizes="64px" className="object-contain p-1" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {p.name} <span className="text-ink-soft">{p.puffs?.toLocaleString("en-US")}</span>
                  </p>
                  <p className="text-sm text-ink-soft">
                    {n > 0 ? (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-ink">
                        {n} of {p.flavors.length} in stock
                      </span>
                    ) : (
                      "Out of stock"
                    )}
                  </p>
                </div>
                <CaretDown
                  size={18}
                  className={`shrink-0 text-ink-soft transition ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div className="border-t border-hairline p-4">
                  <div className="flex flex-wrap items-end gap-4">
                    <label className="block">
                      <span className="text-sm font-medium">Your price (KES)</span>
                      <input
                        inputMode="numeric"
                        value={s.price ?? ""}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "");
                          patch(p.slug, (x) => ({ ...x, price: v ? Number(v) : null }));
                        }}
                        placeholder="e.g. 1500"
                        className="mt-1 block h-11 w-40 rounded-xl border border-hairline bg-canvas px-3 outline-none focus:border-ink"
                      />
                    </label>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-medium">Flavors</span>
                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() =>
                          patch(p.slug, (x) => ({
                            ...x,
                            flavors: Object.fromEntries(p.flavors.map((f) => [f, true])),
                          }))
                        }
                        className="rounded-full border border-hairline px-3 py-1.5 hover:bg-surface"
                      >
                        All in
                      </button>
                      <button
                        onClick={() =>
                          patch(p.slug, (x) => ({
                            ...x,
                            flavors: Object.fromEntries(p.flavors.map((f) => [f, false])),
                          }))
                        }
                        className="rounded-full border border-hairline px-3 py-1.5 hover:bg-surface"
                      >
                        All out
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {p.flavors.map((f) => {
                      const on = s.flavors[f];
                      return (
                        <button
                          key={f}
                          role="switch"
                          aria-checked={on}
                          onClick={() =>
                            patch(p.slug, (x) => ({ ...x, flavors: { ...x.flavors, [f]: !on } }))
                          }
                          className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-3 text-left text-sm transition active:scale-[0.99] ${
                            on ? "border-ink bg-surface" : "border-hairline text-ink-soft"
                          }`}
                        >
                          <span>{f}</span>
                          <span
                            className={`relative h-6 w-10 shrink-0 rounded-full transition ${
                              on ? "bg-accent" : "bg-hairline"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-all ${
                                on ? "left-[18px]" : "left-0.5"
                              }`}
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-0 z-40 mt-8 -mx-4 border-t border-hairline bg-canvas/90 backdrop-blur-md sm:-mx-6">
        <div className="flex items-center justify-between gap-4 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
          <p className="text-sm text-ink-soft" aria-live="polite">
            {status === "error"
              ? `Save failed: ${errorMsg}`
              : status === "ok"
                ? "Saved. The site is updated."
                : dirty
                  ? "Unsaved changes"
                  : "Everything is saved"}
          </p>
          <button
            onClick={save}
            disabled={!dirty || status === "saving"}
            className="h-12 rounded-full bg-ink px-8 font-medium text-canvas transition active:scale-[0.98] disabled:opacity-30"
          >
            {status === "saving" ? "Saving" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
