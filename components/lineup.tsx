"use client";

import { useMemo, useState } from "react";
import type { ShopProduct } from "@/lib/stock";
import { matchingFlavors } from "@/lib/flavors";
import { ProductCard } from "./product-card";

const RANGES = [
  { id: "all", label: "All", test: () => true },
  { id: "small", label: "Under 10K", test: (n: number) => n < 10000 },
  { id: "mid", label: "10K to 30K", test: (n: number) => n >= 10000 && n < 30000 },
  { id: "big", label: "30K and up", test: (n: number) => n >= 30000 },
] as const;

const chip = (on: boolean) =>
  `h-10 shrink-0 rounded-lg px-4 text-sm font-medium transition active:scale-95 ${
    on ? "bg-ink text-canvas" : "border border-hairline hover:bg-surface"
  }`;

export function Lineup({
  products,
  keywords,
}: {
  products: ShopProduct[];
  keywords: { word: string; count: number }[];
}) {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("all");
  const [kw, setKw] = useState<string | null>(null);

  const shown = useMemo(() => {
    const r = RANGES.find((x) => x.id === range)!;
    return products.filter((p) => r.test(p.puffs ?? 0) && (!kw || matchingFlavors(p, kw).length > 0));
  }, [products, range, kw]);

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="Puff count">
        {RANGES.map((r) => (
          <button key={r.id} role="tab" aria-selected={range === r.id} onClick={() => setRange(r.id)} className={chip(range === r.id)}>
            {r.label}
          </button>
        ))}
      </div>

      {keywords.length > 0 && (
        <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Flavor">
          {keywords.map((k) => (
            <button
              key={k.word}
              aria-pressed={kw === k.word}
              onClick={() => setKw(kw === k.word ? null : k.word)}
              className={chip(kw === k.word)}
            >
              {k.word}
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">Nothing matches that right now. Clear a filter to see everything.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((p, i) => (
            <ProductCard key={p.slug} p={p} matched={kw ? matchingFlavors(p, kw) : undefined} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
