# -*- coding: utf-8 -*-
from pathlib import Path

from seo_shared import (
    BASE,
    FOOTER,
    NAV,
    hub_page_graph,
    ld_script,
    service_area_section,
    service_schema,
)

SERVICES = [
    {
        "file": "ac-general-cleaning-lipa-batangas.html",
        "title": "Aircon General Cleaning Lipa Batangas | CoolPro",
        "h1": "Aircon General Cleaning in Lipa Batangas",
        "desc": "Routine split-type and window AC cleaning in Lipa City and Batangas — filters, coils, drain line, and exterior wash.",
        "service_type": "Air conditioning cleaning",
        "bullets": [
            "Filter wash and fin cleaning",
            "Drain line check",
            "Exterior cabinet wipe-down",
            "Ideal every 3–6 months for home units",
        ],
    },
    {
        "file": "ac-chemical-cleaning-lipa-batangas.html",
        "title": "Aircon Chemical Cleaning Lipa Batangas | CoolPro",
        "h1": "Aircon Chemical Cleaning in Lipa Batangas",
        "desc": "Deep chemical flush for units with weak cooling, mold, odor, or heavy buildup.",
        "service_type": "Air conditioning chemical cleaning",
        "bullets": [
            "Full dismantling of indoor unit (split type)",
            "Chemical soak and flush of evaporator",
            "Drain pan and blower cleaning",
            "Recommended when general cleaning is not enough",
        ],
    },
    {
        "file": "ac-repair-lipa-batangas.html",
        "title": "Aircon Repair Lipa Batangas | CoolPro",
        "h1": "Aircon Repair & Troubleshooting in Lipa Batangas",
        "desc": "Diagnose not cooling, leaking water, strange noise, or unit not starting — parts quoted before work.",
        "service_type": "Air conditioning repair",
        "bullets": [
            "Compressor, fan, sensor, and PCB checks",
            "Leak detection when needed",
            "Parts and labor quoted on-site",
            "Split, window, and floor-standing units",
        ],
    },
    {
        "file": "ac-installation-lipa-batangas.html",
        "title": "Aircon Installation Lipa Batangas | CoolPro",
        "h1": "Aircon Installation in Lipa Batangas",
        "desc": "Split-type installation and relocation labor in Lipa and Batangas (AC unit sold separately).",
        "service_type": "Air conditioning installation",
        "bullets": [
            "Wall mounting and bracket setup",
            "Copper tubing and drain routing",
            "Vacuum and test run",
            "Standard home split up to ~1.5 HP",
        ],
    },
    {
        "file": "ac-refrigerant-top-up-lipa-batangas.html",
        "title": "Refrigerant Top-Up Lipa Batangas | CoolPro",
        "h1": "Refrigerant Top-Up in Lipa Batangas",
        "desc": "Freon recharge after leak check when applicable — for units that still run but cool poorly.",
        "service_type": "Refrigerant recharge",
        "bullets": [
            "Pressure check and leak inspection",
            "R410A / R32 as applicable to unit",
            "Advise if cleaning or repair is needed first",
            "Scope confirmed on-site for your unit type",
        ],
    },
]


