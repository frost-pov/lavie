"use client";

import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, WhatsappLogo, X } from "@phosphor-icons/react";
import { useCart } from "./cart";

export const kes = (n: number) => `KES ${n.toLocaleString("en-KE")}`;

export function CartDrawer({ whatsapp }: { whatsapp: string }) {
  const { lines, open, setOpen, setQty, clear } = useCart();
  const priced = lines.every((l) => l.price != null);
  const total = lines.reduce((s, l) => s + (l.price ?? 0) * l.qty, 0);

  const message = () => {
    const rows = lines.map(
      (l) =>
        `- ${l.qty} x ${l.name}${l.puffs ? ` ${l.puffs}` : ""} (${l.flavor})${
          l.price != null ? ` @ ${kes(l.price)}` : ""
        }`,
    );
    const foot = priced ? `\nTotal: ${kes(total)}` : "";
    return `Hi Lavie Kenya, I would like to order:\n${rows.join("\n")}${foot}\n\nI am 18 or older.`;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-50 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-label="Your order"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-canvas shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          >
            <div className="flex h-16 items-center justify-between border-b border-hairline px-5">
              <h2 className="font-display text-xl font-bold">Your order</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface"
              >
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="grid flex-1 place-items-center px-8 text-center">
                <div>
                  <p className="font-display text-2xl font-bold">Nothing here yet.</p>
                  <p className="mt-2 text-ink-soft">Pick a flavor and add it to your order.</p>
                </div>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-hairline overflow-y-auto px-5">
                  {lines.map((l) => (
                    <li key={l.slug + l.flavor} className="flex items-center gap-3 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {l.name} {l.puffs ?? ""}
                        </p>
                        <p className="truncate text-sm text-ink-soft">{l.flavor}</p>
                        <p className="mt-1 text-sm">
                          {l.price != null ? kes(l.price * l.qty) : "Price on WhatsApp"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full border border-hairline">
                        <button
                          aria-label="Decrease"
                          onClick={() => setQty(l.slug, l.flavor, l.qty - 1)}
                          className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-5 text-center text-sm tabular-nums">{l.qty}</span>
                        <button
                          aria-label="Increase"
                          onClick={() => setQty(l.slug, l.flavor, l.qty + 1)}
                          className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-hairline p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  {priced && (
                    <div className="mb-4 flex items-baseline justify-between">
                      <span className="text-ink-soft">Total</span>
                      <span className="font-display text-2xl font-bold">{kes(total)}</span>
                    </div>
                  )}
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(message())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink font-medium text-canvas transition active:scale-[0.98]"
                  >
                    <WhatsappLogo size={22} weight="fill" />
                    Order on WhatsApp
                  </a>
                  <button onClick={clear} className="mt-3 w-full text-sm text-ink-soft underline">
                    Clear order
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
