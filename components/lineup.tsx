"use client";

import { useMemo, useState } from "react";
import type { ShopProduct } from "@/lib/stock";
import { matchingFlavors } from "@/lib/flavors";
import { ProductTile } from "./product-tile";
import { Reveal } from "./reveal";

const RANGES = [
  { id: "all", label: "All", test: () => true },
  { id: "small", label: "Under 10K", test: (n: number) => n < 10000 },
  { id: "mid", label: "10K to 30K", test: (n: number) => n >= 10000 && n < 30000 },
  { id: "big", label: "30K and up", test: (n: number) => n >= 30000 },
] as const;

const SPAN: Record<number, string> = {
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
};
const WIDE = "aspect-[4/3]";
const TALL = "aspect-[4/5]";

/**
 * Asymmetric rows that always fill all 12 columns: a 2-up row (7+5, then 5+7),
 * a 3-up row, repeat. A lone leftover tile joins the previous row instead of orphaning.
 */
function layoutFor(n: number): { span: string; aspect: string }[] {
  const out: { span: string; aspect: string }[] = [];
  let rem = n;
  let row = 0;
  while (rem > 0) {
    let size = row % 2 === 0 ? 2 : 3;
    if (rem - size === 1) size = size === 2 ? 3 : 4;
    size = Math.min(size, rem);
    if (size === 1) out.push({ span: SPAN[6], aspect: TALL });
    else if (size === 2) {
      const flip = Math.floor(row / 2) % 2 === 1;
      out.push({ span: SPAN[flip ? 5 : 7], aspect: flip ? TALL : WIDE });
      out.push({ span: SPAN[flip ? 7 : 5], aspect: flip ? WIDE : TALL });
    } else if (size === 3) for (let i = 0; i < 3; i++) out.push({ span: SPAN[4], aspect: TALL });
    else for (let i = 0; i < size; i++) out.push({ span: SPAN[3], aspect: TALL });
    rem -= size;
    row++;
  }
  return out;
}

const chip = (on: boolean) =>
  `h-10 shrink-0 border px-4 text-sm font-medium transition active:scale-95 ${
    on ? "border-ink bg-ink text-canvas" : "border-hairline hover:border-ink"
  }`;

export function Lineup({
  products,
  keywords,
  leadSlug,
}: {
  products: ShopProduct[];
  keywords: { word: string; count: number }[];
  leadSlug?: string;
}) {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("all");
  const [kw, setKw] = useState<string | null>(null);

  const shown = useMemo(() => {
    const r = RANGES.find((x) => x.id === range)!;
    const unfiltered = range === "all" && !kw;
    return products.filter(
      (p) =>
        // the hero already features the lead model, so skip it here until a filter is applied
        !(unfiltered && p.slug === leadSlug) &&
        r.test(p.puffs ?? 0) &&
        (!kw || matchingFlavors(p, kw).length > 0),
    );
  }, [products, range, kw, leadSlug]);

  const layout = layoutFor(shown.length);

  return (
    <div id="lineup">
      <div className="flex flex-col gap-5 border-b border-ink pb-6">
        <h2 className="cond text-[clamp(3rem,9vw,7.5rem)] font-black uppercase leading-[0.85]">
          The lineup
        </h2>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Puff count">
          {RANGES.map((r) => (
            <button key={r.id} role="tab" aria-selected={range === r.id} onClick={() => setRange(r.id)} className={chip(range === r.id)}>
              {r.label}
            </button>
          ))}
        </div>

        {keywords.length > 0 && (
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Flavor">
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
      </div>

      {shown.length === 0 ? (
        <p className="py-24 text-center text-ink-soft">Nothing matches that right now. Clear a filter to see everything.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-start lg:gap-6">
          {shown.map((p, i) => {
            const pat = layout[i];
            return (
              <Reveal key={p.slug} delay={(i % 3) * 0.06} className={pat.span}>
                <ProductTile
                  p={p}
                  aspect={pat.aspect}
                  matched={kw ? matchingFlavors(p, kw) : undefined}
                  priority={i < 2}
                />
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
