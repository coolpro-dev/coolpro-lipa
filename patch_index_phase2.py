# -*- coding: utf-8 -*-
"""Refresh homepage service-area block for Phase 2 town links."""
from pathlib import Path

from seo_shared import service_area_section

index_path = Path(__file__).parent / "index.html"
html = index_path.read_text(encoding="utf-8")
area = service_area_section()

start = html.find('<section id="service-area"')
if start == -1:
    raise SystemExit("service-area section not found")
end = html.find("</section>", start) + len("</section>")
html = html[:start] + area + html[end:]
index_path.write_text(html, encoding="utf-8")
print("index.html service-area updated")
