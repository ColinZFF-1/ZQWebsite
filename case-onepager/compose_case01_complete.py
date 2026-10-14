"""Compose a complete landscape case page around the approved architecture SVG."""
from __future__ import annotations

from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
from compose import PALETTE, draw_logo, font, rgba, rounded  # noqa: E402

W, H = 2560, 1440
M = 60
BG = ROOT / "assets" / "fangxiu-background.png"
ARCH = ROOT / "build" / "fangxiu_architecture_infographic.png"
BUILD = ROOT / "build"
OUT = BUILD / "case01_fangxiu_complete_landscape_2560x1440.png"


def wrap(draw, x, y, text, size, color, width, leading=8):
    f = font(size)
    current, lines = "", []
    for ch in text:
        if draw.textbbox((0, 0), current + ch, font=f)[2] > width and current:
            lines.append(current)
            current = ch
        else:
            current += ch
    if current:
        lines.append(current)
    for line in lines:
        draw.text((x, y), line, font=f, fill=color)
        y += size + leading
    return y


def badge(draw, x, y, number, label, accent):
    rounded(draw, (x, y, x + 64, y + 32), 16, fill=accent)
    draw.text((x + 32, y + 16), number, font=font(16), fill=rgba(PALETTE["paper"]), anchor="mm")
    draw.text((x + 80, y + 16), label, font=font(24), fill=rgba(PALETTE["muted"]), anchor="lm")


def bullet(draw, x, y, text, accent, width):
    draw.ellipse((x, y + 11, x + 14, y + 25), fill=accent)
    return wrap(draw, x + 28, y, text, 22, rgba(PALETTE["ink"]), width, 6) + 12


def section_card(draw, box, fill=(255, 254, 251, 238)):
    rounded(draw, box, 24, fill=fill, outline=(222, 218, 210, 235), width=3)


