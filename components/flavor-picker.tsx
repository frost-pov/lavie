"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "@phosphor-icons/react";
import { useCart } from "./cart";
import { showFlavor } from "@/lib/flavors";

type Props = {
  slug: string;
  name: string;
  puffs: number | null;
  price: number | null;
  color: string;
  onColor: string;
  inStock: string[];
  outOfStock: string[];
};

export function FlavorPicker({ slug, name, puffs, price, color, onColor, inStock, outOfStock }: Props) {
  const { add } = useCart();
  const [flavor, setFlavor] = useState<string | null>(inStock.length === 1 ? inStock[0] : null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">
        Flavor <span className="ml-2 font-normal normal-case tracking-normal text-ink-soft">{flavor ? showFlavor(flavor) : `${inStock.length} available`}</span>
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {inStock.map((f) => {
          const on = flavor === f;
          return (
            <button
              key={f}
              onClick={() => setFlavor(f)}
              aria-pressed={on}
              style={on ? { backgroundColor: color, color: onColor, borderColor: color } : undefined}
              className={`min-h-11 border px-4 text-sm font-medium transition active:scale-95 ${
                on ? "" : "border-hairline hover:border-ink"
              }`}
            >
              {showFlavor(f)}
            </button>
          );
        })}
      </div>

      {outOfStock.length > 0 && (
        <details className="mt-5 text-sm text-ink-soft">
          <summary className="cursor-pointer select-none">{outOfStock.length} more flavors out of stock</summary>
          <p className="mt-2 leading-relaxed">{outOfStock.map(showFlavor).join(", ")}</p>
        </details>
      )}

      <div className="mt-8 flex items-center gap-3">
        <div className="flex items-center border border-ink">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-14 w-12 place-items-center hover:bg-surface"
          >
            <Minus size={16} />
          </button>
          <span className="w-6 text-center tabular-nums">{qty}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="grid h-14 w-12 place-items-center hover:bg-surface"
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          disabled={!flavor}
          onClick={() => {
            if (!flavor) return;
            add({ slug, name, puffs, flavor, price }, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1400);
          }}
          className="flex h-14 flex-1 items-center justify-center gap-2 bg-ink font-semibold text-canvas transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? (
            <>
              <Check size={18} weight="bold" /> Added
            </>
          ) : flavor ? (
            "Add to order"
          ) : (
            "Pick a flavor"
          )}
        </button>
      </div>
    </div>
  );
}
