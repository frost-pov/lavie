/** One slow strip of flavors that are in stock right now. Decorative, so hidden from screen readers. */
export function Marquee({ items }: { items: string[] }) {
  if (items.length < 4) return null;
  const row = [...items, ...items];
  return (
    <div aria-hidden className="overflow-hidden border-y border-ink py-5 sm:py-7">
      <div className="marquee-track">
        {row.map((f, i) => (
          <span
            key={i}
            className={`cond mr-8 whitespace-nowrap text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-none sm:mr-12 ${
              i % 2 ? "outline-text" : ""
            }`}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
