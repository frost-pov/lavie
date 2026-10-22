import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getShopProducts } from "@/lib/stock";
import { FlavorPicker } from "@/components/flavor-picker";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const p = (await getShopProducts()).find((x) => x.slug === slug);
  if (!p) notFound();

  const out = p.flavors.filter((f) => !p.inStockFlavors.includes(f));
  const specs: [string, string | undefined][] = [
    ["Puffs", p.puffs ? p.puffs.toLocaleString("en-US") : undefined],
    ["E-liquid", p.spec.liquid],
    ["Battery", p.spec.battery],
    ["Charging", p.spec.charging],
    ["Size", p.spec.size?.replace(/\*/g, " x ")],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft size={16} /> All products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-panel">
            {(p.hero || p.image) && (
              <Image
                src={`/products/${p.hero ?? p.image}`}
                alt={`${p.name} ${p.puffs ?? ""} puffs`}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className={p.hero ? "object-cover" : "object-contain p-4"}
              />
            )}
          </div>
          {p.hero && p.image && (
            <div className="mt-4">
              <h2 className="font-medium">All flavors</h2>
              <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-3xl bg-panel">
                <Image
                  src={`/products/${p.image}`}
                  alt={`${p.name} flavor lineup`}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-contain p-4"
                />
              </div>
            </div>
          )}
        </div>

        <div className="lg:py-4">
          <h1 className="font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl">
            {p.name}
          </h1>
          <p className="mt-2 text-ink-soft">{p.puffs?.toLocaleString("en-US")} puffs{p.dual ? ", dual flavor" : ""}</p>
          <p className="mt-5 font-display text-3xl font-bold">
            {p.price != null ? `KES ${p.price.toLocaleString("en-KE")}` : "Price on WhatsApp"}
          </p>

          <div className="mt-8">
            {p.inStockFlavors.length > 0 ? (
              <FlavorPicker
                slug={p.slug}
                name={p.name}
                puffs={p.puffs}
                price={p.price}
                inStock={p.inStockFlavors}
                outOfStock={out}
              />
            ) : (
              <div className="rounded-2xl bg-surface p-5">
                <p className="font-medium">Out of stock right now.</p>
                <p className="mt-1 text-sm text-ink-soft">
                  Message us on WhatsApp and we will tell you when it lands.
                </p>
              </div>
            )}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline pt-6 text-sm">
            {specs
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="mt-0.5 font-medium">{v}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
