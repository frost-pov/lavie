import Image from "next/image";
import Link from "next/link";
import { showFlavor } from "@/lib/flavors";
import type { ShopProduct } from "@/lib/stock";

export function ProductCard({
  p,
  matched,
  priority = false,
}: {
  p: ShopProduct;
  matched?: string[];
  priority?: boolean;
}) {
  const src = p.hero ?? p.image;
  return (
    <Link href={`/product/${p.slug}`} className="block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-panel">
        {src && (
          <Image
            src={`/products/${src}`}
            alt={`${p.name} ${p.puffs ?? ""} puffs`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={p.hero ? "object-cover" : "object-contain p-3"}
          />
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{p.name}</h3>
          <p className="text-sm text-ink-soft">
            {p.puffs?.toLocaleString("en-US")} puffs, {p.inStockFlavors.length} flavors
          </p>
          {matched && matched.length > 0 && (
            <p className="mt-1 truncate text-sm text-ink-soft">{matched.slice(0, 2).map(showFlavor).join(", ")}</p>
          )}
        </div>
        <p className="shrink-0 text-sm font-medium tabular-nums">
          {p.price != null ? `KES ${p.price.toLocaleString("en-KE")}` : "Ask"}
        </p>
      </div>
    </Link>
  );
}
