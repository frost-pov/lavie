"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "@phosphor-icons/react";
import { useCart } from "./cart";

type Props = {
  slug: string;
  name: string;
  puffs: number | null;
  price: number | null;
  inStock: string[];
  outOfStock: string[];
};

export function FlavorPicker({ slug, name, puffs, price, inStock, outOfStock }: Props) {
  const { add } = useCart();
  const [flavor, setFlavor] = useState<string | null>(inStock.length === 1 ? inStock[0] : null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div>
      <h2 className="font-medium">
        Flavor{" "}
        <span className="font-normal text-ink-soft">
          {flavor ?? `${inStock.length} available`}
        </span>
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {inStock.map((f) => (
          <button
            key={f}
            onClick={() => setFlavor(f)}
            aria-pressed={flavor === f}
            className={`min-h-11 rounded-full px-4 text-sm font-medium transition active:scale-95 ${
              flavor === f
                ? "bg-ink text-canvas"
                : "border border-hairline hover:border-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {outOfStock.length > 0 && (
        <details className="mt-5 text-sm text-ink-soft">
          <summary className="cursor-pointer select-none">
            {outOfStock.length} more flavors currently out of stock
          </summary>
          <p className="mt-2 leading-relaxed">{outOfStock.join(", ")}</p>
        </details>
      )}

      <div className="mt-8 flex items-center gap-3">
        <div className="flex items-center rounded-full border border-hairline">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-12 w-12 place-items-center rounded-full hover:bg-surface"
          >
            <Minus size={16} />
          </button>
          <span className="w-6 text-center tabular-nums">{qty}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="grid h-12 w-12 place-items-center rounded-full hover:bg-surface"
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
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink font-medium text-canvas transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
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
