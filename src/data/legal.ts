// Textos legales (aviso legal, privacidad, cookies).
//
// IMPORTANTE: los campos entre corchetes son marcadores, no texto final. La
// página muestra un aviso de "borrador" mientras quede alguno, para que no se
// publique por accidente con [NIF] a la vista.
//
// Datos que faltan del titular: razón social o nombre, NIF, domicilio y email.

import type { Locale } from "@/i18n/locales";

interface Section {
  heading: string;
  body: string;
}

export interface LegalPage {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  sections: Record<Locale, Section[]>;
}

const TITULAR = "[RAZÓN SOCIAL]";
const NIF = "[NIF]";
const DOMICILIO = "[DOMICILIO]";
const EMAIL = "[EMAIL DE CONTACTO]";

const avisoLegal: LegalPage = {
  slug: "aviso-legal",
  title: { es: "Aviso legal", en: "Legal notice" },
  description: {
    es: "Titularidad del sitio, condiciones de uso y responsabilidad sobre los datos publicados.",
    en: "Site ownership, terms of use and liability for the data published.",
  },
  sections: {
    es: [
      {
        heading: "Titular del sitio",
        body: `En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa de que este sitio es titularidad de ${TITULAR}, con NIF ${NIF} y domicilio en ${DOMICILIO}. Puedes contactar en ${EMAIL}.`,
      },
      {
        heading: "Objeto del sitio",
        body: "PalaComparer es un comparador independiente de palas de pádel y raquetas de tenis. Publicamos especificaciones facilitadas por los fabricantes y precios recogidos de tiendas online. No vendemos productos ni intermediamos en ninguna compra.",
      },
      {
        heading: "Sobre los precios y las especificaciones",
        body: "Los precios son orientativos y corresponden al momento de la última comprobación, que se indica en cada ficha. Pueden variar sin aviso y la única referencia válida es la de la tienda en el momento de la compra. Las especificaciones proceden de los fabricantes; si detectas un error, escríbenos y lo corregimos.",
      },
      {
        heading: "Enlaces a terceros",
        body: "Los enlaces a tiendas llevan a sitios ajenos que tienen sus propias condiciones. No cobramos comisión por estos enlaces y ninguna tienda puede pagar por aparecer antes en la tabla de ofertas. No respondemos del contenido ni de las transacciones realizadas en esos sitios.",
      },
      {
        heading: "Propiedad intelectual",
        body: "Las marcas, logotipos e imágenes de producto pertenecen a sus respectivos titulares y se usan con fines identificativos y de comparación. Si eres titular de alguna imagen y quieres que la retiremos o la acreditemos de otra forma, escríbenos y lo resolvemos.",
      },
    ],
    en: [
      {
        heading: "Site owner",
        body: `This site is owned by ${TITULAR}, tax ID ${NIF}, registered at ${DOMICILIO}. Contact: ${EMAIL}.`,
      },
      {
        heading: "Purpose",
        body: "PalaComparer is an independent comparison site for padel paddles and tennis rackets. We publish manufacturer specifications and prices collected from online stores. We do not sell products or take part in any purchase.",
      },
      {
        heading: "About prices and specifications",
        body: "Prices are indicative and reflect the last check, shown on each product page. They may change without notice and the only valid reference is the store's own price at the time of purchase. Specifications come from manufacturers; if you spot an error, tell us and we will fix it.",
      },
      {
        heading: "Third-party links",
        body: "Store links lead to external sites with their own terms. We earn no commission from these links and no store can pay to rank higher in the offers table. We are not responsible for their content or for transactions made there.",
      },
      {
        heading: "Intellectual property",
        body: "Brands, logos and product images belong to their respective owners and are used for identification and comparison purposes. If you own an image and want it removed or credited differently, contact us.",
      },
    ],
  },
};

