"""Compose the first昭桥 case one-pager.

This is deliberately code-first: the first approved pass contains no AI raster
illustrations.  Background texture, structure, icons, copy, logo mark, and the
demo QR are generated deterministically so the file can be regenerated.
"""
from __future__ import annotations

import hashlib
import math
import os
import sys
import textwrap
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont

VENDOR = Path(__file__).resolve().parent / "vendor"
if VENDOR.exists():
    sys.path.insert(0, str(VENDOR))
try:
    import qrcode  # optional local dependency; a deterministic fallback is below
except Exception:
    qrcode = None


ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"
ASSETS = ROOT / "assets"
BUILD = ROOT / "build"
W, H = 2480, 3508
M = 180
CONTENT_R = W - M
SAFE_BOTTOM = H - M

PALETTE = {
    "paper": "#FAF9F5",
    "ink": "#161616",
    "muted": "#5E5E5E",
    "red": "#E4372E",
    "wood": "#8C5A3C",
    "olive": "#394936",
    "amber": "#F2B24A",
    "jade": "#82D8C0",
    "line": "#DEDAD2",
    "card": "#FFFEFB",
}

FONT = r"C:\Windows\Fonts\NotoSansSC-VF.ttf"
FONT_FALLBACK = r"C:\Windows\Fonts\simhei.ttf"


def font(size: int):
    path = FONT if os.path.exists(FONT) else FONT_FALLBACK
    f = ImageFont.truetype(path, size)
    # Noto Sans SC is a variable font in the bundled Windows environment. A
    # medium default keeps the large Chinese hierarchy legible in print while
    # leaving colour and weight decisions to the layout.
    if hasattr(f, "set_variation_by_axes"):
        try:
            f.set_variation_by_axes([500])
        except Exception:
            pass
    return f


def rgba(hex_color: str, alpha: int = 255):
    h = hex_color.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def rounded(draw: ImageDraw.ImageDraw, box, radius=24, fill=None, outline=None, width=2):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def wrap_lines(text: str, max_chars: int):
    lines = []
    for para in text.split("\n"):
        if not para:
            lines.append("")
            continue
        lines.extend(textwrap.wrap(para, width=max_chars, break_long_words=False, break_on_hyphens=False))
    return lines


def draw_text(draw, xy, text, size, fill, max_chars=None, line_gap=14, anchor=None, bold=False):
    f = font(size)
    if max_chars:
        lines = wrap_lines(text, max_chars)
        y = xy[1]
        for line in lines:
            draw.text((xy[0], y), line, font=f, fill=fill, anchor=anchor)
            y += size + line_gap
        return y
    draw.text(xy, text, font=f, fill=fill, anchor=anchor)
    return xy[1] + size


def make_base_background():
    im = Image.new("RGBA", (W, H), rgba(PALETTE["paper"]))
    px = im.load()
    # A barely visible warm vertical wash; no hard edge and no content.
    for y in range(H):
        t = y / H
        warm = int(2 * (1 - t))
        for x in range(W):
            if x < 1040:
                px[x, y] = (250, 249, 245, 255)
            else:
                px[x, y] = (250, 249, 245 + warm, 255)
    d = ImageDraw.Draw(im, "RGBA")
    # The background grid is intentionally subtle and never crosses as a seam.
    for x in range(0, W + 1, 120):
        d.line((x, 0, x, H), fill=(22, 22, 22, 9), width=1)
    for y in range(0, H + 1, 120):
        d.line((0, y, W, y), fill=(22, 22, 22, 9), width=1)
    return im


def make_top_band():
    band = Image.new("RGBA", (W, 900), (0, 0, 0, 0))
    d = ImageDraw.Draw(band, "RGBA")
    # Warm, low-contrast arcs match the sun-and-bridge mark.
    d.ellipse((1540, -540, 2840, 760), fill=(228, 55, 46, 18))
    d.ellipse((1780, -420, 2790, 560), fill=(242, 178, 74, 20))
    d.arc((1460, 30, 2500, 740), 178, 330, fill=(140, 90, 60, 35), width=5)
    d.arc((1210, 80, 2360, 800), 185, 326, fill=(57, 73, 54, 24), width=3)
    # Alpha fade at the lower edge, applied to the actual alpha channel.
    fade = Image.new("L", (W, 900), 255)
    fd = ImageDraw.Draw(fade)
    fade_px = 160
    for i in range(fade_px):
        y = 900 - fade_px + i
        fd.line((0, y, W, y), fill=int(255 * (1 - i / fade_px)))
    alpha = band.getchannel("A")
    band.putalpha(ImageChops.multiply(alpha, fade))
    return band


