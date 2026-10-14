from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
BUILD = ROOT / "build"
MASTER = BUILD / "case01_fangxiu_complete_landscape_2560x1440.png"
WEB = BUILD / "case01_fangxiu_complete_landscape_2560x1440_web.png"
errors = []
if Image.open(MASTER).size != (2560, 1440): errors.append("master must be 2560x1440")
if Image.open(WEB).size != (1280, 720): errors.append("web must be 1280x720")
report = "PASS\n" if not errors else "FAIL\n" + "\n".join(errors) + "\n"
(BUILD / "verify_case01_complete_report.txt").write_text(report, encoding="utf-8")
print(report, end="")
raise SystemExit(0 if not errors else 1)
