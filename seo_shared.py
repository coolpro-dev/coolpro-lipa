# -*- coding: utf-8 -*-
"""Shared local SEO constants and JSON-LD builders for CoolPro static site."""
import json
from html import escape

BASE = "https://coolpro-dev.github.io/coolpro-lipa/"
BUSINESS_ID = BASE + "#business"
WEBSITE_ID = BASE + "#website"

PHONE = "+639485121132"
BUSINESS_NAME = "CoolPro - Air Solutions Aircon Services Lipa"
SHORT_NAME = "CoolPro Lipa"

AREAS = [
    "Lipa City",
    "Tanauan",
    "Santo Tomas",
    "Malvar",
    "Mataasnakahoy",
    "Talisay",
    "Batangas City",
    "Rosario",
    "San Jose",
    "Ibaan",
    "Cuenca",
    "Balete",
    "Padre Garcia",
]

FAQ_ITEMS = [
    {
        "q": "What areas do you serve?",
        "a": "We dispatch from Lipa City to Tanauan, Santo Tomas, Malvar, Mataasnakahoy, Talisay, Batangas City, Rosario, San Jose, Ibaan, Cuenca, Balete, Padre Garcia, and nearby Batangas towns.",
    },
    {
        "q": "How do I book aircon service?",
        "a": "Message us on Messenger or WhatsApp with your AC type, HP, issue, and barangay. We confirm scope and schedule before your visit. You can also call 0948 512 1132.",
    },
    {
        "q": "What is the difference between general and chemical cleaning?",
        "a": "General cleaning covers filters, coils, drain line, and exterior wash — ideal every 3–6 months. Chemical cleaning is a deeper flush when there is mold, odor, weak cooling, or heavy buildup.",
    },
    {
        "q": "Do you service split-type, window, and inverter AC?",
        "a": "Yes. We work on split-type, window, floor-standing, and inverter units for homes and small commercial sites in Batangas.",
    },
    {
        "q": "Do you service Tanauan, Santo Tomas, and Malvar?",
        "a": "Yes. We regularly visit Tanauan, Santo Tomas, Malvar, and other towns near Lipa. Send your location on Messenger so we can confirm schedule.",
    },
    {
        "q": "My aircon is not cooling — can you repair it?",
        "a": "Yes. We troubleshoot not cooling, leaks, noise, and units that won't start. Parts and labor are quoted on-site before work proceeds.",
    },
    {
        "q": "Do you install new aircon units?",
        "a": "Yes. We provide split-type installation and relocation labor in Lipa and Batangas. The AC unit is typically purchased separately unless we arrange otherwise.",
    },
    {
        "q": "How often should I clean my aircon in the Philippines?",
        "a": "For most home units in humid Batangas weather, general cleaning every 3–6 months helps airflow and cooling. Chemical cleaning is only when buildup or odor persists.",
    },
    {
        "q": "Do you offer refrigerant top-up?",
        "a": "Yes, after a pressure check and leak inspection when applicable. We use R410A or R32 depending on your unit label.",
    },
    {
        "q": "How do I get a quote?",
        "a": "Message us on Messenger with your service needed, AC type, HP, and location. We confirm pricing and scope before dispatch — no surprise charges for agreed work.",
    },
]


def areas_served_schema():
    entities = [{"@type": "City", "name": city} for city in AREAS]
    entities.append({"@type": "AdministrativeArea", "name": "Batangas Province"})
    return entities


def business_node():
    return {
        "@type": ["LocalBusiness", "HVACBusiness"],
        "@id": BUSINESS_ID,
        "name": BUSINESS_NAME,
        "alternateName": SHORT_NAME,
        "url": BASE,
        "telephone": PHONE,
        "image": [
            BASE + "assets/coolpro_logo.png",
            BASE + "assets/coolpro_job_1.jpg",
        ],
        "logo": BASE + "assets/coolpro_logo.png",
        "description": (
            "Aircon general and chemical cleaning, repair, installation, "
            "and refrigerant top-up serving Lipa City and Batangas Province."
        ),
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lipa City",
            "addressRegion": "Batangas",
            "addressCountry": "PH",
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 13.9411,
            "longitude": 121.1631,
        },
        "areaServed": areas_served_schema(),
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
                "opens": "08:00",
                "closes": "18:00",
            }
        ],
        "sameAs": [
            "https://www.facebook.com/share/1Dh5ZkH4kk/",
            "https://m.me/coolproairconlipa",
        ],
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": PHONE,
                "contactType": "customer service",
                "areaServed": "PH",
                "availableLanguage": ["en", "fil"],
            }
        ],
        "priceRange": "₱₱",
        "hasMap": "https://maps.google.com/?q=Lipa+City+Batangas+Philippines",
    }