def compose():
    BUILD.mkdir(exist_ok=True)
    bg = ImageOps.fit(Image.open(BG).convert("RGBA"), (W, H), method=Image.Resampling.LANCZOS, centering=(0.62, 0.48))
    veil = Image.new("RGBA", (W, H), (250, 249, 245, 190))
    canvas = Image.alpha_composite(bg, veil)
    d = ImageDraw.Draw(canvas, "RGBA")

    # Header.
    draw_logo(d, M, 30, 0.60, include_tagline=False)
    d.text((W - M, 62), "昭桥案例 / 物业维修智能体", font=font(21), fill=rgba(PALETTE["wood"]), anchor="ra")
    d.text((M, 132), "房修小匠｜从平台机器人到企业维修系统", font=font(66), fill=rgba(PALETTE["ink"]))
    d.text((M, 208), "把维修经验、规范和企业文档，组织成可检索、可判断、可追溯的交付系统", font=font(27), fill=rgba(PALETTE["muted"]))
    d.text((W - M, 208), "迁移背景：Coze 平台 → 私有化自研", font=font(21), fill=rgba(PALETTE["wood"]), anchor="ra")
    d.line((M, 256, W - M, 256), fill=rgba(PALETTE["red"]), width=5)

    # Three-column body.
    body_top, body_bottom, gap = 300, 1225, 24
    left_x, left_w = M, 560
    center_x, center_w = left_x + left_w + gap, 1240
    right_x, right_w = center_x + center_w + gap, 560
    section_card(d, (left_x, body_top, left_x + left_w, body_bottom))
    section_card(d, (center_x, body_top, center_x + center_w, body_bottom), fill=(250, 249, 245, 248))
    section_card(d, (right_x, body_top, right_x + right_w, body_bottom))

    # Left: problem and migration decision.
    x, y = left_x + 34, body_top + 32
    badge(d, x, y, "01", "项目起点", rgba(PALETTE["red"]))
    y += 72
    y = wrap(d, x, y, "维修经验很多，但知识没有被组织起来。", 36, rgba(PALETTE["ink"]), left_w - 68, 5)
    d.line((x, y + 22, x + left_w - 68, y + 22), fill=rgba(PALETTE["line"]), width=2)
    d.text((x, y + 52), "三个真实卡点", font=font(23), fill=rgba(PALETTE["wood"]))
    y += 102
    y = bullet(d, x, y, "老师傅经验集中，场景高度碎片化", rgba(PALETTE["red"]), left_w - 105)
    y = bullet(d, x, y, "规范、案例和企业文档散落，检索以分钟计", rgba(PALETTE["red"]), left_w - 105)
    y = bullet(d, x, y, "保修责任认定必须有依据、有来源、可追溯", rgba(PALETTE["red"]), left_w - 105)
    d.line((x, y + 10, x + left_w - 68, y + 10), fill=rgba(PALETTE["line"]), width=2)
    d.text((x, y + 40), "为什么离开平台", font=font(23), fill=rgba(PALETTE["wood"]))
    rows = [
        ("数据托管", "客户要求数据自有、可治理、可审计"),
        ("检索黑盒", "无法调优三通道检索和响应速度"),
        ("企业需求", "导出、权限、审计、私有化无法补齐"),
    ]
    y += 86
    for title, body in rows:
        rounded(d, (x, y, x + left_w - 68, y + 70), 12, fill=(250, 249, 245, 235), outline=rgba(PALETTE["line"]), width=2)
        d.text((x + 18, y + 13), title, font=font(20), fill=rgba(PALETTE["ink"]))
        d.text((x + 18, y + 42), body, font=font(17), fill=rgba(PALETTE["muted"]))
        y += 82
    rounded(d, (x, body_bottom - 192, x + left_w - 68, body_bottom - 36), 14, fill=rgba(PALETTE["red"], 20), outline=rgba(PALETTE["red"]), width=2)
    d.text((x + 18, body_bottom - 170), "典型问题链路", font=font(21), fill=rgba(PALETTE["wood"]))
    wrap(d, x + 18, body_bottom - 132, "现场提问：是否属于保修责任？", 19, rgba(PALETTE["ink"]), left_w - 104, 4)
    wrap(d, x + 18, body_bottom - 91, "检索规范 → 匹配案例 → 责任判断 → 生成方案", 18, rgba(PALETTE["muted"]), left_w - 104, 4)

    # Center: the approved editable architecture visual. Its own title and
    # footer are retained so the case page reads as one coherent diagram,
    # instead of repeating a second heading outside the diagram.
    x = center_x + 28
    arch = Image.open(ARCH).convert("RGBA")
    arch_w, arch_h = center_w - 56, 698
    arch = ImageOps.contain(arch, (arch_w, arch_h), method=Image.Resampling.LANCZOS)
    arch_x = center_x + (center_w - arch.width) // 2
    arch_y = body_top + 42
    # White matte keeps the editable diagram legible over the photo.
    rounded(d, (arch_x - 10, arch_y - 10, arch_x + arch.width + 10, arch_y + arch.height + 10), 16, fill=(255, 255, 255, 248), outline=rgba(PALETTE["line"]), width=2)
    canvas.alpha_composite(arch, (arch_x, arch_y))
    d = ImageDraw.Draw(canvas, "RGBA")
    d.text((center_x + 28, body_bottom - 58), "方案核心：私有化部署 + 领域检索 + 企业治理", font=font(19), fill=rgba(PALETTE["wood"]))

    # Right: proof and deliverables.
    x, y = right_x + 34, body_top + 32
    badge(d, x, y, "03", "可验证结果", rgba(PALETTE["olive"]))
    y += 72
    y = wrap(d, x, y, "从平台能力，走到企业交付。", 35, rgba(PALETTE["ink"]), right_w - 68, 5)
    d.text((x, y + 26), "三个最值得被记住的工程指标", font=font(22), fill=rgba(PALETTE["wood"]))
    y += 70
    metrics = [("10–20 s → 100 ms", "知识检索耗时", PALETTE["olive"]), ("0.6 s", "回答首字延迟", PALETTE["red"]), ("5 类", "知识入库格式", PALETTE["amber"])]
    for value, label, accent in metrics:
        rounded(d, (x, y, x + right_w - 68, y + 91), 14, fill=(248, 247, 241, 240), outline=rgba(accent), width=2)
        value_size = 27 if len(value) > 8 else 34
        d.text((x + 18, y + 18), value, font=font(value_size), fill=rgba(accent))
        d.text((x + 282 if len(value) > 8 else x + 190, y + 22), label, font=font(19), fill=rgba(PALETTE["ink"]))
        y += 104
    d.line((x, y + 4, x + right_w - 68, y + 4), fill=rgba(PALETTE["line"]), width=2)
    d.text((x, y + 32), "交付资产", font=font(22), fill=rgba(PALETTE["wood"]))
    y += 74
    for item in ["HTML / PDF 维修方案", "编号存档与责任溯源", "管理看板与运营周报", "8 路流式 + 排队保护", "安全审计：发现风险全部闭环"]:
        d.ellipse((x, y + 9, x + 13, y + 22), fill=rgba(PALETTE["olive"]))
        d.text((x + 26, y), item, font=font(20), fill=rgba(PALETTE["ink"]))
        y += 44
    rounded(d, (x, body_bottom - 126, x + right_w - 68, body_bottom - 38), 14, fill=rgba(PALETTE["ink"]), outline=rgba(PALETTE["ink"]), width=2)
    d.text((x + 18, body_bottom - 102), "100 人规模多角色使用", font=font(21), fill=rgba(PALETTE["paper"]))
    d.text((x + 18, body_bottom - 68), "数据不出机房 · 权限分层 · 操作可查", font=font(17), fill=rgba(PALETTE["jade"]))

    # Closing band.
    band_y = 1270
    rounded(d, (M, band_y, W - M, 1378), 18, fill=rgba(PALETTE["ink"]), outline=rgba(PALETTE["ink"]), width=2)
    d.text((M + 30, band_y + 28), "核心变化", font=font(25), fill=rgba(PALETTE["amber"]))
    d.text((M + 180, band_y + 27), "不是做一个机器人，而是交付一个客户可拥有、可治理、可持续运营的企业系统。", font=font(24), fill=rgba(PALETTE["paper"]))
    d.text((W - M - 30, band_y + 78), "昭桥｜企业 AI 系统交付案例", font=font(17), fill=rgba(PALETTE["jade"]), anchor="ra")

    paper = Image.new("RGBA", canvas.size, rgba(PALETTE["paper"]))
    rgb = Image.alpha_composite(paper, canvas).convert("RGB")
    rgb.save(OUT, "PNG", dpi=(300, 300), optimize=True)
    web = OUT.with_name(OUT.stem + "_web.png")
    rgb.resize((1280, 720), Image.Resampling.LANCZOS).save(web, "PNG", optimize=True)
    pdf = OUT.with_suffix(".pdf")
    rgb.save(pdf, "PDF", resolution=300.0)
    contact = rgb.resize((1280, 720), Image.Resampling.LANCZOS)
    contact.save(BUILD / "case01_fangxiu_complete_contact_sheet.png", "PNG", optimize=True)
    return OUT, web, pdf


if __name__ == "__main__":
    for path in compose():
        print(path)
