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
};

export const catalog = raw as CatalogProduct[];

export const bySlug = (slug: string) => catalog.find((p) => p.slug === slug);

export const formatPuffs = (n: number | null) =>
  n ? `${n.toLocaleString("en-US")} puffs` : "";
