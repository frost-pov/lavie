"use client";

import Link from "next/link";
import { BagSimple } from "@phosphor-icons/react";
import { useCart } from "./cart";
import { CartDrawer } from "./cart-drawer";

export function SiteHeader({ whatsapp }: { whatsapp: string }) {
  const { count, setOpen } = useCart();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Lavie Kenya
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label={`Open order, ${count} items`}
            className="relative grid h-11 w-11 place-items-center rounded-lg border border-hairline transition hover:bg-surface active:scale-95"
          >
            <BagSimple size={22} weight="regular" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>
      <CartDrawer whatsapp={whatsapp} />
    </>
  );
}
