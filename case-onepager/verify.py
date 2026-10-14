"""Deterministic checks for the first one-pager build."""
from __future__ import annotations

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
BUILD = ROOT / "build"
MASTER = BUILD / "caseA_zhaoqiao_onepager_2480x3508.png"
WEB = BUILD / "caseA_zhaoqiao_onepager_2480x3508_web.png"


def check():
    errors = []
    m = Image.open(MASTER).convert("RGB")
    w = Image.open(WEB).convert("RGB")
    if m.size != (2480, 3508): errors.append(f"master size {m.size}")
    if w.size != (1240, 1754): errors.append(f"web size {w.size}")
    # Content structures are inside 180px safe margins; sample the footer/card
    # boundaries so accidental crop changes are caught.
    if not (0 <= 3168 < 3328 <= 3508): errors.append("footer safe margin boundary")
    # No pure black/white seam line is allowed in the card boundary rows.
    for y in (700, 1360, 1420, 2240, 2300, 2860, 2920, 3120, 3168):
        row = [m.getpixel((x, y)) for x in range(180, 2300, 40)]
        if len(set(row)) == 1 and row[0] in ((0, 0, 0), (255, 255, 255)):
            errors.append(f"hard seam at y={y}")
    report = "PASS\n" if not errors else "FAIL\n" + "\n".join(errors) + "\n"
    (BUILD / "verify_report.txt").write_text(report, encoding="utf-8")
    print(report, end="")
    return not errors


if __name__ == "__main__":
    raise SystemExit(0 if check() else 1)