def draw_logo(draw, x, y, scale=1.0, include_tagline=True):
    # Compact vector recreation of the approved sun-and-bridge mark.
    red = rgba(PALETTE["red"])
    wood = rgba(PALETTE["wood"])
    ink = rgba(PALETTE["ink"])
    r = int(46 * scale)
    cx, cy = x + int(60 * scale), y + int(38 * scale)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=red)
    bx = x + int(10 * scale)
    by = y + int(106 * scale)
    draw.arc((bx, by - int(70 * scale), bx + int(160 * scale), by + int(76 * scale)), 190, 350, fill=wood, width=max(2, int(15 * scale)))
    draw.line((bx, by, bx + int(160 * scale), by), fill=ink, width=max(2, int(5 * scale)))
    draw.line((bx + int(26 * scale), by, bx + int(26 * scale), by + int(18 * scale)), fill=wood, width=max(2, int(10 * scale)))
    draw.line((bx + int(134 * scale), by, bx + int(134 * scale), by + int(18 * scale)), fill=wood, width=max(2, int(10 * scale)))
    draw.text((x + int(210 * scale), y + int(2 * scale)), "昭桥", font=font(int(48 * scale)), fill=ink)
    draw.text((x + int(212 * scale), y + int(62 * scale)), "ZHAOQIAO", font=font(int(14 * scale)), fill=wood)
    if include_tagline:
        draw.text((x + int(212 * scale), y + int(94 * scale)), "把 AI 落到现场", font=font(int(16 * scale)), fill=ink)


def finder(draw, x, y, cell, color):
    draw.rectangle((x, y, x + 7 * cell, y + 7 * cell), fill=color)
    draw.rectangle((x + cell, y + cell, x + 6 * cell, y + 6 * cell), fill=rgba(PALETTE["paper"]))
    draw.rectangle((x + 2 * cell, y + 2 * cell, x + 5 * cell, y + 5 * cell), fill=color)


