# -*- coding: utf-8 -*-
"""Add guides section and WebP gallery to homepage."""
from pathlib import Path

from content_data import ARTICLES, FAQ_HUB_ALL, FAQ_HUB_FILE, GUIDES_INDEX_FILE
from seo_shared import picture_img

index_path = Path(__file__).parent / "index.html"
html = index_path.read_text(encoding="utf-8")

guides_section = f'''<section id="guides" class="reveal" style="padding:80px 24px;background:var(--surface);">
  <div style="max-width:1000px;margin:0 auto;">
    <h2 class="display" style="font-size:1.75rem;font-weight:700;margin-bottom:8px;">Guides &amp; helpful articles</h2>
    <p style="color:var(--muted);margin-bottom:28px;">Practical aircon tips for Batangas homeowners — or read the <a href="{FAQ_HUB_FILE}">full FAQ</a>.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">'''

for a in ARTICLES[:3]:
    guides_section += f'''
      <article style="background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
        <h3 class="display" style="font-size:1rem;margin-bottom:8px;"><a href="{a['file']}">{a['h1']}</a></h3>
        <p style="color:var(--muted);font-size:.88rem;margin-bottom:12px;">{a['meta'][:100]}…</p>
        <a href="{a['file']}" class="pill">Read</a>
      </article>'''

guides_section += f'''
    </div>
    <p style="margin-top:24px;text-align:center;"><a href="{GUIDES_INDEX_FILE}" style="font-weight:600;">View all guides →</a></p>
  </div>
</section>'''

if 'id="guides"' not in html:
    html = html.replace(
        '<section id="why"',
        guides_section + '\n<section id="why"',
    )

# WebP picture for proof gallery first image
old_first = '<img src="assets/coolpro_job_1.jpg" alt="CoolPro aircon installation and cleaning — Lipa Batangas" width="800" height="500" fetchpriority="high" decoding="async">'
new_first = picture_img(
    "coolpro_job_1.jpg",
    "CoolPro aircon installation and cleaning — Lipa Batangas",
    width=800,
    height=500,
    lazy=False,
    priority=True,
)
if old_first in html:
    html = html.replace(old_first, new_first)

# Other gallery images with picture + lazy
for i, (jpg, alt) in enumerate(
    [
        ("coolpro_job_2.jpg", "CoolPro split-type general cleaning — Lipa Batangas"),
        ("coolpro_job_3.jpg", "Window aircon chemical cleaning — CoolPro"),
        ("coolpro_job_4.jpg", "CoolPro technician outdoor AC installation"),
        ("coolpro_job_5.jpg", "CoolPro aircon service team on commercial site"),
        ("coolpro_job_6.jpg", "CoolPro aircon cleaning and installation services"),
    ],
    start=2,
):
    old = f'<img src="assets/{jpg}" alt="{alt}" loading="lazy">'
    if old in html:
        html = html.replace(old, picture_img(jpg, alt, width=600, height=400))

# FAQ section link to full hub
if FAQ_HUB_FILE not in html:
    html = html.replace(
        '<h2 class="display" style="font-size:2rem;margin-bottom:24px;">Frequently asked questions</h2>',
        '<h2 class="display" style="font-size:2rem;margin-bottom:24px;">Frequently asked questions</h2>\n'
        f'  <p style="color:var(--muted);margin-bottom:20px;font-size:.95rem;">Top questions below. <a href="{FAQ_HUB_FILE}">See all {len(FAQ_HUB_ALL)} FAQs →</a></p>',
    )

index_path.write_text(html, encoding="utf-8")
print("index.html phase 3 updated")
