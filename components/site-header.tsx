"use client";

import Link from "next/link";
import { BagSimple } from "@phosphor-icons/react";
import { useCart } from "./cart";
import { CartDrawer } from "./cart-drawer";

export function SiteHeader() {
  const { count, setOpen } = useCart();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">
            LAVIE<span className="text-ink-soft"> KENYA</span>
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label={`Open order, ${count} items`}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-hairline transition hover:bg-surface active:scale-95"
          >
            <BagSimple size={22} weight="regular" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}