def service_page(s):
    bullets = "".join(f"<li>{b}</li>" for b in s["bullets"])
    others = [x for x in SERVICES if x["file"] != s["file"]]
    related = "".join(
        f'<a href="{o["file"]}" class="related-card" style="display:block;padding:16px;border:1px solid #E2E8F0;border-radius:12px;margin-bottom:8px;text-decoration:none;color:inherit;"><strong>{o["h1"].split(" in ")[0]}</strong></a>'
        for o in others[:3]
    )
    url = BASE + s["file"]
    short = s["h1"].split(" in ")[0]
    schema = ld_script(
        service_schema(s["h1"], s["desc"], s["service_type"], url)
    )
    return f"""<!DOCTYPE html>
<html lang="en-PH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{s['desc']} Message CoolPro on Messenger or WhatsApp 0948 512 1132.">
  <link rel="canonical" href="{url}">
  <title>{s['title']}</title>
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{s['title']}">
  <meta property="og:description" content="{s['desc']}">
  <meta property="og:image" content="{BASE}assets/coolpro_service_showcase.svg">
  <meta property="og:locale" content="en_PH">
  {schema}
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="index.css">
  <link rel="icon" type="image/png" href="assets/coolpro_logo.png">
</head>
<body>
<div id="progress"></div>
{NAV}
<main>
<section style="padding:140px 24px 80px;background:var(--surface);">
  <div style="max-width:900px;margin:0 auto;">
    <nav class="breadcrumb" aria-label="Breadcrumb" style="font-size:.85rem;color:var(--muted);margin-bottom:12px;">
      <a href="./">Home</a> · <a href="aircon-services-lipa-batangas.html">Services</a> · <span aria-current="page">{short}</span>
    </nav>
    <h1 class="display" style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:800;margin-bottom:16px;">{s['h1']}</h1>
    <p style="color:var(--muted);font-size:1.05rem;line-height:1.7;margin-bottom:32px;">{s['desc']}</p>
    <div style="background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:32px;box-shadow:var(--card-shadow);">
      <img src="assets/coolpro_service_showcase.svg" alt="{s['h1']}" width="800" height="220" style="width:100%;max-height:220px;object-fit:cover;border-radius:12px;margin-bottom:24px;background:#0c4a6e;">
      <p style="font-size:.95rem;color:var(--muted);margin-bottom:16px;">Message us on Messenger or WhatsApp with your AC type, HP, and issue — we&apos;ll confirm scope before your visit.</p>
      <ul style="color:var(--muted);line-height:1.8;padding-left:20px;margin-bottom:28px;">{bullets}</ul>
      <div style="display:flex;flex-wrap:wrap;gap:12px;">
        <a href="https://m.me/coolproairconlipa" class="pill pill-lg" target="_blank" rel="noopener">Book on Messenger</a>
        <a href="https://wa.me/639485121132" class="pill pill-lg pill-whatsapp" target="_blank" rel="noopener">WhatsApp</a>
        <a href="aircon-services-lipa-batangas.html" style="align-self:center;font-weight:600;color:var(--brand-dark);">← All services</a>
      </div>
      <h2 style="font-size:1.1rem;margin:32px 0 12px;">Related services</h2>
      {related}
      <p style="margin-top:28px;font-size:.9rem;color:var(--muted);line-height:1.6;">
        We dispatch from Lipa to
        <a href="aircon-services-tanauan-batangas.html">Tanauan</a>,
        <a href="aircon-services-santo-tomas-batangas.html">Santo Tomas</a>,
        <a href="aircon-services-malvar-batangas.html">Malvar</a>, and
        <a href="service-area-batangas.html">other Batangas towns</a>.
      </p>
    </div>
  </div>
</section>
</main>
{FOOTER}
<script src="script.js"></script>
</body>
</html>"""


def hub_page():
    cards = ""
    for s in SERVICES:
        cards += f"""<article class="unit-card" style="padding:24px;">
      <h3 class="display" style="font-size:1.1rem;margin-bottom:8px;">{s['h1'].split(' in ')[0]}</h3>
      <p style="color:var(--muted);font-size:.88rem;margin-bottom:16px;">{s['desc'][:100]}…</p>
      <a href="{s['file']}" class="pill">View service</a>
    </article>"""
    area = service_area_section().replace('class="reveal"', "")
    towns_blurb = (
        '<p style="text-align:center;margin-top:32px;color:var(--muted);font-size:.95rem;">'
        'We also serve <a href="aircon-services-tanauan-batangas.html">Tanauan</a>, '
        '<a href="aircon-services-santo-tomas-batangas.html">Santo Tomas</a>, '
        '<a href="aircon-services-malvar-batangas.html">Malvar</a>, and '
        '<a href="service-area-batangas.html">more Batangas towns</a>.</p>'
    )
    return f"""<!DOCTYPE html>
<html lang="en-PH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="All CoolPro aircon services in Lipa Batangas — cleaning, repair, installation, refrigerant top-up. Call or message 0948 512 1132.">
  <link rel="canonical" href="{BASE}aircon-services-lipa-batangas.html">
  <title>Aircon Services Lipa Batangas | CoolPro</title>
  <meta property="og:url" content="{BASE}aircon-services-lipa-batangas.html">
  <meta property="og:title" content="Aircon Services Lipa Batangas | CoolPro">
  <meta property="og:locale" content="en_PH">
  {ld_script(hub_page_graph())}
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="index.css">
  <link rel="icon" type="image/png" href="assets/coolpro_logo.png">
</head>
<body>
<div id="progress"></div>
{NAV}
<main>
<section class="page-hero" style="padding:140px 24px 60px;background:var(--hero-gradient);color:#fff;text-align:center;">
  <div class="container"><span class="section-label" style="color:#7DD3FC;">CoolPro Services</span>
  <h1 class="display" style="font-size:2.5rem;font-weight:800;margin:16px 0;">Complete Aircon Services in Lipa &amp; Batangas</h1>
  <p style="max-width:600px;margin:0 auto;opacity:.9;">Cleaning, repair, installation, and refrigerant service — message us to book.</p>
  <a href="https://m.me/coolproairconlipa" class="pill pill-lg" style="margin-top:24px;" target="_blank" rel="noopener">Book on Messenger</a>
  </div>
</section>
<section style="padding:80px 24px;background:var(--surface);">
  <div class="container" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;">{cards}</div>
</section>
{towns_blurb}
{area}
</main>
{FOOTER}
<script src="script.js"></script>
</body>
</html>"""


def main():
    root = Path(__file__).parent
    for s in SERVICES:
        (root / s["file"]).write_text(service_page(s), encoding="utf-8")
    (root / "aircon-services-lipa-batangas.html").write_text(hub_page(), encoding="utf-8")
    print("generated", len(SERVICES) + 1, "service pages")


if __name__ == "__main__":
    main()
