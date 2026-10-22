import { catalog, type CatalogProduct } from "./catalog";
import { readState } from "./store";

export type ShopProduct = CatalogProduct & {
  price: number | null;
  inStockFlavors: string[];
};

/** Catalogue merged with current stock. Only products with at least one flavor in stock are "available". */
export async function getShopProducts(): Promise<ShopProduct[]> {
  const state = await readState();
  return catalog.map((p) => {
    const s = state.products[p.slug];
    return {
      ...p,
      price: s?.price ?? null,
      inStockFlavors: p.flavors.filter((f) => s?.flavors?.[f]),
    };
  });
}