def website_node():
    return {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        "url": BASE,
        "name": BUSINESS_NAME,
        "publisher": {"@id": BUSINESS_ID},
        "inLanguage": "en-PH",
    }


def faq_page_node():
    return {
        "@type": "FAQPage",
        "@id": BASE + "#faq",
        "mainEntity": [
            {
                "@type": "Question",
                "name": item["q"],
                "acceptedAnswer": {"@type": "Answer", "text": item["a"]},
            }
            for item in FAQ_ITEMS
        ],
    }


def homepage_graph():
    return {
        "@context": "https://schema.org",
        "@graph": [website_node(), business_node(), faq_page_node()],
    }


def service_schema(service_name, description, service_type, page_url):
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": service_name,
                "description": description,
                "serviceType": service_type,
                "url": page_url,
                "provider": {"@id": BUSINESS_ID},
                "areaServed": areas_served_schema(),
                "availableChannel": {
                    "@type": "ServiceChannel",
                    "serviceUrl": "https://m.me/coolproairconlipa",
                    "servicePhone": PHONE,
                },
            },
            breadcrumb_schema(
                [
                    ("Home", BASE),
                    ("Services", BASE + "aircon-services-lipa-batangas.html"),
                    (service_name.split(" in ")[0], page_url),
                ]
            ),
        ],
    }


def breadcrumb_schema(items):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i + 1,
                "name": name,
                "item": url,
            }
            for i, (name, url) in enumerate(items)
        ],
    }


def hub_page_graph():
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "name": "Aircon Services in Lipa Batangas",
                "url": BASE + "aircon-services-lipa-batangas.html",
                "about": {"@id": BUSINESS_ID},
                "isPartOf": {"@id": WEBSITE_ID},
            },
            breadcrumb_schema(
                [
                    ("Home", BASE),
                    ("Services", BASE + "aircon-services-lipa-batangas.html"),
                ]
            ),
        ],
    }


def contact_page_graph():
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ContactPage",
                "name": "Contact CoolPro Lipa",
                "url": BASE + "contact.html",
                "about": {"@id": BUSINESS_ID},
            },
            breadcrumb_schema(
                [
                    ("Home", BASE),
                    ("Contact", BASE + "contact.html"),
                ]
            ),
        ],
    }


def ld_script(data):
    return (
        '<script type="application/ld+json">'
        + json.dumps(data, ensure_ascii=False)
        + "</script>"
    )


# --- Phase 4: performance + shared <head> fragments ---
THEME_COLOR = "#0c4a6e"
FONT_CSS = (
    "https://fonts.googleapis.com/css2?"
    "family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap"
)

HEAD_FONTS = f"""<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONT_CSS}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="{FONT_CSS}"></noscript>"""

FAVICON_LINK = '<link rel="icon" type="image/png" href="assets/coolpro_logo.png">'
STYLESHEET_LINK = '<link rel="stylesheet" href="index.css">'
THEME_META = f'<meta name="theme-color" content="{THEME_COLOR}">'
HEAD_COMMON = f"""{THEME_META}
{HEAD_FONTS}
{STYLESHEET_LINK}
{FAVICON_LINK}"""


def head_lcp_preload(webp: str = "assets/coolpro_job_1.webp"):
    return f'<link rel="preload" as="image" type="image/webp" href="{webp}">'


def picture_img(jpg: str, alt: str, width: int = 800, height: int = 500, lazy: bool = True, priority: bool = False):
    """Responsive image with WebP source when assets/coolpro_job_N.webp exists."""
    webp = jpg.replace(".jpg", ".webp")
    lazy_attr = "" if priority else ' loading="lazy"'
    fp = ' fetchpriority="high"' if priority else ""
    return (
        f'<picture class="content-picture">'
        f'<source type="image/webp" srcset="assets/{webp}">'
        f'<img src="assets/{jpg}" alt="{escape(alt)}" width="{width}" height="{height}" '
        f'decoding="async" style="width:100%;border-radius:12px;object-fit:cover;"'
        f"{lazy_attr}{fp}>"
        f"</picture>"
    )


