import raw from "@/data/catalog.json";

export type CatalogProduct = {
  slug: string;
  name: string;
  puffs: number | null;
  dual: boolean;
  spec: { battery?: string; liquid?: string; size?: string; charging?: string };
  flavors: string[];
  image: string | null;
  hero?: string;
  heroSize?: [number, number];
  color: string;
  onColor: string;
};

export const catalog = raw as CatalogProduct[];

export const bySlug = (slug: string) => catalog.find((p) => p.slug === slug);

export const formatPuffs = (n: number | null) =>
  n ? `${n.toLocaleString("en-US")} puffs` : "";

/** 50000 -> "50K", 5500 -> "5.5K", 800 -> "800" */
export const fmtK = (n: number | null) =>
  n == null ? "" : n >= 1000 ? `${Number((n / 1000).toFixed(1))}K` : String(n);
