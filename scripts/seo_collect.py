#!/usr/bin/env python3
"""PalaComparer: recoge datos REALES de GA4 + Search Console y los guarda en JSON.

Requiere (una sola vez, ver docs/SEO-AUTOMEJORA.md):
  1. Service account JSON en /root/.gcp/palacomparer-sa.json
  2. Añadir el email de la service account como Lector en GA4 (propiedad G-4YZ39NTPE6)
     y como usuario (con permisos "completos" o al menos restringido) en Search Console
     para palacomparer.com

Salidas (en /root/seo-data/palacomparer/):
  ga4_<YYYY-MM-DD>.json     → páginas, fuentes, países (últimos 28 días)
  gsc_<YYYY-MM-DD>.json     → queries + páginas: clics, impresiones, CTR, posición
  latest/                   → copia symlinks de lo más reciente
Se ejecuta sin credenciales → sale con código 2 y lo deja dicho (para el cron).
"""
import json
import os
import sys
import datetime as dt
from pathlib import Path

OUT = Path("/root/seo-data/palacomparer")
SA = Path("/root/.gcp/palacomparer-sa.json")
GA4_PROPERTY = "properties/G-4YZ39NTPE6"  # GA4 acepta el tracking ID; si falla, usar el ID numérico 4YYYYYYYY
GSC_SITE = "sc-domain:palacomparer.com"
TODAY = dt.date.today().isoformat()

def out_json(name, data):
    OUT.mkdir(parents=True, exist_ok=True)
    p = OUT / name
    p.write_text(json.dumps(data, ensure_ascii=False, indent=1))
    latest = OUT / "latest"
    latest.mkdir(exist_ok=True)
    stable = latest / (name.split("_")[0] + ".json")  # ga4.json / gsc.json
    if stable.exists() or stable.is_symlink():
        stable.unlink()
    try:
        stable.symlink_to(os.path.join("..", name))
    except OSError:
        stable.write_text(p.read_text())
    return p

def fetch_ga4():
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange, Dimension, Metric, RunReportRequest, OrderBy,
    )
    from google.oauth2 import service_account

    creds = service_account.Credentials.from_service_account_file(
        str(SA), scopes=["https://www.googleapis.com/auth/analytics.readonly"]
    )
    client = BetaAnalyticsDataClient(credentials=creds)

    def run(dims, metrics, order=None, limit=50):
        req = RunReportRequest(
            property=GA4_PROPERTY,
            date_ranges=[DateRange(start_date="28daysAgo", end_date="today")],
            dimensions=[Dimension(name=d) for d in dims],
            metrics=[Metric(name=m) for m in metrics],
            limit=limit,
        )
        if order:
            req.order_bys = [order]
        resp = client.run_report(req)
        rows = []
        for row in resp.rows:
            rows.append({d: row.dimension_values[i].value for i, d in enumerate(dims)}
                        | {m: row.metric_values[i].value for i, m in enumerate(metrics)})
        return rows

    data = {
        "generated": dt.datetime.now(dt.timezone.utc).isoformat(),
        "window": "28 días",
        "pages": run(["pageTitle", "pagePath"], ["screenPageViews", "sessions", "averageSessionDuration", "engagementRate"], limit=60),
        "sources": run(["sessionDefaultChannelGroup"], ["sessions", "engagementRate"], limit=20),
        "countries": run(["country"], ["sessions"], limit=15),
        "landing": run(["landingPagePlusQueryString"], ["sessions", "engagementRate", "conversions"], limit=30),
    }
    return data

def fetch_gsc():
    from googleapiclient.discovery import build
    from google.oauth2 import service_account

    creds = service_account.Credentials.from_service_account_file(
        str(SA), scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
    )
    svc = build("searchconsole", "v0", credentials=creds, cache_discovery=False)
    end = dt.date.today()
    start = end - dt.timedelta(days=28)
    body = {
        "startDate": start.isoformat(),
        "endDate": end.isoformat(),
        "dimensions": ["query"],
        "rowLimit": 500,
    }
    resp = svc.searchanalytics().query(siteUrl=GSC_SITE, body=body).execute()
    queries = resp.get("rows", [])
    for r in queries:
        r["ctr"] = round(float(r["ctr"]), 4)
        r["position"] = round(float(r["position"]), 2)

    body_p = dict(body, dimensions=["page"])
    resp_p = svc.searchanalytics().query(siteUrl=GSC_SITE, body=body_p).execute()
    pages = resp_p.get("rows", [])
    for r in pages:
        r["ctr"] = round(float(r["ctr"]), 4)
        r["position"] = round(float(r["position"]), 2)

    return {
        "generated": dt.datetime.now(dt.timezone.utc).isoformat(),
        "window": f"{start} → {end}",
        "site": GSC_SITE,
        "total_queries": len(queries),
        "queries": queries,
        "pages": pages,
    }

def main():
    if not SA.exists():
        print(f"FALTA credencial: {SA}. Ver docs/SEO-AUTOMEJORA.md (sección setup).", file=sys.stderr)
        sys.exit(2)
    ga4 = fetch_ga4()
    p1 = out_json(f"ga4_{TODAY}.json", ga4)
    print(f"GA4 OK → {p1} ({len(ga4['pages'])} páginas)")
    gsc = fetch_gsc()
    p2 = out_json(f"gsc_{TODAY}.json", gsc)
    print(f"GSC OK → {p2} ({gsc['total_queries']} queries)")

if __name__ == "__main__":
    main()
