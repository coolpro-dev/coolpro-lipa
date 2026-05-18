# -*- coding: utf-8 -*-
"""Apply Phase 1 SEO updates to index.html. Safe to re-run (skips existing blocks)."""
from pathlib import Path

from seo_shared import FOOTER, faq_details_html, ld_script, homepage_graph, service_area_section

index_path = Path(__file__).parent / "index.html"
html = index_path.read_text(encoding="utf-8")

schema = ld_script(homepage_graph())
extra_meta = """  <meta property="og:description" content="CoolPro aircon services in Lipa &amp; Batangas — cleaning, repair, installation, refrigerant top-up. Messenger, WhatsApp, or call 0948 512 1132.">
  <meta property="og:locale" content="en_PH">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
"""

if schema not in html:
    html = html.replace(
        '  <meta property="og:site_name" content="CoolPro - Air Solutions Aircon Services Lipa">\n',
        '  <meta property="og:site_name" content="CoolPro - Air Solutions Aircon Services Lipa">\n'
        + extra_meta
        + "  "
        + schema
        + "\n",
    )

html = html.replace('href="index.html" class="nav-logo"', 'href="./" class="nav-logo"')

if 'fetchpriority="high"' not in html:
    html = html.replace(
        '<img src="assets/coolpro_job_1.jpg" alt="CoolPro installation and chemical cleaning — split and window units" loading="lazy">',
        '<img src="assets/coolpro_job_1.jpg" alt="CoolPro aircon installation and cleaning — Lipa Batangas" width="800" height="500" fetchpriority="high" decoding="async">',
    )

area = service_area_section()
if 'id="service-area"' not in html:
    html = html.replace(
        '</section>\n<section id="why"',
        '</section>\n' + area + '\n<section id="why"',
    )

if "Frequently asked questions" not in html:
    faq_block = faq_details_html()
    start = html.find('<section id="faq"')
    if start != -1:
        end = html.find("</section>", start) + len("</section>")
        new_faq = f'''<section id="faq" class="reveal" style="padding:100px 24px;background:#fff;"><motion style="max-width:700px;margin:0 auto;">
  <h2 class="display" style="font-size:2rem;margin-bottom:24px;">Frequently asked questions</h2>
  {faq_block}
</motion></section>'''.replace("<motion ", "<motion ").replace("</motion>", "</motion>")
        new_faq = new_faq.replace("<motion ", "<div ").replace("</motion>", "</motion>")
        html = html[:start] + new_faq.replace("</motion>", "</motion>").replace("<motion ", "<div ").replace("</motion>", "</div>") + html[end:]

if 'class="site-footer"' not in html:
    html = html.replace(
        '<footer style="background:#000;padding:32px 24px;color:#64748B;text-align:center;font-size:.85rem;">© 2026 CoolPro - Air Solutions Aircon Services Lipa</footer>',
        FOOTER,
    )

index_path.write_text(html, encoding="utf-8")
print("index.html ok")
