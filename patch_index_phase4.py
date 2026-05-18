# -*- coding: utf-8 -*-
"""Phase 4: async fonts, LCP preload, theme-color on homepage."""
from pathlib import Path

from seo_shared import FAVICON_LINK, HEAD_FONTS, STYLESHEET_LINK, THEME_META, head_lcp_preload

index_path = Path(__file__).parent / "index.html"
html = index_path.read_text(encoding="utf-8")

if 'name="theme-color"' not in html:
    new_head = f"""  {THEME_META}
  {head_lcp_preload()}
  {HEAD_FONTS}
  {STYLESHEET_LINK}
  {FAVICON_LINK}"""

    old_blocks = [
        """  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="index.css">
  <link rel="icon" type="image/png" href="assets/coolpro_logo.png">""",
        """  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="index.css">
  <link rel="icon" type="image/png" href="assets/coolpro_logo.png">""",
    ]
    for old in old_blocks:
        if old in html:
            html = html.replace(old, new_head)
            break

    index_path.write_text(html, encoding="utf-8")
    print("index.html phase 4 updated (fonts, LCP preload, theme-color)")
else:
    print("index.html already has phase 4 head — skipped")
