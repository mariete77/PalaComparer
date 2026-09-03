import { formatPrice, type Offer } from "@/data/offers";
import { getStore } from "@/data/stores";
import { translate, type Locale, type TranslationKey } from "@/i18n/locales";

type Translator = (key: TranslationKey, params?: Record<string, string | number>) => string;

function shippingLabel(offer: Offer, t: Translator): string {
  const store = getStore(offer.storeId);
  if (!store) return "";
  if (offer.total === offer.price) return t("offers.envioGratis");
  return t("offers.envio", { coste: formatPrice(store.shipping) });
}

function checkedLabel(days: number, t: Translator): string {
  if (days === 0) return t("offers.hoy");
  if (days === 1) return t("offers.ayer");
  return t("offers.haceDias", { n: days });
}

export default function OfferTable({ offers, locale }: { offers: Offer[]; locale: Locale }) {
  const t: Translator = (key, params) => translate(locale, key, params);

  if (offers.length === 0) {
    return (
      <p className="text-sm text-muted">
        {t("offers.sinOfertas")}
      </p>
    );
  }

  const cheapest = offers.find((o) => o.inStock) ?? offers[0];

  return (
    <div>
      {/* Declaración de independencia: confirmado que hoy no hay afiliación.
          Si algún día se activa, este texto tiene que cambiar antes. */}
      <p className="text-xs text-muted mb-3">
        {t("offers.notaOrientativa")} {" "}
        <strong className="font-semibold text-on-surface">
          {t("offers.sinComision")}
        </strong>
        {t("offers.notaOrden")}
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
              className={`rounded-xl p-4 border ${isBest ? "border-primary-container/40 bg-primary-container/5" : "border-overlay-5 bg-overlay-3"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span aria-hidden className="w-2 h-2 rounded-full shrink-0" style={{ background: store.color }} />
                <span className="font-bold text-sm">{store.name}</span>
                {isBest && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary">
                    {t("offers.mejor")}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="font-display font-bold text-lg">{formatPrice(offer.price)}</span>
                  <p className="text-xs text-muted">{shippingLabel(offer, t)}</p>
                </div>
                <span className={`text-xs ${offer.inStock ? "text-padel-strong" : "text-muted"}`}>
                  {offer.inStock ? `● ${t("offers.enStock")}` : `○ ${t("offers.sinStock")}`}
                </span>
              </div>
              <a
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className={`mt-3 block text-center px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${isBest ? "btn-primary" : "border border-outline-variant text-on-surface-variant hover:bg-overlay-5"}`}
              >
                {t("offers.verTienda")}
              </a>
            </div>
          );
        })}
      </div>
      <table className="hidden md:table w-full text-sm border-separate border-spacing-y-2">
        <caption className="sr-only">
          {t("offers.caption")}
        </caption>
        <thead>
          <tr className="text-xs text-muted uppercase tracking-wider text-left">
            <th scope="col" className="font-medium px-4 pb-1">{t("offers.tienda")}</th>
            <th scope="col" className="font-medium px-4 pb-1">{t("offers.disponibilidad")}</th>
            <th scope="col" className="font-medium px-4 pb-1 text-right">{t("offers.precio")}</th>
            <th scope="col" className="font-medium px-4 pb-1 text-right">{t("offers.total")}</th>
            <th scope="col" className="sr-only">{t("offers.irTienda")}</th>
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
                className={`bg-overlay-3 ${isBest ? "ring-1 ring-padel/40" : ""}`}
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
                        {t("offers.mejorPrecio")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {t("offers.actualizado")} {checkedLabel(offer.checkedDaysAgo, t)}
                  </p>
                </td>
                <td className="px-4 py-3">
                  {offer.inStock ? (
                    <span className="text-padel-strong">● {t("offers.enStock")}</span>
                  ) : (
                    <span className="text-muted">○ {t("offers.sinStock")}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-display font-bold tabular-nums">
                    {formatPrice(offer.price)}
                  </span>
                  <p className="text-xs text-muted">{shippingLabel(offer, t)}</p>
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
                        : "border border-outline-variant text-on-surface-variant hover:bg-overlay-5"
                    }`}
                  >
                    {t("offers.verTienda")}
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
