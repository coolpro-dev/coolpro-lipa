# -*- coding: utf-8 -*-
"""Generate town hub pages and Batangas service-area index. Run: python gen_towns.py"""
from datetime import date
from pathlib import Path

from gen_pages import SERVICES
from seo_shared import BASE, FOOTER, HEAD_COMMON, NAV, breadcrumb_schema, ld_script

LASTMOD = date.today().isoformat()
SERVICE_AREA_FILE = "service-area-batangas.html"

TOWN_HUBS = [
    {
        "slug": "tanauan",
        "name": "Tanauan",
        "file": "aircon-services-tanauan-batangas.html",
        "title": "Aircon Services Tanauan Batangas | CoolPro Lipa",
        "meta": (
            "CoolPro aircon cleaning, repair, installation & refrigerant service in Tanauan, Batangas. "
            "Split, window & inverter units. Message 0948 512 1132 or Messenger for a quote."
        ),
        "h1": "Aircon Services in Tanauan, Batangas",
        "intro": [
            "CoolPro dispatches technicians from Lipa City to Tanauan City and nearby barangays along the STAR Tollway corridor. "
            "We handle general and chemical cleaning, troubleshooting, installation labor, and refrigerant top-up for homes, apartments, and small shops.",
            "Many Tanauan clients contact us for split-type units in subdivisions and for window AC in older builds. "
            "Message your barangay and AC details on Messenger — we confirm scope and schedule before the visit.",
        ],
        "local_note": "Regular routes include areas toward Tanauan City proper and communities between Tanauan and Lipa.",
        "faqs": [
            {
                "q": "Do you service Tanauan from Lipa?",
                "a": "Yes. We travel from Lipa City to Tanauan for scheduled aircon service. Send your exact barangay on Messenger so we can confirm timing.",
            },
            {
                "q": "What aircon services are available in Tanauan?",
                "a": "General cleaning, chemical cleaning, repair, installation labor, and refrigerant top-up — the same services we offer across Batangas.",
            },
            {
                "q": "How do I book aircon service in Tanauan?",
                "a": "Message m.me/coolproairconlipa with AC type, HP, issue, and your Tanauan barangay. We reply on Messenger or WhatsApp at 0948 512 1132.",
            },
        ],
    },
    {
        "slug": "santo-tomas",
        "name": "Santo Tomas",
        "file": "aircon-services-santo-tomas-batangas.html",
        "title": "Aircon Services Santo Tomas Batangas | CoolPro Lipa",
        "meta": (
            "Aircon cleaning, repair & installation in Santo Tomas, Batangas — CoolPro from Lipa. "
            "Homes & rentals near industrial areas. Book via Messenger or call 0948 512 1132."
        ),
        "h1": "Aircon Services in Santo Tomas, Batangas",
        "intro": [
            "Santo Tomas is one of our regular service areas outside Lipa — from residential streets to rental units near industrial zones. "
            "CoolPro provides on-site aircon cleaning, repair, installation, and refrigerant service for split-type, window, and floor-standing units.",
            "Humidity and dust in the area mean filters and drain lines need attention; we explain whether general or chemical cleaning fits your unit before work starts.",
        ],
        "local_note": "We serve Santo Tomas City and barangays along common Lipa–Santo Tomas routes.",
        "faqs": [
            {
                "q": "Is Santo Tomas within CoolPro's service area?",
                "a": "Yes. We schedule visits to Santo Tomas from our Lipa base. Share your location pin or landmark when booking.",
            },
            {
                "q": "Can you repair inverter aircon in Santo Tomas?",
                "a": "Yes. We diagnose not cooling, leaks, and electrical issues on inverter and non-inverter units. Parts are quoted on-site.",
            },
            {
                "q": "How soon can you come to Santo Tomas?",
                "a": "Availability depends on the day's route. Message us early on Messenger with your preferred date and we confirm the schedule.",
            },
        ],
    },
    {
        "slug": "malvar",
        "name": "Malvar",
        "file": "aircon-services-malvar-batangas.html",
        "title": "Aircon Services Malvar Batangas | CoolPro Lipa",
        "meta": (
            "CoolPro aircon technician visits in Malvar, Batangas — cleaning, repair, install & top-up. "
            "Based in Lipa. Messenger or 0948 512 1132 for quotes."
        ),
        "h1": "Aircon Services in Malvar, Batangas",
        "intro": [
            "Malvar sits between major Batangas hubs, and CoolPro includes it in our regular dispatch map from Lipa City. "
            "We help homeowners and small businesses with aircon maintenance before summer peaks and with repairs when units stop cooling.",
            "Typical jobs in Malvar include split-type general cleaning, chemical flush for mold or odor, and installation labor when you already have a unit.",
        ],
        "local_note": "Malvar barangays along the Lipa–Tanauan corridor are commonly scheduled on the same routes.",
        "faqs": [
            {
                "q": "Do you cover Malvar, Batangas?",
                "a": "Yes. Malvar is part of our Batangas service area. Message us with your barangay to confirm the next available slot.",
            },
            {
                "q": "Do you bring tools and cleaning covers to Malvar?",
                "a": "Yes. Our technicians arrive with standard cleaning and service tools for split and window units.",
            },
            {
                "q": "Can I get a quote before you visit Malvar?",
                "a": "Yes. Send AC type, HP, and the issue on Messenger. We confirm scope and pricing before dispatch when possible.",
            },
        ],
    },
    {
        "slug": "mataasnakahoy",
        "name": "Mataasnakahoy",
        "file": "aircon-services-mataasnakahoy-batangas.html",
        "title": "Aircon Services Mataasnakahoy Batangas | CoolPro Lipa",
        "meta": (
            "Aircon cleaning & repair in Mataasnakahoy, Batangas — CoolPro Lipa. "
            "Homes & lakeside properties. Book on Messenger or WhatsApp 0948 512 1132."
        ),
        "h1": "Aircon Services in Mataasnakahoy, Batangas",
        "intro": [
            "Mataasnakahoy includes upland and lakeside barangays where aircon units work hard in humid weather. "
            "CoolPro travels from Lipa to service homes, rest houses, and small lodgings that need reliable cooling maintenance.",
            "We recommend periodic general cleaning for units that run daily, and chemical service when you notice weak airflow, odor, or mold.",
        ],
        "local_note": "Send your barangay or nearest landmark — some routes follow the lakeshore and upland roads from Lipa.",
        "faqs": [
            {
                "q": "Do you go to Mataasnakahoy for aircon cleaning?",
                "a": "Yes. We schedule Mataasnakahoy when it fits our Batangas route. Contact us on Messenger with your exact location.",
            },
            {
                "q": "Can you service vacation homes in Mataasnakahoy?",
                "a": "Yes. Tell us if the property is occupied or vacant so we can plan access and timing with you.",
            },
            {
                "q": "What if my unit is not cooling at a lakeside property?",
                "a": "We troubleshoot cooling issues on-site and quote repair or cleaning if needed. Message photos of the unit label if you can.",
            },
        ],
    },
    {
        "slug": "talisay",
        "name": "Talisay",
        "file": "aircon-services-talisay-batangas.html",
        "title": "Aircon Services Talisay Batangas | CoolPro Lipa",
        "meta": (
            "CoolPro aircon services in Talisay, Batangas — cleaning, repair, installation & refrigerant. "
            "Technicians from Lipa City. Call or Messenger 0948 512 1132."
        ),
        "h1": "Aircon Services in Talisay, Batangas",
        "intro": [
            "Talisay (Batangas) is within CoolPro's extended service area from Lipa — we visit for cleaning, repair, and installation requests around the municipality and Taal Lake communities.",
            "Window and split-type units in older homes and newer builds are both common; we match the service to your unit type and condition.",
            "Book by Messenger with your barangay, AC brand if known, and symptoms — we confirm before sending a technician.",
        ],
        "local_note": "Talisay bookings are scheduled together with other southern Batangas routes when possible.",
        "faqs": [
            {
                "q": "Is Talisay, Batangas covered by CoolPro?",
                "a": "Yes. We service Talisay as part of Batangas Province coverage from Lipa. Message your barangay to confirm schedule.",
            },
            {
                "q": "Do you offer chemical cleaning in Talisay?",
                "a": "Yes, when a unit needs deeper flushing for mold, odor, or heavy buildup. We can advise after you describe the issue.",
            },
            {
                "q": "How do I book from Talisay?",
                "a": "Use Messenger at m.me/coolproairconlipa or WhatsApp 0948 512 1132 with your location and AC details.",
            },
        ],
    },
]

