const STORES = [
  "Amazon",
  "Padel Nuestro",
  "Decathlon",
  "PadelPoint",
  "Time2Padel",
  "StreetPadel",
  "Tennispro",
];

export default function StoreMarquee() {
  // Duplicar para efecto infinito seamless
  const items = [...STORES, ...STORES];

  return (
    <div className="group relative overflow-hidden border-y border-white/5 py-5">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent z-10" />
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="text-sm font-display font-semibold text-on-surface-variant/50 tracking-wide"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
