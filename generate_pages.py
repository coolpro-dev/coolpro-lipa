#!/usr/bin/env python3
"""Regenerate CoolPro service pages. Run from project root: python generate_pages.py"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent


def main():
    for script in (
        "gen_index.py",
        "gen_pages.py",
        "gen_contact.py",
        "gen_towns.py",
        "gen_content.py",
        "gen_images.py",
    ):
        path = ROOT / script
        if not path.exists():
            print(f"Missing {script}", file=sys.stderr)
            sys.exit(1)
        subprocess.check_call([sys.executable, str(path)], cwd=ROOT)
    print("CoolPro pages regenerated.")
    print("Note: index.html is maintained separately; run patch_index.py after SEO config changes if needed.")


if __name__ == "__main__":
    main()
