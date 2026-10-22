import { getShopProducts } from "@/lib/stock";
import { flavorKeywords } from "@/lib/flavors";
import { Lineup } from "@/components/lineup";

export const dynamic = "force-dynamic";

export default async function Home() {
  const all = await getShopProducts();
  const inStock = all
    .filter((p) => p.inStockFlavors.length > 0)
    .sort((a, b) => (b.puffs ?? 0) - (a.puffs ?? 0));
  const flavorCount = inStock.reduce((n, p) => n + p.inStockFlavors.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10 sm:py-14">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">In stock now</h1>
        <p className="mt-3 max-w-md text-ink-soft">
          {inStock.length > 0
            ? `${inStock.length} models and ${flavorCount} flavors. Pick what you want and order on WhatsApp.`
            : "We are restocking. Check back soon."}
        </p>
      </section>

      <section className="pb-20">
        {inStock.length > 0 ? (
          <Lineup products={inStock} keywords={flavorKeywords(inStock)} />
        ) : (
          <div className="rounded-lg bg-surface px-6 py-20 text-center">
            <p className="text-xl font-semibold">Between restocks.</p>
            <p className="mt-2 text-ink-soft">New stock lands often. Message us on WhatsApp to ask.</p>
          </div>
        )}
      </section>
    </div>
  );
}
