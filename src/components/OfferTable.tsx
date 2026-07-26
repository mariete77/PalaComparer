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
    <div className="overflow-x-auto">
      <p className="text-xs text-muted mb-3">
        Los precios son orientativos y se actualizan periódicamente. El botón te
        lleva a la búsqueda del producto en cada tienda.
      </p>
      <table className="w-full text-sm border-separate border-spacing-y-2 min-w-[520px]">
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