SECONDARY_TOWNS = [
    "Batangas City",
    "Rosario",
    "San Jose",
    "Ibaan",
    "Cuenca",
    "Balete",
    "Padre Garcia",
]


def town_faq_schema(faqs):
    return {
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": f["q"],
                "acceptedAnswer": {"@type": "Answer", "text": f["a"]},
            }
            for f in faqs
        ],
    }


def town_hub_graph(town):
    url = BASE + town["file"]
    graph = [
        {
            "@type": "WebPage",
            "name": town["h1"],
            "description": town["meta"],
            "url": url,
            "about": {"@id": BASE + "#business"},
            "areaServed": {"@type": "City", "name": town["name"]},
        },
        breadcrumb_schema(
            [
                ("Home", BASE),
                ("Service areas", BASE + SERVICE_AREA_FILE),
                (town["name"], url),
            ]
        ),
        town_faq_schema(town["faqs"]),
    ]
    return {"@context": "https://schema.org", "@graph": graph}


def service_area_index_graph():
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "name": "CoolPro Aircon Service Areas in Batangas",
                "url": BASE + SERVICE_AREA_FILE,
                "about": {"@id": BASE + "#business"},
            },
            breadcrumb_schema(
                [
                    ("Home", BASE),
                    ("Service areas", BASE + SERVICE_AREA_FILE),
                ]
            ),
        ],
    }