def draw_demo_qr(draw, x, y, size=210):
    # The destination is intentionally a neutral example URL until a real CTA
    # is supplied. qrcode is vendored for a real, scannable demo code; the
    # deterministic matrix fallback keeps the build reproducible if the vendored
    # package is removed.
    demo_url = "https://example.com/zhaoqiao-demo"
    n, cell = 29, size // 29
    if qrcode is not None:
        qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=1, border=1)
        qr.add_data(demo_url)
        qr.make(fit=True)
        matrix = qr.get_matrix()
        n = len(matrix)
        cell = max(1, size // n)
        actual = n * cell
    else:
        matrix = None
        actual = n * cell
    draw.rectangle((x, y, x + actual, y + actual), fill=(255, 255, 255, 255), outline=rgba(PALETTE["line"]), width=2)
    if matrix is not None:
        for row, values in enumerate(matrix):
            for col, bit in enumerate(values):
                if bit:
                    draw.rectangle((x + col * cell, y + row * cell, x + (col + 1) * cell - 1, y + (row + 1) * cell - 1), fill=rgba(PALETTE["ink"]))
    else:
        seed = hashlib.sha256(demo_url.encode()).digest()
        finder(draw, x + cell, y + cell, cell, rgba(PALETTE["ink"]))
        finder(draw, x + (n - 8) * cell, y + cell, cell, rgba(PALETTE["ink"]))
        finder(draw, x + cell, y + (n - 8) * cell, cell, rgba(PALETTE["ink"]))
        for row in range(n):
            for col in range(n):
                if (col < 9 and row < 9) or (col >= n - 8 and row < 9) or (col < 9 and row >= n - 8):
                    continue
                bit = (seed[(row * n + col) % len(seed)] >> ((row + col) % 8)) & 1
                if bit:
                    draw.rectangle((x + col * cell, y + row * cell, x + (col + 1) * cell - 1, y + (row + 1) * cell - 1), fill=rgba(PALETTE["ink"]))
    return actual


def draw_icon(draw, cx, cy, kind, color=None, scale=1.0):
    color = color or rgba(PALETTE["wood"])
    w = max(3, int(6 * scale))
    if kind == "file":
        draw.rounded_rectangle((cx - 32 * scale, cy - 40 * scale, cx + 26 * scale, cy + 40 * scale), radius=int(8 * scale), outline=color, width=w)
        draw.line((cx + 8 * scale, cy - 40 * scale, cx + 8 * scale, cy - 20 * scale, cx + 26 * scale, cy - 20 * scale), fill=color, width=w)
        for off in (-10, 5, 20): draw.line((cx - 18 * scale, cy + off * scale, cx + 12 * scale, cy + off * scale), fill=color, width=max(2, int(4 * scale)))
    elif kind == "search":
        draw.ellipse((cx - 32 * scale, cy - 32 * scale, cx + 20 * scale, cy + 20 * scale), outline=color, width=w)
        draw.line((cx + 12 * scale, cy + 14 * scale, cx + 38 * scale, cy + 40 * scale), fill=color, width=w)
    elif kind == "flow":
        for dx, dy in [(-30, -28), (30, -28), (0, 30)]: draw.ellipse((cx + (dx - 13) * scale, cy + (dy - 13) * scale, cx + (dx + 13) * scale, cy + (dy + 13) * scale), outline=color, width=w)
        draw.line((cx - 18 * scale, cy - 18 * scale, cx - 5 * scale, cy + 16 * scale), fill=color, width=w)
        draw.line((cx + 18 * scale, cy - 18 * scale, cx + 5 * scale, cy + 16 * scale), fill=color, width=w)
    elif kind == "check":
        draw.line((cx - 34 * scale, cy + 4 * scale, cx - 8 * scale, cy + 30 * scale, cx + 40 * scale, cy - 28 * scale), fill=color, width=int(10 * scale), joint="curve")


def make_icon_sheet():
    sheet = Image.new("RGBA", (2048, 1536), (0, 0, 0, 0))
    d = ImageDraw.Draw(sheet)
    kinds = ["file", "search", "flow", "check", "file", "flow", "check", "search", "flow", "check", "file", "search"]
    for i, kind in enumerate(kinds):
        col, row = i % 4, i // 4
        draw_icon(d, col * 512 + 256, row * 512 + 250, kind, rgba(PALETTE["wood"]), 2.2)
    return sheet


def draw_section_label(draw, x, y, number, label, accent):
    draw.rounded_rectangle((x, y, x + 92, y + 38), radius=19, fill=accent)
    draw.text((x + 46, y + 19), number, font=font(20), fill=rgba(PALETTE["paper"]), anchor="mm")
    draw.text((x + 116, y + 19), label, font=font(26), fill=rgba(PALETTE["muted"]), anchor="lm")


def draw_bullet(draw, x, y, text, accent):
    draw.ellipse((x, y + 10, x + 16, y + 26), fill=accent)
    draw.text((x + 32, y), text, font=font(27), fill=rgba(PALETTE["ink"]))


def compose(out_path: Path):
    BUILD.mkdir(parents=True, exist_ok=True)
    RAW.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    base = make_base_background()
    base.save(RAW / "BG-01_base.png")
    top = make_top_band()
    top.save(RAW / "BG-02_topband.png")
    make_icon_sheet().save(RAW / "IC-SHEET_icons.png")
    canvas = base.copy()
    canvas.alpha_composite(top, (0, 0))
    d = ImageDraw.Draw(canvas, "RGBA")

    # Header: content stays inside the 180px safe margin.
    draw_logo(d, M, 92, 0.72, include_tagline=False)
    d.text((CONTENT_R, 135), "CASE STUDY 01  /  示例案例", font=font(22), fill=rgba(PALETTE["wood"]), anchor="ra")
    d.text((M, 300), "把 AI 接进企业营销内容流程", font=font(86), fill=rgba(PALETTE["ink"]))
    d.text((M, 418), "从零散素材到可复用的内容工作流", font=font(34), fill=rgba(PALETTE["muted"]))
    d.line((M, 535, CONTENT_R, 535), fill=rgba(PALETTE["red"]), width=5)
    d.text((M, 570), "场景：营销内容团队　｜　交付方式：场景共创 + 工作流落地　｜　不替客户编造增长数字", font=font(22), fill=rgba(PALETTE["muted"]))

    # Challenge card: 700–1360.
    rounded(d, (M, 700, CONTENT_R, 1360), 28, fill=rgba(PALETTE["card"]), outline=rgba(PALETTE["line"]), width=3)
    draw_section_label(d, M + 52, 754, "01", "先看卡点", rgba(PALETTE["red"]))
    d.text((M + 52, 850), "团队知道 AI 能帮忙，", font=font(46), fill=rgba(PALETTE["ink"]))
    d.text((M + 52, 914), "却还没有一条能跑通的工作流。", font=font(46), fill=rgba(PALETTE["ink"]))
    draw_bullet(d, M + 60, 1030, "素材散落在文档、会议与聊天里", rgba(PALETTE["red"]))
    draw_bullet(d, M + 60, 1100, "每次写作都从零开始，质量依赖个人", rgba(PALETTE["red"]))
    draw_bullet(d, M + 60, 1170, "经验留在个人手里，团队难以复用", rgba(PALETTE["red"]))
    # Right-side code-drawn visual: scattered inputs converge into one node.
    vx, vy = 1720, 1035
    for idx, (dx, dy, kind) in enumerate([(-240, -110, "file"), (-235, 40, "search"), (-230, 190, "file")]):
        draw_icon(d, vx + dx, vy + dy, kind, rgba(PALETTE["wood"]), 1.25)
        d.line((vx + dx + 55, vy + dy + 4, vx - 15, vy + 10), fill=rgba(PALETTE["line"]), width=4)
    d.ellipse((vx - 65, vy - 65, vx + 65, vy + 65), fill=rgba(PALETTE["amber"]), outline=rgba(PALETTE["ink"]), width=4)
    d.text((vx, vy), "AI", font=font(33), fill=rgba(PALETTE["ink"]), anchor="mm")
    d.line((vx + 75, vy + 10, vx + 210, vy + 10), fill=rgba(PALETTE["wood"]), width=5)
    draw_icon(d, vx + 270, vy + 10, "check", rgba(PALETTE["olive"]), 1.1)
    d.text((vx + 105, vy + 72), "统一入口", font=font(22), fill=rgba(PALETTE["muted"]))

    # Solution card: 1420–2240.
    rounded(d, (M, 1420, CONTENT_R, 2240), 28, fill=rgba(PALETTE["card"]), outline=rgba(PALETTE["line"]), width=3)
    draw_section_label(d, M + 52, 1474, "02", "再做连接", rgba(PALETTE["wood"]))
    d.text((M + 52, 1565), "围绕一个真实任务，跑通四步。", font=font(46), fill=rgba(PALETTE["ink"]))
    steps = [
        ("01", "梳理素材", "把分散信息\n整理成可用输入", PALETTE["red"]),
        ("02", "建立知识", "沉淀品牌、产品\n和客户语料", PALETTE["wood"]),
        ("03", "生成初稿", "让 AI 按岗位\n和标准协作", PALETTE["amber"]),
        ("04", "人工复核", "保留判断与责任\n再发布、再复盘", PALETTE["olive"]),
    ]
    start_x, card_y, card_w, card_h, gap = M + 52, 1700, 490, 290, 24
    for i, (num, title, copy, accent) in enumerate(steps):
        x = start_x + i * (card_w + gap)
        rounded(d, (x, card_y, x + card_w, card_y + card_h), 22, fill=rgba(PALETTE["paper"]), outline=rgba(PALETTE["line"]), width=2)
        d.ellipse((x + 28, card_y + 28, x + 92, card_y + 92), fill=rgba(accent))
        d.text((x + 60, card_y + 60), num, font=font(22), fill=rgba(PALETTE["paper"]), anchor="mm")
        d.text((x + 28, card_y + 126), title, font=font(31), fill=rgba(PALETTE["ink"]))
        draw_text(d, (x + 28, card_y + 182), copy, 23, rgba(PALETTE["muted"]), max_chars=14, line_gap=8)
    d.text((M + 52, 2070), "留下三类可继续使用的资产", font=font(25), fill=rgba(PALETTE["muted"]))
    tags = [("内容知识库", PALETTE["red"]), ("岗位工作流", PALETTE["wood"]), ("复盘模板", PALETTE["olive"])]
    tx = M + 52
    for label, accent in tags:
        tw = 225 if label != "岗位工作流" else 225
        rounded(d, (tx, 2120, tx + tw, 2182), 31, fill=rgba(accent, 28), outline=rgba(accent), width=2)
        d.text((tx + tw / 2, 2151), label, font=font(24), fill=rgba(accent), anchor="mm")
        tx += tw + 18

    # Value card: 2300–2860.
    rounded(d, (M, 2300, CONTENT_R, 2860), 28, fill=rgba(PALETTE["card"]), outline=rgba(PALETTE["line"]), width=3)
    draw_section_label(d, M + 52, 2354, "03", "交付价值", rgba(PALETTE["olive"]))
    d.text((M + 52, 2445), "把一次共创，变成团队可以继续使用的东西。", font=font(43), fill=rgba(PALETTE["ink"]))
    values = [
        ("01", "一套工作流", "从输入到发布，\n每一步都有标准", PALETTE["red"]),
        ("02", "一组内容资产", "品牌、产品与客户\n信息可被持续调用", PALETTE["wood"]),
        ("03", "一套协作方法", "人负责判断，AI\n负责加速与复盘", PALETTE["olive"]),
    ]
    vx0, vy0, vw, vh = M + 52, 2550, 650, 230
    for i, (num, title, copy, accent) in enumerate(values):
        x = vx0 + i * (vw + 34)
        rounded(d, (x, vy0, x + vw, vy0 + vh), 20, fill=rgba(accent, 18), outline=rgba(accent, 85), width=2)
        d.text((x + 26, vy0 + 28), num, font=font(48), fill=rgba(accent))
        d.text((x + 160, vy0 + 32), title, font=font(30), fill=rgba(PALETTE["ink"]))
        draw_text(d, (x + 160, vy0 + 94), copy, 23, rgba(PALETTE["muted"]), max_chars=14, line_gap=8)

    # Quote strip: 2920–3120.
    rounded(d, (M, 2920, CONTENT_R, 3120), 24, fill=rgba(PALETTE["ink"]), outline=rgba(PALETTE["ink"]), width=2)
    d.text((M + 54, 3020), "“", font=font(92), fill=rgba(PALETTE["amber"]), anchor="lm")
    d.text((M + 150, 3020), "先跑通一个真实场景，再把方法留给团队。", font=font(35), fill=rgba(PALETTE["paper"]), anchor="lm")
    d.text((CONTENT_R - 54, 3072), "昭桥｜把 AI 落到现场", font=font(20), fill=rgba(PALETTE["jade"]), anchor="ra")

    # Footer: 3168–3328, exactly respecting the 180px bottom safe margin.
    d.line((M, 3168, CONTENT_R, 3168), fill=rgba(PALETTE["line"]), width=2)
    draw_logo(d, M, 3190, 0.48, include_tagline=False)
    d.text((M + 230, 3270), "带一个真实营销任务来，做一次 AI 场景诊断", font=font(24), fill=rgba(PALETTE["ink"]))
    qr_size = draw_demo_qr(d, CONTENT_R - 230, 3183, 145)
    d.text((CONTENT_R - 260, 3330), "体验示例", font=font(17), fill=rgba(PALETTE["muted"]), anchor="ra")

    # Export master, web derivative, PDF, and a small contact sheet.
    # Pillow's RGBA drawing writes semi-transparent pixels with their alpha
    # intact; converting directly to RGB would discard that alpha and turn a
    # 9%-opacity grid line into solid black. Composite once over the paper
    # before exporting so the low-opacity layers remain genuinely subtle.
    paper = Image.new("RGBA", canvas.size, rgba(PALETTE["paper"]))
    rgb = Image.alpha_composite(paper, canvas).convert("RGB")
    rgb.save(out_path, "PNG", dpi=(300, 300), optimize=True)
    web = out_path.with_name(out_path.stem + "_web.png")
    rgb.resize((1240, 1754), Image.Resampling.LANCZOS).save(web, "PNG", optimize=True)
    pdf = out_path.with_suffix(".pdf")
    rgb.save(pdf, "PDF", resolution=300.0)
    # Contact sheet with master and web view for quick QA.
    sheet = Image.new("RGB", (1240, 1850), "white")
    thumb = rgb.resize((620, 877), Image.Resampling.LANCZOS)
    thumb_web = rgb.resize((620, 877), Image.Resampling.LANCZOS)
    sheet.paste(thumb, (0, 40))
    sheet.paste(thumb_web, (620, 40))
    sd = ImageDraw.Draw(sheet)
    sd.text((20, 12), "master", font=font(20), fill=PALETTE["ink"])
    sd.text((640, 12), "web 50%", font=font(20), fill=PALETTE["ink"])
    sheet.save(BUILD / "contact_sheet.png", "PNG", optimize=True)
    return out_path, web, pdf


if __name__ == "__main__":
    out = BUILD / "caseA_zhaoqiao_onepager_2480x3508.png"
    paths = compose(out)
    print("\n".join(str(p) for p in paths))
