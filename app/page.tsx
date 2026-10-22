import { getShopProducts } from "@/lib/stock";
import { ShopGrid } from "@/components/shop-grid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const all = await getShopProducts();
  const inStock = all
    .filter((p) => p.inStockFlavors.length > 0)
    .sort((a, b) => (b.puffs ?? 0) - (a.puffs ?? 0));
  const flavorCount = inStock.reduce((n, p) => n + p.inStockFlavors.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <section className="py-12 sm:py-20">
        <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
          What is in stock today.
        </h1>
        <p className="mt-5 max-w-md text-lg text-ink-soft">
          {inStock.length > 0
            ? `${inStock.length} models and ${flavorCount} flavors ready now. Pick, then order on WhatsApp.`
            : "We are restocking. Check back soon."}
        </p>
      </section>

      <section className="pb-20" id="shop">
        {inStock.length > 0 ? (
          <ShopGrid products={inStock} />
        ) : (
          <div className="rounded-2xl bg-surface px-6 py-20 text-center">
            <p className="font-display text-2xl font-bold">Between restocks.</p>
            <p className="mt-2 text-ink-soft">New stock lands often. Message us on WhatsApp to ask.</p>
          </div>
        )}
      </section>
    </div>
  );
}
