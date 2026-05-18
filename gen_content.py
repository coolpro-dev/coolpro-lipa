# -*- coding: utf-8 -*-
"""Generate FAQ hub, guides index, articles, and content sitemap."""
from datetime import date
from html import escape
from pathlib import Path

from content_data import (
    ARTICLES,
    FAQ_HUB_ALL,
    FAQ_HUB_FILE,
    GUIDES_INDEX_FILE,
)
from seo_shared import (
    BASE,
    FOOTER,
    NAV,
    breadcrumb_schema,
    faq_details_html,
    ld_script,
    picture_img,
)

LASTMOD = date.today().isoformat()


def faq_hub_graph():
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "FAQPage",
                "name": "Aircon Service FAQ — Lipa & Batangas",
                "url": BASE + FAQ_HUB_FILE,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": item["q"],
                        "acceptedAnswer": {"@type": "Answer", "text": item["a"]},
                    }
                    for item in FAQ_HUB_ALL
                ],
            },
            breadcrumb_schema(
                [
                    ("Home", BASE),
                    ("FAQ", BASE + FAQ_HUB_FILE),
                ]
            ),
        ],
    }


def article_graph(article):
    url = BASE + article["file"]
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": article["h1"],
                "description": article["meta"],
                "url": url,
                "image": BASE + "assets/" + article["image"],
                "author": {"@id": BASE + "#business"},
                "publisher": {"@id": BASE + "#business"},
                "inLanguage": "en-PH",
            },
            breadcrumb_schema(
                [
                    ("Home", BASE),
                    ("Guides", BASE + GUIDES_INDEX_FILE),
                    (article["h1"][:40], url),
                ]
            ),
        ],
    }


def guides_index_graph():
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "name": "Aircon Guides — Lipa & Batangas",
                "url": BASE + GUIDES_INDEX_FILE,
                "about": {"@id": BASE + "#business"},
            },
            breadcrumb_schema(
                [
                    ("Home", BASE),
                    ("Guides", BASE + GUIDES_INDEX_FILE),
                ]
            ),
        ],
    }


def cta_block():
    return """<div class="cta-panel" style="margin-top:40px;padding:28px;background:var(--surface);border-radius:16px;text-align:center;">
  <p style="margin-bottom:16px;color:var(--muted);">Need aircon service in Lipa or Batangas?</p>
  <a href="https://m.me/coolproairconlipa" class="pill pill-lg" target="_blank" rel="noopener">Book on Messenger</a>
  <a href="tel:+639485121132" class="pill pill-lg pill-outline" style="margin-left:8px;">Call 0948 512 1132</a>
</div>"""


def faq_hub_page():
    url = BASE + FAQ_HUB_FILE
    faq_html = faq_details_html(FAQ_HUB_ALL)
    return f"""<!DOCTYPE html>
<html lang="en-PH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Answers about aircon cleaning, repair, installation, pricing, and service areas in Lipa City and Batangas — CoolPro FAQ.">
  <link rel="canonical" href="{url}">
  <title>Aircon FAQ Lipa Batangas | CoolPro</title>
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="Aircon FAQ Lipa Batangas | CoolPro">
  <meta property="og:locale" content="en_PH">
  {ld_script(faq_hub_graph())}
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="index.css">
  <link rel="icon" type="image/png" href="assets/coolpro_logo.png">
</head>
<body>
<div id="progress"></div>
{NAV}
<main>
<section style="padding:140px 24px 48px;background:var(--hero-gradient);color:#fff;">
  <div style="max-width:800px;margin:0 auto;">
    <nav class="breadcrumb" aria-label="Breadcrumb" style="font-size:.85rem;margin-bottom:16px;">
      <a href="./" style="color:#7DD3FC;">Home</a> · <span style="color:rgba(255,255,255,.9);">FAQ</span>
    </nav>
    <h1 class="display" style="font-size:2.4rem;font-weight:800;margin-bottom:12px;">Aircon Service FAQ</h1>
    <p style="opacity:.9;line-height:1.7;">Common questions about cleaning, repair, booking, and service areas in Lipa &amp; Batangas.</p>
  </div>
</section>
<section style="padding:64px 24px;background:#fff;">
  <div style="max-width:760px;margin:0 auto;">
    {faq_html}
    {cta_block()}
    <p style="margin-top:32px;font-size:.9rem;color:var(--muted);">
      <a href="guides-aircon-batangas.html">Read our guides →</a> ·
      <a href="aircon-services-lipa-batangas.html">View services</a>
    </p>
  </div>
</section>
</main>
{FOOTER}
<script src="script.js"></script>
</body>
</html>"""


