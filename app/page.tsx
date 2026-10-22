import Image from "next/image";
import { getShopProducts } from "@/lib/stock";
import { fmtK } from "@/lib/catalog";
import { flavorKeywords, singleFlavors } from "@/lib/flavors";
import { HeroNumeral } from "@/components/hero-numeral";
import { Marquee } from "@/components/marquee";
import { Lineup } from "@/components/lineup";
import { Reveal } from "@/components/reveal";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STEPS = [
  { head: "Pick your flavors.", body: "Add what you want to your order. Only what is in stock shows up here." },
  { head: "Send it on WhatsApp.", body: "One tap turns your order into a message, ready to send." },
  { head: "We confirm and deliver.", body: "Price and delivery are agreed in the chat before anything moves." },
];

export default async function Home() {
  const all = await getShopProducts();
  const inStock = all
    .filter((p) => p.inStockFlavors.length > 0)
    .sort((a, b) => (b.puffs ?? 0) - (a.puffs ?? 0));
  const lead = inStock[0];
  const flavorCount = inStock.reduce((n, p) => n + p.inStockFlavors.length, 0);
  const marqueeItems = singleFlavors(inStock.flatMap((p) => p.inStockFlavors)).slice(0, 14);
  const leadSrc = lead?.hero ?? lead?.image;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12 lg:pb-16">
        {lead ? (
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">In stock now</p>
              <HeroNumeral text={fmtK(lead.puffs)} label={`${lead.name}, ${lead.puffs?.toLocaleString("en-US")} puffs`} />
              <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
                <div>
                  <p className="cond text-4xl font-black uppercase leading-none sm:text-5xl">{lead.name}</p>
                  <p className="mt-2 max-w-xs text-ink-soft">
                    {lead.inStockFlavors.length} flavors in stock and ready to order.
                  </p>
                </div>
                <Link
                  href={`/product/${lead.slug}`}
                  className="inline-flex h-14 items-center bg-ink px-8 font-semibold text-canvas transition active:scale-[0.98]"
                >
                  Shop the {lead.name}
                </Link>
              </div>
            </div>

            <div
              className="relative aspect-[4/3] overflow-hidden lg:col-span-5 lg:aspect-[4/5]"
              style={{ backgroundColor: lead.color }}
            >
              {leadSrc && (
                <Image
                  src={`/products/${leadSrc}`}
                  alt={`${lead.name} ${lead.puffs ?? ""} puffs`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className={lead.hero ? "object-cover" : "object-contain p-4"}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="py-16">
            <h1 className="cond text-[clamp(6rem,22vw,20rem)] font-black uppercase leading-[0.85]">Soon.</h1>
            <p className="mt-4 max-w-sm text-lg text-ink-soft">
              We are between restocks. Message us on WhatsApp to ask what is landing next.
            </p>
          </div>
        )}
      </section>

      {lead && (
        <>
          <Marquee items={marqueeItems} />

          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
            <Lineup products={inStock} keywords={flavorKeywords(inStock)} leadSlug={lead.slug} />
          </section>

          <section className="border-t border-ink">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
              <p className="mb-8 text-lg text-ink-soft">
                {inStock.length} models and {flavorCount} flavors in stock today.
              </p>
              <div className="grid">
                {STEPS.map((s, i) => (
                  <Reveal key={s.head} delay={i * 0.05}>
                    <div className="grid gap-2 border-t border-hairline py-8 first:border-t-0 lg:grid-cols-12 lg:items-baseline lg:gap-10">
                      <h2 className="cond text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase leading-[0.9] lg:col-span-8">
                        {s.head}
                      </h2>
                      <p className="max-w-sm text-ink-soft lg:col-span-4">{s.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
