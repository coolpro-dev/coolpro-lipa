# -*- coding: utf-8 -*-
"""Regenerate contact.html. Run: python gen_contact.py"""
from pathlib import Path

from seo_shared import (
    BASE,
    FOOTER,
    HEAD_COMMON,
    NAV,
    contact_page_graph,
    gbp_owner_panel,
    ld_script,
    service_area_section,
)

area = service_area_section().replace('class="reveal"', "")

HTML = f"""<!DOCTYPE html>
<html lang="en-PH">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Contact CoolPro Lipa for aircon cleaning, repair, and installation in Batangas. Messenger, WhatsApp, or call 0948 512 1132.">
  <link rel="canonical" href="{BASE}contact.html">
  <title>Contact | CoolPro Aircon Services Lipa</title>
  <meta property="og:url" content="{BASE}contact.html">
  <meta property="og:title" content="Contact | CoolPro Aircon Services Lipa">
  <meta property="og:locale" content="en_PH">
  {ld_script(contact_page_graph())}
  {HEAD_COMMON}
</head>
<body>
<div id="progress"></div>
{NAV}
<main>
<section style="padding:140px 24px 60px;background:var(--surface);">
  <div style="max-width:700px;margin:0 auto;text-align:center;">
    <nav class="breadcrumb" aria-label="Breadcrumb" style="font-size:.85rem;color:var(--muted);margin-bottom:16px;text-align:left;">
      <a href="./">Home</a> · <span aria-current="page">Contact</span>
    </nav>
    <h1 class="display" style="font-size:2.5rem;font-weight:800;margin-bottom:16px;">Contact CoolPro</h1>
    <p style="color:var(--muted);margin-bottom:40px;">Aircon cleaning, repair, installation &amp; refrigerant service — Lipa City &amp; Batangas Province.</p>
    <div style="background:#fff;border-radius:24px;padding:40px;box-shadow:var(--card-shadow);text-align:left;">
      <img src="assets/coolpro_logo.png" alt="CoolPro Air Solutions Lipa Batangas" width="120" height="120" style="width:120px;height:auto;margin:0 auto 24px;display:block;object-fit:contain;">
      <p style="margin-bottom:20px;"><strong>Messenger:</strong> <a href="https://m.me/coolproairconlipa" target="_blank" rel="noopener">m.me/coolproairconlipa</a></p>
      <p style="margin-bottom:20px;"><strong>WhatsApp:</strong> <a href="https://wa.me/639485121132" target="_blank" rel="noopener">0948 512 1132</a></p>
      <p style="margin-bottom:20px;"><strong>Phone:</strong> <a href="tel:+639485121132">0948 512 1132</a></p>
      <p style="margin-bottom:20px;"><strong>Facebook:</strong> <a href="https://www.facebook.com/share/1Dh5ZkH4kk/" target="_blank" rel="noopener">CoolPro on Facebook</a></p>
      <p style="margin-bottom:28px;"><strong>Map:</strong> <a href="https://maps.google.com/?q=Lipa+City+Batangas+Philippines" target="_blank" rel="noopener">Open Lipa City area in Google Maps</a></p>
      <a href="https://m.me/coolproairconlipa" class="pill pill-blue" style="width:100%;margin-bottom:12px;display:block;text-align:center;" target="_blank" rel="noopener">Open Messenger</a>
      <a href="https://wa.me/639485121132" class="pill pill-whatsapp" style="width:100%;display:block;text-align:center;" target="_blank" rel="noopener">Open WhatsApp</a>
    </div>
  </div>
</section>
{area}
<section style="padding:0 24px 80px;background:var(--surface);">
  <div style="max-width:700px;margin:0 auto;">
    <iframe title="CoolPro service area — Lipa City Batangas" src="https://maps.google.com/maps?q=Lipa+City,Batangas,Philippines&amp;z=12&amp;output=embed" width="100%" height="300" style="border:0;border-radius:12px" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
  </div>
</section>
{gbp_owner_panel()}
</main>
{FOOTER}
<script src="script.js"></script>
</body>
</html>"""

if __name__ == "__main__":
    Path(__file__).parent.joinpath("contact.html").write_text(HTML, encoding="utf-8")
    print("contact.html generated")
