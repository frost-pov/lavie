import Image from "next/image";
import Link from "next/link";
import { fmtK } from "@/lib/catalog";
import { showFlavor } from "@/lib/flavors";
import type { ShopProduct } from "@/lib/stock";

/** A model as a colored editorial block: photo on top, giant puff count underneath. */
export function ProductTile({
  p,
  aspect = "aspect-[4/5]",
  matched,
  priority = false,
}: {
  p: ShopProduct;
  aspect?: string;
  matched?: string[];
  priority?: boolean;
}) {
  const src = p.hero ?? p.image;
  return (
    <Link
      href={`/product/${p.slug}`}
      className="group block"
      style={{ backgroundColor: p.color, color: p.onColor }}
    >
      <div className={`relative overflow-hidden ${aspect}`}>
        {src && (
          <Image
            src={`/products/${src}`}
            alt={`${p.name} ${p.puffs ?? ""} puffs`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
            className={`transition duration-700 ease-out group-hover:scale-[1.05] ${
              p.hero ? "object-cover" : "object-contain bg-white p-3"
            }`}
          />
        )}
      </div>
      <div className="flex items-end justify-between gap-4 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="cond text-[clamp(3.5rem,8vw,6.5rem)] font-black leading-[0.8]">
            {fmtK(p.puffs)}
          </p>
          <p className="mt-3 truncate text-lg font-semibold">{p.name}</p>
        </div>
        <div className="shrink-0 text-right text-sm">
          <p className="opacity-80">{p.inStockFlavors.length} flavors</p>
          <p className="mt-0.5 font-semibold tabular-nums">
            {p.price != null ? `KES ${p.price.toLocaleString("en-KE")}` : "Ask for price"}
          </p>
        </div>
      </div>
      {matched && matched.length > 0 && (
        <p className="border-t px-4 py-3 text-sm sm:px-5" style={{ borderColor: `${p.onColor}33` }}>
          {matched.slice(0, 2).map(showFlavor).join(", ")}
        </p>
      )}
    </Link>
  );
}
