# -*- coding: utf-8 -*-
"""Create WebP copies of JPG assets and rebuild image-sitemap.xml."""
from datetime import date
from pathlib import Path

from content_data import ARTICLES, FAQ_HUB_FILE, GUIDES_INDEX_FILE
from gen_pages import SERVICES
from gen_towns import TOWN_HUBS, SERVICE_AREA_FILE
from seo_shared import BASE

LASTMOD = date.today().isoformat()
ASSETS = Path(__file__).parent / "assets"

# page_url -> list of (filename, title)
IMAGE_MAP = {
    BASE: [
        ("coolpro_logo.png", "CoolPro Air Solutions logo"),
        ("coolpro_job_1.jpg", "CoolPro aircon installation and cleaning Lipa Batangas"),
    ],
    BASE + "index.html": [
        ("coolpro_job_1.jpg", "CoolPro aircon service Lipa"),
        ("coolpro_job_2.jpg", "Split-type general cleaning Lipa"),
        ("coolpro_job_3.jpg", "Chemical cleaning window unit"),
        ("coolpro_job_4.jpg", "Outdoor AC installation"),
        ("coolpro_job_5.jpg", "CoolPro service team"),
        ("coolpro_job_6.jpg", "Aircon cleaning and installation"),
    ],
}

SERVICE_IMAGES = {
    "ac-general-cleaning-lipa-batangas.html": ("coolpro_job_2.jpg", "General cleaning split-type Lipa"),
    "ac-chemical-cleaning-lipa-batangas.html": ("coolpro_job_3.jpg", "Chemical cleaning window aircon"),
    "ac-repair-lipa-batangas.html": ("coolpro_job_1.jpg", "Aircon repair service Lipa Batangas"),
    "ac-installation-lipa-batangas.html": ("coolpro_job_4.jpg", "Outdoor aircon installation Lipa"),
    "ac-refrigerant-top-up-lipa-batangas.html": ("coolpro_job_4.jpg", "Refrigerant service outdoor unit"),
}

for s in SERVICES:
    if s["file"] in SERVICE_IMAGES:
        IMAGE_MAP[BASE + s["file"]] = [SERVICE_IMAGES[s["file"]]]

for a in ARTICLES:
    IMAGE_MAP[BASE + a["file"]] = [(a["image"], a["image_alt"])]

IMAGE_MAP[BASE + FAQ_HUB_FILE] = [("coolpro_job_2.jpg", "CoolPro aircon FAQ Lipa")]
IMAGE_MAP[BASE + GUIDES_INDEX_FILE] = [("coolpro_job_1.jpg", "CoolPro aircon guides Batangas")]
IMAGE_MAP[BASE + SERVICE_AREA_FILE] = [("coolpro_job_5.jpg", "CoolPro Batangas service areas")]

for t in TOWN_HUBS:
    IMAGE_MAP[BASE + t["file"]] = [("coolpro_job_2.jpg", f"Aircon services {t['name']} Batangas")]


def convert_jpg_to_webp():
    try:
        from PIL import Image
    except ImportError:
        print("Pillow not installed — skip WebP conversion (pip install Pillow)")
        return 0
    count = 0
    for jpg in ASSETS.glob("coolpro_job_*.jpg"):
        webp = jpg.with_suffix(".webp")
        img = Image.open(jpg)
        img.save(webp, "WEBP", quality=82, method=6)
        count += 1
        print("webp:", webp.name)
    return count


def image_loc(name: str) -> str:
    return BASE + "assets/" + name


def write_image_sitemap(root: Path):
    blocks = []
    for page_url, images in IMAGE_MAP.items():
        if not images:
            continue
        entries = ""
        for fname, title in images:
            entries += f"""    <image:image>
      <image:loc>{image_loc(fname)}</image:loc>
      <image:title>{title}</image:title>
    </image:image>
"""
            if fname.endswith(".jpg"):
                webp = fname.replace(".jpg", ".webp")
                if (ASSETS / webp).is_file():
                    entries += f"""    <image:image>
      <image:loc>{image_loc(webp)}</image:loc>
      <image:title>{title} (WebP)</image:title>
    </image:image>
"""
        blocks.append(
            f"  <url>\n    <loc>{page_url}</loc>\n    <lastmod>{LASTMOD}</lastmod>\n{entries}  </url>\n"
        )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
        + "".join(blocks)
        + "</urlset>\n"
    )
    (root / "image-sitemap.xml").write_text(xml, encoding="utf-8")


def main():
    root = Path(__file__).parent
    n = convert_jpg_to_webp()
    write_image_sitemap(root)
    print(f"image-sitemap.xml updated ({len(IMAGE_MAP)} pages, {n} webp files)")


if __name__ == "__main__":
    main()