def service_cards_html():
    cards = ""
    for s in SERVICES:
        short = s["h1"].split(" in ")[0]
        cards += f"""<article class="unit-card" style="padding:20px;">
      <h3 class="display" style="font-size:1rem;margin-bottom:8px;">{short}</h3>
      <p style="color:var(--muted);font-size:.85rem;margin-bottom:12px;">{s['desc'][:90]}…</p>
      <a href="{s['file']}" class="pill">View details</a>
    </article>"""
    return cards


def town_faq_html(faqs):
    return "\n      ".join(
        f'<details style="padding:14px 0;border-bottom:1px solid #E2E8F0;">'
        f"<summary>{f['q']}</summary>"
        f'<p style="color:var(--muted);margin-top:8px;font-size:.95rem;">{f["a"]}</p>'
        f"</details>"
        for f in faqs
    )


def town_page(town):
    intro_html = "".join(
        f'<p style="color:var(--muted);line-height:1.75;margin-bottom:16px;">{p}</p>'
        for p in town["intro"]
    )
    url = BASE + town["file"]
    return f"""<!DOCTYPE html>
<html lang="en-PH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{town['meta']}">
  <link rel="canonical" href="{url}">
  <title>{town['title']}</title>
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{town['title']}">
  <meta property="og:description" content="{town['meta']}">
  <meta property="og:locale" content="en_PH">
  {ld_script(town_hub_graph(town))}
  {HEAD_COMMON}
</head>
<body>
<div id="progress"></div>
{NAV}
<main>
<section style="padding:140px 24px 48px;background:var(--hero-gradient);color:#fff;">
  <div style="max-width:900px;margin:0 auto;">
    <nav class="breadcrumb" aria-label="Breadcrumb" style="font-size:.85rem;margin-bottom:16px;">
      <a href="./" style="color:#7DD3FC;">Home</a> ·
      <a href="{SERVICE_AREA_FILE}" style="color:#7DD3FC;">Service areas</a> ·
      <span style="color:rgba(255,255,255,.9);">{town['name']}</span>
    </nav>
    <h1 class="display" style="font-size:clamp(1.9rem,4vw,2.6rem);font-weight:800;margin-bottom:20px;">{town['h1']}</h1>
    <p style="opacity:.9;line-height:1.7;max-width:640px;">Technicians dispatched from Lipa City — cleaning, repair, installation &amp; refrigerant service.</p>
    <a href="https://m.me/coolproairconlipa" class="pill pill-lg" style="margin-top:24px;" target="_blank" rel="noopener">Book on Messenger</a>
  </div>
</section>
<section style="padding:64px 24px;background:var(--surface);">
  <div style="max-width:900px;margin:0 auto;">
    {intro_html}
    <p style="color:var(--muted);font-size:.9rem;font-style:italic;margin-bottom:32px;">{town['local_note']}</p>
    <h2 class="display" style="font-size:1.35rem;margin-bottom:20px;">Aircon services available in {town['name']}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:40px;">
      {service_cards_html()}
    </div>
    <p style="margin-bottom:24px;">All services follow the same standards as our <a href="aircon-services-lipa-batangas.html">Lipa &amp; Batangas service pages</a> — message us for a quote before your visit.</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:48px;">
      <a href="https://m.me/coolproairconlipa" class="pill pill-lg" target="_blank" rel="noopener">Messenger</a>
      <a href="https://wa.me/639485121132" class="pill pill-lg pill-whatsapp" target="_blank" rel="noopener">WhatsApp</a>
      <a href="tel:+639485121132" class="pill pill-lg pill-outline">Call 0948 512 1132</a>
    </div>
    <h2 class="display" style="font-size:1.2rem;margin-bottom:16px;">FAQ — {town['name']}</h2>
    <div style="max-width:700px;">
      {town_faq_html(town['faqs'])}
    </div>
    <p style="margin-top:32px;font-size:.9rem;color:var(--muted);">
      <a href="{SERVICE_AREA_FILE}">← All Batangas service areas</a> · <a href="./">Home</a>
    </p>
  </div>
</section>
</main>
{FOOTER}
<script src="script.js"></script>
</body>
</html>"""