def faq_details_html(items=None):
    blocks = []
    for item in items or FAQ_ITEMS:
        blocks.append(
            f'<details style="padding:16px 0;border-bottom:1px solid #E2E8F0;">'
            f"<summary>{escape(item['q'])}</summary>"
            f'<p style="color:var(--muted);margin-top:8px;">{escape(item["a"])}</p>'
            f"</details>"
        )
    return "\n  ".join(blocks)


TOWN_HUB_LINKS = [
    ("Tanauan", "aircon-services-tanauan-batangas.html"),
    ("Santo Tomas", "aircon-services-santo-tomas-batangas.html"),
    ("Malvar", "aircon-services-malvar-batangas.html"),
    ("Mataasnakahoy", "aircon-services-mataasnakahoy-batangas.html"),
    ("Talisay", "aircon-services-talisay-batangas.html"),
]


def town_hub_links_html():
    return "".join(
        f'<a href="{href}" style="display:inline-block;margin:6px 10px 6px 0;padding:10px 16px;border:1px solid #E2E8F0;border-radius:10px;font-size:.9rem;font-weight:500;text-decoration:none;color:var(--brand-dark);">{name}</a>'
        for name, href in TOWN_HUB_LINKS
    )


def service_area_section():
    other_towns = ", ".join(c for c in AREAS if c != "Lipa City")
    chips = town_hub_links_html()
    return f'''<section id="service-area" class="reveal" style="padding:80px 24px;background:#fff;">
  <div style="max-width:900px;margin:0 auto;">
    <h2 class="display" style="font-size:1.75rem;font-weight:700;margin-bottom:16px;">Service area — Lipa &amp; Batangas</h2>
    <p style="color:var(--muted);line-height:1.75;margin-bottom:20px;">CoolPro dispatches aircon technicians from <strong>Lipa City</strong> to {other_towns}, and nearby Batangas barangays.</p>
    <p style="margin-bottom:12px;font-size:.9rem;font-weight:600;color:var(--ink);">Town service pages</p>
    <div style="margin-bottom:20px;">{chips}</div>
    <p style="color:var(--muted);line-height:1.75;margin-bottom:8px;"><a href="service-area-batangas.html">View all Batangas service areas →</a></p>
    <p style="color:var(--muted);line-height:1.75;">Not sure if we cover your location? <a href="contact.html">Contact us</a> or <a href="https://m.me/coolproairconlipa" target="_blank" rel="noopener">message on Messenger</a> with your pin or nearest landmark.</p>
  </div>
</section>'''


FOOTER = '''<footer class="site-footer" style="background:#000;padding:40px 24px;color:#94A3B8;font-size:.85rem;">
  <div style="max-width:1200px;margin:0 auto;">
    <nav aria-label="Footer" style="display:flex;flex-wrap:wrap;gap:12px 20px;justify-content:center;margin-bottom:20px;">
      <a href="./" style="color:#E2E8F0;">Home</a>
      <a href="aircon-services-lipa-batangas.html" style="color:#E2E8F0;">All services</a>
      <a href="service-area-batangas.html" style="color:#E2E8F0;">Service areas</a>
      <a href="faq-aircon-lipa-batangas.html" style="color:#E2E8F0;">FAQ</a>
      <a href="guides-aircon-batangas.html" style="color:#E2E8F0;">Guides</a>
      <a href="ac-general-cleaning-lipa-batangas.html" style="color:#E2E8F0;">General cleaning</a>
      <a href="ac-chemical-cleaning-lipa-batangas.html" style="color:#E2E8F0;">Chemical cleaning</a>
      <a href="ac-repair-lipa-batangas.html" style="color:#E2E8F0;">Repair</a>
      <a href="ac-installation-lipa-batangas.html" style="color:#E2E8F0;">Installation</a>
      <a href="ac-refrigerant-top-up-lipa-batangas.html" style="color:#E2E8F0;">Refrigerant top-up</a>
      <a href="contact.html" style="color:#E2E8F0;">Contact</a>
    </nav>
    <p class="footer-nap" style="text-align:center;margin-bottom:8px;font-size:.84rem;color:#94A3B8;">
      <strong style="color:#fff;">{name}</strong><br>
      Lipa City, Batangas, Philippines ·
      <a href="tel:+639485121132" style="color:#7DD3FC;">0948 512 1132</a> ·
      <a href="https://m.me/coolproairconlipa" style="color:#7DD3FC;" target="_blank" rel="noopener">Messenger</a>
    </p>
    <p style="text-align:center;color:#64748B;font-size:.8rem;">
      <a href="sitemap-index.xml" style="color:#64748B;">Sitemap</a> · © 2026 {name}
    </p>
  </div>
</footer>
<a href="https://m.me/coolproairconlipa" target="_blank" class="fab" rel="noopener" title="Messenger"><svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.452 5.506 3.732 7.205V22l3.405-1.869C10.012 20.371 10.992 20.5 12 20.5c5.523 0 10-4.145 10-9.257S17.523 2 12 2z"/></svg></a>'''.format(
    name=BUSINESS_NAME
)