def article_page(article):
    sections_html = ""
    for heading, body in article["sections"]:
        sections_html += f"""<h2 class="display" style="font-size:1.25rem;margin:32px 0 12px;">{escape(heading)}</h2>
    <p style="color:var(--muted);line-height:1.75;margin-bottom:8px;">{escape(body)}</p>\n"""
    related = "".join(
        f'<li style="margin-bottom:8px;"><a href="{href}">{escape(label)}</a></li>'
        for href, label in article["related"]
    )
    svc_href, svc_label = article["service_link"]
    img = picture_img(article["image"], article["image_alt"], width=800, height=450)
    url = BASE + article["file"]

    return f"""<!DOCTYPE html>
<html lang="en-PH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{escape(article['meta'])}">
  <link rel="canonical" href="{url}">
  <title>{escape(article['title'])}</title>
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{escape(article['title'])}">
  <meta property="og:description" content="{escape(article['meta'])}">
  <meta property="og:image" content="{BASE}assets/{article['image']}">
  <meta property="og:locale" content="en_PH">
  {ld_script(article_graph(article))}
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="index.css">
  <link rel="icon" type="image/png" href="assets/coolpro_logo.png">
</head>
<body>
<div id="progress"></div>
{NAV}
<main>
<article style="padding:140px 24px 80px;background:var(--surface);">
  <div style="max-width:760px;margin:0 auto;">
    <nav class="breadcrumb" aria-label="Breadcrumb" style="font-size:.85rem;color:var(--muted);margin-bottom:16px;">
      <a href="./">Home</a> · <a href="{GUIDES_INDEX_FILE}">Guides</a> · <span aria-current="page">{escape(article['h1'][:50])}</span>
    </nav>
    <h1 class="display" style="font-size:clamp(1.8rem,4vw,2.4rem);font-weight:800;margin-bottom:20px;">{escape(article['h1'])}</h1>
    <div style="margin-bottom:28px;">{img}</div>
    {sections_html}
    <p style="margin-top:24px;"><a href="{svc_href}" class="pill">{escape(svc_label)}</a></p>
    <h2 class="display" style="font-size:1.1rem;margin:36px 0 12px;">Related reading</h2>
    <ul style="color:var(--muted);padding-left:20px;line-height:1.8;">{related}</ul>
    {cta_block()}
    <p style="margin-top:24px;font-size:.9rem;"><a href="{GUIDES_INDEX_FILE}">← All guides</a></p>
  </div>
</article>
</main>
{FOOTER}
<script src="script.js"></script>
</body>
</html>"""


def guides_index_page():
    cards = ""
    for a in ARTICLES:
        cards += f"""<article class="unit-card" style="padding:24px;">
      <h2 class="display" style="font-size:1.1rem;margin-bottom:8px;"><a href="{a['file']}" style="color:inherit;text-decoration:none;">{escape(a['h1'])}</a></h2>
      <p style="color:var(--muted);font-size:.88rem;margin-bottom:16px;">{escape(a['meta'][:140])}…</p>
      <a href="{a['file']}" class="pill">Read guide</a>
    </article>"""
    url = BASE + GUIDES_INDEX_FILE
    return f"""<!DOCTYPE html>
<html lang="en-PH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="CoolPro guides on aircon cleaning, troubleshooting, inverter maintenance, and refrigerant — for homeowners in Lipa and Batangas.">
  <link rel="canonical" href="{url}">
  <title>Aircon Guides Lipa Batangas | CoolPro</title>
  <meta property="og:url" content="{url}">
  <meta property="og:locale" content="en_PH">
  {ld_script(guides_index_graph())}
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="index.css">
  <link rel="icon" type="image/png" href="assets/coolpro_logo.png">
</head>
<body>
<div id="progress"></div>
{NAV}
<main>
<section style="padding:140px 24px 60px;background:var(--hero-gradient);color:#fff;text-align:center;">
  <div style="max-width:720px;margin:0 auto;">
    <h1 class="display" style="font-size:2.4rem;font-weight:800;margin-bottom:16px;">Aircon Guides &amp; Tips</h1>
    <p style="opacity:.9;">Practical advice for split-type and inverter AC in Batangas humidity.</p>
  </div>
</section>
<section style="padding:64px 24px;background:var(--surface);">
  <div style="max-width:1000px;margin:0 auto;">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-bottom:32px;">{cards}</div>
    <p style="text-align:center;color:var(--muted);">
      <a href="{FAQ_HUB_FILE}">Full FAQ</a> · <a href="aircon-services-lipa-batangas.html">Our services</a>
    </p>
  </div>
</section>
</main>
{FOOTER}
<script src="script.js"></script>
</body>
</html>"""


def write_sitemap_content(root: Path):
    files = [FAQ_HUB_FILE, GUIDES_INDEX_FILE] + [a["file"] for a in ARTICLES]
    urls = "".join(
        f'  <url><loc>{BASE}{f}</loc><lastmod>{LASTMOD}</lastmod><priority>0.65</priority></url>\n'
        for f in files
    )
    (root / "sitemap-content.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + urls
        + "</urlset>\n",
        encoding="utf-8",
    )


def main():
    root = Path(__file__).parent
    (root / FAQ_HUB_FILE).write_text(faq_hub_page(), encoding="utf-8")
    (root / GUIDES_INDEX_FILE).write_text(guides_index_page(), encoding="utf-8")
    for article in ARTICLES:
        (root / article["file"]).write_text(article_page(article), encoding="utf-8")
    write_sitemap_content(root)
    print(
        "generated FAQ hub, guides index,",
        len(ARTICLES),
        "articles, sitemap-content.xml",
    )


if __name__ == "__main__":
    main()
