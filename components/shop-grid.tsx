"use client";

import { useMemo, useState } from "react";
import type { ShopProduct } from "@/lib/stock";
import { ProductCard } from "./product-card";

const RANGES = [
  { id: "all", label: "All", test: () => true },
  { id: "small", label: "Under 10k", test: (n: number) => n < 10000 },
  { id: "mid", label: "10k to 30k", test: (n: number) => n >= 10000 && n < 30000 },
  { id: "big", label: "30k and up", test: (n: number) => n >= 30000 },
] as const;

export function ShopGrid({ products }: { products: ShopProduct[] }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("all");
  const shown = useMemo(() => {
    const r = RANGES.find((x) => x.id === range)!;
    return products.filter((p) => r.test(p.puffs ?? 0));
  }, [products, range]);

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist">
        {RANGES.map((r) => (
          <button
            key={r.id}
            role="tab"
            aria-selected={range === r.id}
            onClick={() => setRange(r.id)}
            className={`h-10 shrink-0 rounded-full px-5 text-sm font-medium transition active:scale-95 ${
              range === r.id
                ? "bg-ink text-canvas"
                : "border border-hairline hover:bg-surface"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          Nothing in this range right now. Try another filter.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((p, i) => (
            <ProductCard key={p.slug} p={p} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
