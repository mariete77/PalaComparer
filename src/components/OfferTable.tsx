import { formatPrice, type Offer } from "@/data/offers";
import { getStore } from "@/data/stores";

function shippingLabel(offer: Offer): string {
  const store = getStore(offer.storeId);
  if (!store) return "";
  if (offer.total === offer.price) return "Envío gratis";
  return `+ ${formatPrice(store.shipping)} envío`;
}

function checkedLabel(days: number): string {
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
}

export default function OfferTable({ offers }: { offers: Offer[] }) {
  if (offers.length === 0) {
    return (
      <p className="text-sm text-muted">
        Todavía no tenemos ofertas registradas para este modelo.
      </p>
    );
  }

  const cheapest = offers.find((o) => o.inStock) ?? offers[0];

  return (
    <div>
      <p className="text-xs text-muted mb-3">
        Los precios son orientativos y se actualizan periódicamente. El botón te
        lleva a la búsqueda del producto en cada tienda.
      </p>
      {/* En móvil: tarjetas apiladas. En desktop: tabla. */}
      <div className="md:hidden flex flex-col gap-3">
        {offers.map((offer) => {
          const store = getStore(offer.storeId);
          if (!store) return null;
          const isBest = offer === cheapest;
          return (
            <div
              key={offer.storeId}
              className={`rounded-xl p-4 border ${isBest ? "border-primary-container/40 bg-primary-container/5" : "border-white/5 bg-white/[0.03]"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span aria-hidden className="w-2 h-2 rounded-full shrink-0" style={{ background: store.color }} />
                <span className="font-bold text-sm">{store.name}</span>
                {isBest && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary">
                    Mejor
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="font-display font-bold text-lg">{formatPrice(offer.price)}</span>
                  <p className="text-xs text-muted">{shippingLabel(offer)}</p>
                </div>
                <span className={`text-xs ${offer.inStock ? "text-padel" : "text-muted"}`}>
                  {offer.inStock ? "● En stock" : "○ Sin stock"}
                </span>
              </div>
              <a
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className={`mt-3 block text-center px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${isBest ? "btn-primary" : "border border-outline-variant text-on-surface-variant hover:bg-white/5"}`}
              >
                Ver en tienda ↗
              </a>
            </div>
          );
        })}
      </div>
      <table className="hidden md:table w-full text-sm border-separate border-spacing-y-2">
        <caption className="sr-only">
          Ofertas por tienda, ordenadas de menor a mayor precio
        </caption>
        <thead>
          <tr className="text-xs text-muted uppercase tracking-wider text-left">
            <th scope="col" className="font-medium px-4 pb-1">Tienda</th>
            <th scope="col" className="font-medium px-4 pb-1">Disponibilidad</th>
            <th scope="col" className="font-medium px-4 pb-1 text-right">Precio</th>
            <th scope="col" className="font-medium px-4 pb-1 text-right">Total</th>
            <th scope="col" className="sr-only">Ir a la tienda</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => {
            const store = getStore(offer.storeId);
            if (!store) return null;
            const isBest = offer === cheapest;

            return (
              <tr
                key={offer.storeId}
                className={`bg-white/[0.03] ${isBest ? "ring-1 ring-padel/40" : ""}`}
              >
                <td className="px-4 py-3 rounded-l-xl">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: store.color }}
                    />
                    <span className="font-medium">{store.name}</span>
                    {isBest && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-padel text-black">
                        Mejor precio
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Actualizado: {checkedLabel(offer.checkedDaysAgo)}
                  </p>
                </td>
                <td className="px-4 py-3">
                  {offer.inStock ? (
                    <span className="text-padel">● En stock</span>
                  ) : (
                    <span className="text-muted">○ Sin stock</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-display font-bold tabular-nums">
                    {formatPrice(offer.price)}
                  </span>
                  <p className="text-xs text-muted">{shippingLabel(offer)}</p>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted">
                  {formatPrice(offer.total)}
                </td>
                <td className="px-4 py-3 rounded-r-xl text-right">
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className={`inline-block px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                      isBest
                        ? "btn-primary"
                        : "border border-outline-variant text-on-surface-variant hover:bg-white/5"
                    }`}
                  >
                    Ver en tienda ↗
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
