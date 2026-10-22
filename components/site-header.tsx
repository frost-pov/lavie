"use client";

import Link from "next/link";
import { BagSimple } from "@phosphor-icons/react";
import { useCart } from "./cart";
import { CartDrawer } from "./cart-drawer";

export function SiteHeader({ whatsapp }: { whatsapp: string }) {
  const { count, setOpen } = useCart();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="cond text-3xl font-black uppercase leading-none">
            Lavie Kenya
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link href="/#lineup" className="hidden text-sm font-semibold uppercase tracking-[0.1em] hover:underline sm:block">
              Lineup
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label={`Open order, ${count} items`}
              className="relative flex h-11 items-center gap-2 border border-ink px-4 text-sm font-semibold uppercase tracking-[0.08em] transition hover:bg-ink hover:text-canvas active:scale-95"
            >
              <BagSimple size={20} weight="regular" />
              Order
              {count > 0 && (
                <span className="grid h-5 min-w-5 place-items-center bg-accent px-1 text-[11px] font-bold text-accent-ink">
                  {count}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>
      <CartDrawer whatsapp={whatsapp} />
    </>
  );
}
