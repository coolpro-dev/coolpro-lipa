# -*- coding: utf-8 -*-
"""index.html is maintained directly (no prices on site). This script does not overwrite it."""
from pathlib import Path

index = Path(__file__).parent / "index.html"
if not index.is_file():
    raise SystemExit("index.html is missing")
text = index.read_text(encoding="utf-8")
if "₱" in text or 'id="rates"' in text:
    raise SystemExit("index.html still contains prices or a rates section")
print("index.html ok — not regenerated")
