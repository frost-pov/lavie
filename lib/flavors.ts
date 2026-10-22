import type { ShopProduct } from "./stock";

const WORDS = [
  "Ice", "Watermelon", "Mango", "Mint", "Grape", "Blueberry", "Strawberry", "Peach", "Lemon",
  "Apple", "Cola", "Lychee", "Pineapple", "Raspberry", "Kiwi", "Guava", "Passion", "Cherry",
  "Banana", "Coffee", "Energy", "Bubblegum", "Orange", "Melon", "Coconut",
];

/** Flavor words that actually appear in current stock, most common first. */
export function flavorKeywords(products: ShopProduct[], max = 16) {
  const out = WORDS.map((word) => ({
    word,
    count: products.filter((p) => p.inStockFlavors.some((f) => f.toLowerCase().includes(word.toLowerCase())))
      .length,
  }))
    .filter((k) => k.count > 0)
    .sort((a, b) => b.count - a.count);
  return out.slice(0, max);
}

export const matchingFlavors = (p: ShopProduct, word: string) =>
  p.inStockFlavors.filter((f) => f.toLowerCase().includes(word.toLowerCase()));

/** Triple/dual-pod devices store flavors like "A*B*C" or "A & B". Show them as "A / B / C". */
export const showFlavor = (f: string) =>
  f.replace(/\s*[*+&]\s*/g, " / ").replace(/\s+/g, " ").trim();

/** Individual flavor names for decoration, split out of multi-pod entries. */
export const singleFlavors = (flavors: string[]) =>
  Array.from(
    new Set(
      flavors
        .flatMap((f) => f.split(/[*+&]/))
        .map((f) => f.trim().replace(/\w/g, (m) => m.toUpperCase()))
        .filter((f) => f.length > 2 && f.length <= 22),
    ),
  );
