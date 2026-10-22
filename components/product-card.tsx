import Image from "next/image";
import Link from "next/link";
import type { ShopProduct } from "@/lib/stock";

export function ProductCard({ p, priority = false }: { p: ShopProduct; priority?: boolean }) {
  return (
    <Link href={`/product/${p.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-panel">
        {(p.hero || p.image) && (
          <Image
            src={`/products/${p.hero ?? p.image}`}
            alt={`${p.name} ${p.puffs ?? ""} puffs`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={`transition duration-500 group-hover:scale-[1.04] ${
              p.hero ? "object-cover" : "object-contain p-3"
            }`}
          />
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{p.name}</h3>
          <p className="text-sm text-ink-soft">
            {p.puffs?.toLocaleString("en-US")} puffs
            <span className="mx-1.5 text-hairline">|</span>
            {p.inStockFlavors.length} flavors
          </p>
        </div>
        <p className="shrink-0 text-sm font-medium tabular-nums">
          {p.price != null ? `KES ${p.price.toLocaleString("en-KE")}` : "Ask"}
        </p>
      </div>
    </Link>
  );
}