NAV = '''<nav class="navbar" aria-label="Primary">
  <a href="./" class="nav-logo"><img src="assets/coolpro_logo.png" alt="CoolPro Air Solutions" width="44" height="44" style="object-fit:contain;"><span class="display" style="font-weight:700;">CoolPro Lipa</span></a>
  <ul class="nav-links">
    <li><a href="./#services">Services</a></li>
    <li><a href="aircon-services-lipa-batangas.html">All Services</a></li>
    <li><a href="guides-aircon-batangas.html">Guides</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
  <a href="https://m.me/coolproairconlipa" class="btn btn-primary nav-cta" target="_blank" rel="noopener">Book on Messenger</a>
  <button class="nav-toggle" aria-label="Toggle menu">&#9776;</button>
</nav>
<div class="mobile-menu"><ul>
  <li><a href="./#services">Services</a></li>
  <li><a href="aircon-services-lipa-batangas.html">All Services</a></li>
  <li><a href="guides-aircon-batangas.html">Guides</a></li>
  <li><a href="contact.html">Contact</a></li>
  <li><a href="https://m.me/coolproairconlipa" target="_blank" rel="noopener">Messenger</a></li>
</ul></div>'''


def gbp_owner_panel():
    """NAP consistency + GBP checklist for Maps / Search alignment."""
    return f'''<section class="gbp-panel" style="padding:48px 24px;background:#fff;border-top:1px solid #E2E8F0;">
  <div style="max-width:700px;margin:0 auto;">
    <h2 class="display" style="font-size:1.25rem;margin-bottom:12px;">Find CoolPro online</h2>
    <p style="color:var(--muted);font-size:.95rem;line-height:1.7;margin-bottom:20px;">
      Use the same business name and phone on your website, Google Business Profile, Facebook, and Messenger.
    </p>
    <div style="background:var(--surface);border-radius:12px;padding:20px;font-size:.9rem;line-height:1.8;color:var(--ink);">
      <p><strong>Business name:</strong> {BUSINESS_NAME}</p>
      <p><strong>Phone:</strong> <a href="tel:+639485121132">0948 512 1132</a></p>
      <p><strong>Website:</strong> <a href="{BASE}">{BASE.rstrip("/")}</a></p>
      <p><strong>Service areas:</strong> Lipa City, Tanauan, Santo Tomas, Malvar, and Batangas Province</p>
      <p><strong>Services:</strong> Aircon cleaning, repair, installation, refrigerant top-up</p>
    </div>
    <details style="margin-top:20px;">
      <summary style="font-weight:600;cursor:pointer;color:var(--brand-dark);">Google Business Profile checklist</summary>
      <ul style="color:var(--muted);margin-top:12px;padding-left:20px;line-height:1.75;font-size:.9rem;">
        <li>Primary category: Air conditioning contractor</li>
        <li>List all services matching <a href="aircon-services-lipa-batangas.html">our services page</a></li>
        <li>Service areas: same as <a href="service-area-batangas.html">service areas</a></li>
        <li>Website field: this site homepage URL</li>
        <li>Weekly posts with job photos; link to <a href="guides-aircon-batangas.html">guides</a></li>
        <li>Request genuine Google reviews after completed jobs</li>
        <li>GBP Q&amp;A: mirror <a href="faq-aircon-lipa-batangas.html">FAQ</a> answers</li>
      </ul>
    </details>
  </div>
</section>'''
