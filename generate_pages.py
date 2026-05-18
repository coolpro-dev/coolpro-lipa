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
    for patch in (
        "patch_index_phase2.py",
        "patch_index_phase3.py",
        "patch_index_phase4.py",
    ):
        patch_path = ROOT / patch
        if patch_path.exists():
            subprocess.check_call([sys.executable, str(patch_path)], cwd=ROOT)
    print("CoolPro pages regenerated.")
    print("Note: index.html is patched by phase2–4 scripts; run patch_index.py for one-off SEO schema updates.")


if __name__ == "__main__":
    main()