def service_area_index_page():
    hub_links = ""
    for t in TOWN_HUBS:
        hub_links += f"""<li style="padding:12px 0;border-bottom:1px solid #E2E8F0;">
      <a href="{t['file']}" style="font-weight:600;color:var(--brand-dark);">Aircon services in {t['name']}</a>
      <p style="color:var(--muted);font-size:.88rem;margin-top:4px;">{t['intro'][0][:120]}…</p>
    </li>"""

    chips = "".join(
        f'<a href="{t["file"]}" style="display:inline-block;margin:4px 8px 4px 0;padding:8px 14px;border:1px solid #E2E8F0;border-radius:999px;font-size:.88rem;text-decoration:none;color:inherit;">{t["name"]}</a>'
        for t in TOWN_HUBS
    )
    secondary = ", ".join(SECONDARY_TOWNS)
    url = BASE + SERVICE_AREA_FILE

    return f"""<!DOCTYPE html>
<html lang="en-PH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="CoolPro aircon service areas in Batangas — Lipa, Tanauan, Santo Tomas, Malvar, Mataasnakahoy, Talisay and more. Book on Messenger 0948 512 1132.">
  <link rel="canonical" href="{url}">
  <title>Aircon Service Areas Batangas | CoolPro Lipa</title>
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="Aircon Service Areas Batangas | CoolPro Lipa">
  <meta property="og:locale" content="en_PH">
  {ld_script(service_area_index_graph())}
  {HEAD_COMMON}
</head>
<body>
<div id="progress"></div>
{NAV}
<main>
<section style="padding:140px 24px 60px;background:var(--hero-gradient);color:#fff;text-align:center;">
  <div style="max-width:720px;margin:0 auto;">
    <h1 class="display" style="font-size:2.4rem;font-weight:800;margin-bottom:16px;">Aircon Service Areas in Batangas</h1>
    <p style="opacity:.9;line-height:1.7;">CoolPro is based in Lipa City and dispatches technicians across Batangas Province.</p>
  </div>
</section>
<section style="padding:64px 24px;background:#fff;">
  <div style="max-width:800px;margin:0 auto;">
    <h2 class="display" style="font-size:1.5rem;margin-bottom:8px;">Primary towns we visit</h2>
    <p style="color:var(--muted);margin-bottom:24px;">Each link has local details, services, and FAQs for that town.</p>
    <ul style="list-style:none;margin-bottom:40px;">{hub_links}</ul>
    <h2 class="display" style="font-size:1.35rem;margin-bottom:12px;">Lipa City (home base)</h2>
    <p style="color:var(--muted);line-height:1.75;margin-bottom:24px;">
      Main coverage: <strong>Lipa City</strong> — <a href="./">homepage</a> · <a href="aircon-services-lipa-batangas.html">all services</a>.
    </p>
    <h2 class="display" style="font-size:1.35rem;margin-bottom:12px;">Also serving</h2>
    <p style="color:var(--muted);line-height:1.75;margin-bottom:16px;">
      We also take bookings in {secondary}, and nearby barangays when scheduling allows.
      Message your location on <a href="https://m.me/coolproairconlipa" target="_blank" rel="noopener">Messenger</a> to confirm.
    </p>
    <div style="margin-bottom:40px;">{chips}</div>
    <a href="https://m.me/coolproairconlipa" class="pill pill-lg" target="_blank" rel="noopener">Book on Messenger</a>
  </div>
</section>
</main>
{FOOTER}
<script src="script.js"></script>
</body>
</html>"""

def write_sitemap_locations(root: Path):
    urls = [
        f"  <url><loc>{BASE}{SERVICE_AREA_FILE}</loc><lastmod>{LASTMOD}</lastmod><priority>0.75</priority></url>\n"
    ]
    for t in TOWN_HUBS:
        urls.append(
            f'  <url><loc>{BASE}{t["file"]}</loc><lastmod>{LASTMOD}</lastmod><priority>0.75</priority></url>\n'
        )
    content = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(urls)
        + "</urlset>\n"
    )
    (root / "sitemap-locations.xml").write_text(content, encoding="utf-8")


def main():
    root = Path(__file__).parent
    for town in TOWN_HUBS:
        (root / town["file"]).write_text(town_page(town), encoding="utf-8")
    (root / SERVICE_AREA_FILE).write_text(service_area_index_page(), encoding="utf-8")
    write_sitemap_locations(root)
    print(
        "generated",
        len(TOWN_HUBS),
        "town hubs +",
        SERVICE_AREA_FILE,
        "+ sitemap-locations.xml",
    )


if __name__ == "__main__":
    main()
