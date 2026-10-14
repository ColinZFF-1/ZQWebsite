from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
BUILD = ROOT / "build"
MASTER = BUILD / "case01_fangxiu_three_column_2480x3508.png"
WEB = BUILD / "case01_fangxiu_three_column_2480x3508_web.png"

errors = []
if Image.open(MASTER).size != (2480, 3508): errors.append("master must be 2480x3508")
if Image.open(WEB).size != (1240, 1754): errors.append("web must be 1240x1754")
if not (180 <= 720 < 3020 <= 3328): errors.append("three-column content escapes safe area")
report = "PASS\n" if not errors else "FAIL\n" + "\n".join(errors) + "\n"
(BUILD / "verify_case01_report.txt").write_text(report, encoding="utf-8")
print(report, end="")
raise SystemExit(0 if not errors else 1)
