import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getShopProducts } from "@/lib/stock";
import { fmtK } from "@/lib/catalog";
import { FlavorPicker } from "@/components/flavor-picker";
import { ProductTile } from "@/components/product-tile";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const all = await getShopProducts();
  const p = all.find((x) => x.slug === slug);
  if (!p) notFound();

  const out = p.flavors.filter((f) => !p.inStockFlavors.includes(f));
  const src = p.hero ?? p.image;
  const more = all.filter((x) => x.slug !== p.slug && x.inStockFlavors.length > 0).slice(0, 3);

  const specs: [string, string | undefined][] = [
    ["E-liquid", p.spec.liquid],
    ["Battery", p.spec.battery],
    ["Charging", p.spec.charging],
    ["Size", p.spec.size?.replace(/\*/g, " x ")],
  ];

  return (
    <>
      <section style={{ backgroundColor: p.color, color: p.onColor }}>
        <div className="mx-auto max-w-7xl px-4 pb-0 pt-6 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
            <ArrowLeft size={16} /> All products
          </Link>

          <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6 lg:pb-10">
              <h1>
                <span className="cond block text-[clamp(7rem,22vw,20rem)] font-black leading-[0.8]">{fmtK(p.puffs)}</span>
                <span className="cond mt-4 block text-4xl font-black uppercase leading-none sm:text-6xl">
                  {p.name}
                  <span className="sr-only">, {p.puffs?.toLocaleString("en-US")} puffs</span>
                </span>
              </h1>
              <p className="mt-3 text-lg opacity-80">
                {p.puffs?.toLocaleString("en-US")} puffs{p.dual ? ", two flavors in one device" : ""}
              </p>
            </div>
            <div className="relative aspect-[4/3] lg:col-span-6 lg:aspect-[5/4]">
              {src && (
                <Image
                  src={`/products/${src}`}
                  alt={`${p.name} ${p.puffs ?? ""} puffs`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={p.hero ? "object-cover" : "object-contain bg-white p-4"}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:py-20">
        <div className="lg:col-span-6">
          <p className="cond text-5xl font-black leading-none sm:text-6xl">
            {p.price != null ? `KES ${p.price.toLocaleString("en-KE")}` : "Price on WhatsApp"}
          </p>
          <div className="mt-8">
            {p.inStockFlavors.length > 0 ? (
              <FlavorPicker
                slug={p.slug}
                name={p.name}
                puffs={p.puffs}
                price={p.price}
                color={p.color}
                onColor={p.onColor}
                inStock={p.inStockFlavors}
                outOfStock={out}
              />
            ) : (
              <div className="border border-ink p-5">
                <p className="font-semibold">Out of stock right now.</p>
                <p className="mt-1 text-sm text-ink-soft">Message us on WhatsApp and we will tell you when it lands.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-6">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
            {specs
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt className="text-sm uppercase tracking-[0.1em] text-ink-soft">{k}</dt>
                  <dd className="cond mt-1 text-4xl font-black leading-none sm:text-5xl">{v}</dd>
                </div>
              ))}
          </dl>

          {p.hero && p.image && (
            <div className="mt-12">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Every flavor</h2>
              <div className="relative mt-3 aspect-[4/3] bg-white">
                <Image
                  src={`/products/${p.image}`}
                  alt={`${p.name} flavor lineup`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-4"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {more.length > 0 && (
        <section className="border-t border-ink">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <h2 className="cond text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase leading-[0.9]">Also in stock</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:gap-6">
              {more.map((m) => (
                <ProductTile key={m.slug} p={m} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