const privacidad: LegalPage = {
  slug: "privacidad",
  title: { es: "Política de privacidad", en: "Privacy policy" },
  description: {
    es: "Qué datos tratamos, con qué base legal y qué derechos tienes sobre ellos.",
    en: "What data we process, on what legal basis, and your rights over it.",
  },
  sections: {
    es: [
      {
        heading: "Responsable del tratamiento",
        body: `${TITULAR}, NIF ${NIF}, domicilio en ${DOMICILIO}. Contacto: ${EMAIL}.`,
      },
      {
        heading: "Qué datos tratamos",
        body: "PalaComparer no tiene registro de usuarios ni formularios: no recogemos nombre, email ni ningún dato identificativo que nos facilites voluntariamente. Los únicos datos tratados son los de navegación que generan las herramientas de analítica.",
      },
      {
        heading: "Analítica",
        body: "Usamos Google Analytics 4 y Vercel Analytics para saber qué páginas se visitan y mejorar el sitio. Recogen datos de uso agregados, como páginas vistas, dispositivo y país aproximado. La base legal es tu consentimiento, que puedes retirar en cualquier momento desde el aviso de cookies.",
      },
      {
        heading: "Conservación y destinatarios",
        body: "Los datos de analítica se conservan según los plazos de cada proveedor. Google LLC y Vercel Inc. actúan como encargados del tratamiento y pueden implicar transferencias internacionales amparadas en las cláusulas contractuales tipo de la Comisión Europea.",
      },
      {
        heading: "Tus derechos",
        body: `Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${EMAIL}. Si consideras que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).`,
      },
    ],
    en: [
      {
        heading: "Data controller",
        body: `${TITULAR}, tax ID ${NIF}, registered at ${DOMICILIO}. Contact: ${EMAIL}.`,
      },
      {
        heading: "What data we process",
        body: "PalaComparer has no user accounts and no forms: we do not collect names, emails or any identifying data you provide. The only data processed is browsing data generated by analytics tools.",
      },
      {
        heading: "Analytics",
        body: "We use Google Analytics 4 and Vercel Analytics to understand which pages are visited and improve the site. They collect aggregated usage data such as page views, device and approximate country. The legal basis is your consent, which you can withdraw at any time from the cookie notice.",
      },
      {
        heading: "Retention and recipients",
        body: "Analytics data is retained according to each provider's terms. Google LLC and Vercel Inc. act as data processors, which may involve international transfers covered by the European Commission's standard contractual clauses.",
      },
      {
        heading: "Your rights",
        body: `You may exercise your rights of access, rectification, erasure, objection, restriction and portability by writing to ${EMAIL}. If you believe your request was not handled properly, you can complain to the Spanish Data Protection Agency (aepd.es).`,
      },
    ],
  },
};

const cookies: LegalPage = {
  slug: "cookies",
  title: { es: "Política de cookies", en: "Cookie policy" },
  description: {
    es: "Qué cookies usa el sitio, para qué sirven y cómo desactivarlas.",
    en: "Which cookies the site uses, what they do and how to disable them.",
  },
  sections: {
    es: [
      {
        heading: "Qué es una cookie",
        body: "Un fichero pequeño que un sitio guarda en tu navegador para recordar información entre visitas. Algunas son imprescindibles para que la web funcione y otras sirven para medir el uso.",
      },
      {
        heading: "Cookies que usamos",
        body: "Técnicas: recuerdan tu idioma y los modelos que has añadido al comparador. Son necesarias para el funcionamiento y no requieren consentimiento.\n\nAnalíticas: Google Analytics 4 (_ga, _ga_*) y Vercel Analytics, para medir visitas y páginas vistas. Requieren tu consentimiento.",
      },
      {
        heading: "Cómo desactivarlas",
        body: "Puedes retirar tu consentimiento desde el aviso de cookies o bloquearlas desde la configuración de tu navegador. Si bloqueas las técnicas, el selector de idioma y el comparador pueden dejar de recordar tus preferencias.",
      },
    ],
    en: [
      {
        heading: "What is a cookie",
        body: "A small file a site stores in your browser to remember information between visits. Some are essential for the site to work; others measure usage.",
      },
      {
        heading: "Cookies we use",
        body: "Essential: remember your language and the models added to the comparator. Required for the site to work; no consent needed.\n\nAnalytics: Google Analytics 4 (_ga, _ga_*) and Vercel Analytics, to measure visits and page views. These require your consent.",
      },
      {
        heading: "How to disable them",
        body: "You can withdraw consent from the cookie notice or block cookies in your browser settings. Blocking essential cookies means the language switcher and the comparator will stop remembering your preferences.",
      },
    ],
  },
};

const PAGES: LegalPage[] = [avisoLegal, privacidad, cookies];

export const LEGAL_SLUGS: string[] = PAGES.map((p) => p.slug);

export const LEGAL_PAGES = {
  pages: PAGES,
  /** Fecha que se muestra como "última actualización". */
  updated: "1 de agosto de 2026",
};

export function getLegalPage(slug: string): LegalPage | undefined {
  return PAGES.find((p) => p.slug === slug);
}
