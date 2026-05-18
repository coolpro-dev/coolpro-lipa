# -*- coding: utf-8 -*-
"""index.html is maintained directly (no prices on site). This script does not overwrite it."""
from pathlib import Path

index = Path(__file__).parent / "index.html"
if not index.is_file():
    raise SystemExit("index.html is missing")
text = index.read_text(encoding="utf-8")
if 'id="rates"' in text or 'id="pricing"' in text:
    raise SystemExit("index.html still contains a rates/pricing section")
print("index.html ok — not regenerated")
