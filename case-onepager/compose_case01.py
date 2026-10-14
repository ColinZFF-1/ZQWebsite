"""Three-column case graphic for 房修小匠 / property-maintenance agent."""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
from compose import (  # noqa: E402
    BUILD,
    H,
    M,
    PALETTE,
    W,
    draw_icon,
    draw_logo,
    font,
    rgba,
    rounded,
)


BG = ROOT / "assets" / "fangxiu-background.png"
OUT = BUILD / "case01_fangxiu_three_column_2480x3508.png"


def line_text(draw, x, y, text, size=24, fill=None, max_width=None, leading=12):
    fill = fill or rgba(PALETTE["ink"])
    f = font(size)
    if max_width is None:
        draw.text((x, y), text, font=f, fill=fill)
        return y + size
    words = list(text)
    lines, current = [], ""
    for ch in words:
        trial = current + ch
        if draw.textbbox((0, 0), trial, font=f)[2] > max_width and current:
            lines.append(current)
            current = ch
        else:
            current = trial
    if current:
        lines.append(current)
    for line in lines:
        draw.text((x, y), line, font=f, fill=fill)
        y += size + leading
    return y


def badge(draw, x, y, number, label, accent):
    rounded(draw, (x, y, x + 70, y + 34), radius=17, fill=accent)
    draw.text((x + 35, y + 17), number, font=font(18), fill=rgba(PALETTE["paper"]), anchor="mm")
    draw.text((x + 88, y + 17), label, font=font(25), fill=rgba(PALETTE["muted"]), anchor="lm")


def bullet(draw, x, y, text, accent, width):
    draw.ellipse((x, y + 10, x + 14, y + 24), fill=accent)
    return line_text(draw, x + 28, y, text, 24, rgba(PALETTE["ink"]), width, 8)


def arrow(draw, x1, y1, x2, y2, color, width=5):
    draw.line((x1, y1, x2, y2), fill=color, width=width)
    # small triangular arrow head
    if abs(x2 - x1) >= abs(y2 - y1):
        s = 12 if x2 >= x1 else -12
        draw.polygon([(x2, y2), (x2 - s, y2 - 8), (x2 - s, y2 + 8)], fill=color)
    else:
        s = 12 if y2 >= y1 else -12
        draw.polygon([(x2, y2), (x2 - 8, y2 - s), (x2 + 8, y2 - s)], fill=color)


def small_box(draw, box, title, body, accent, title_size=25, body_size=19):
    rounded(draw, box, radius=16, fill=(250, 249, 245, 235), outline=accent, width=2)
    x1, y1, x2, y2 = box
    draw.ellipse((x1 + 18, y1 + 18, x1 + 46, y1 + 46), fill=accent)
    draw.text((x1 + 60, y1 + 14), title, font=font(title_size), fill=rgba(PALETTE["ink"]))
    line_text(draw, x1 + 20, y1 + 62, body, body_size, rgba(PALETTE["muted"]), x2 - x1 - 40, 6)


def compose():
    BUILD.mkdir(exist_ok=True)
    bg = ImageOps.fit(Image.open(BG).convert("RGBA"), (W, H), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    # Keep the generated photograph visible while creating a legible editorial
    # surface for dense Chinese text and the architecture diagram.
    veil = Image.new("RGBA", (W, H), (250, 249, 245, 146))
    canvas = Image.alpha_composite(bg, veil)
    d = ImageDraw.Draw(canvas, "RGBA")

    # Header over the photo.
    draw_logo(d, M, 82, 0.76, include_tagline=False)
    d.text((W - M, 116), "昭桥案例  /  物业维修", font=font(22), fill=rgba(PALETTE["wood"]), anchor="ra")
    d.text((M, 296), "房修小匠", font=font(82), fill=rgba(PALETTE["ink"]))
    d.text((M, 410), "把老师傅的经验，变成人人可查、可追溯的维修知识库", font=font(35), fill=rgba(PALETTE["ink"]))
    d.line((M, 520, W - M, 520), fill=rgba(PALETTE["red"]), width=6)
    d.text((M, 548), "物业维修智能体　｜　企业系统交付　｜　私有化部署　｜　可治理、可审计", font=font(22), fill=rgba(PALETTE["muted"]))

    # Three equal editorial columns.
    top, bottom, gap = 720, 2550, 28
    col_w = (W - 2 * M - 2 * gap) // 3
    xs = [M, M + col_w + gap, M + 2 * (col_w + gap)]
    fills = [(255, 254, 251, 235)] * 3
    for x, fill in zip(xs, fills):
        rounded(d, (x, top, x + col_w, bottom), radius=28, fill=fill, outline=(222, 218, 210, 230), width=3)

    # LEFT: context and challenge.
    x = xs[0] + 38
    badge(d, x, top + 42, "01", "项目起点", rgba(PALETTE["red"]))
    line_text(d, x, top + 116, "维修经验很多，", 39, rgba(PALETTE["ink"]), col_w - 76, 6)
    line_text(d, x, top + 164, "但知识没有被组织起来。", 39, rgba(PALETTE["ink"]), col_w - 76, 6)
    d.line((x, top + 280, x + col_w - 76, top + 280), fill=rgba(PALETTE["line"]), width=2)
    d.text((x, top + 312), "原来的三个卡点", font=font(25), fill=rgba(PALETTE["wood"]))
    y = top + 366
    y = bullet(d, x, y, "老师傅经验集中，场景却高度碎片化", rgba(PALETTE["red"]), col_w - 110) + 22
    y = bullet(d, x, y, "规范、案例和企业文档散落，检索以分钟计", rgba(PALETTE["red"]), col_w - 110) + 22
    y = bullet(d, x, y, "保修责任认定必须有依据、有来源、可追溯", rgba(PALETTE["red"]), col_w - 110) + 22
    d.line((x, y + 20, x + col_w - 76, y + 20), fill=rgba(PALETTE["line"]), width=2)
    d.text((x, y + 52), "为什么从平台迁移出来", font=font(25), fill=rgba(PALETTE["wood"]))
    rows = [
        ("数据托管", "客户要求数据自有、可治理、可审计"),
        ("检索黑盒", "无法做三通道业务化检索和响应调优"),
        ("企业需求", "导出、权限、审计与私有化无法补齐"),
    ]
    y += 108
    for title, body in rows:
        rounded(d, (x, y, x + col_w - 76, y + 96), 14, fill=(250, 249, 245, 230), outline=rgba(PALETTE["line"]), width=2)
        d.text((x + 20, y + 16), title, font=font(22), fill=rgba(PALETTE["ink"]))
        line_text(d, x + 20, y + 50, body, 18, rgba(PALETTE["muted"]), col_w - 120, 4)
        y += 112
    # Make the left column explain who benefits from the system, instead of
    # leaving a document-like blank area under the migration table.
    role_y = y + 26
    d.text((x, role_y), "同一套知识，服务不同角色", font=font(24), fill=rgba(PALETTE["wood"]))
    roles = [("工程师", "现场判断与维修执行", PALETTE["red"]), ("客服", "快速回答与责任说明", PALETTE["wood"]), ("管理者", "看板、周报与审计", PALETTE["olive"])]
    ry = role_y + 44
    for title, body, accent in roles:
        rounded(d, (x, ry, x + col_w - 76, ry + 67), 12, fill=(250, 249, 245, 230), outline=rgba(accent), width=2)
        d.ellipse((x + 18, ry + 20, x + 38, ry + 40), fill=rgba(accent))
        d.text((x + 54, ry + 14), title, font=font(20), fill=rgba(PALETTE["ink"]))
        d.text((x + 164, ry + 17), body, font=font(18), fill=rgba(PALETTE["muted"]))
        ry += 78
    d.text((x, bottom - 82), "项目性质从“做一个机器人”变成“交付一个企业系统”", font=font(20), fill=rgba(PALETTE["wood"]))

    # MIDDLE: solution and business architecture. The key message is that a
    # platform bot became a governable enterprise system, so the diagram is
    # layered instead of presenting only a four-step prompt chain.
    x = xs[1] + 38
    badge(d, x, top + 42, "02", "解决方案", rgba(PALETTE["wood"]))
    line_text(d, x, top + 116, "从平台机器人到企业维修系统", 33, rgba(PALETTE["ink"]), col_w - 76, 6)
    line_text(d, x, top + 164, "每一层都在自己手里：数据、检索、治理与交付。", 21, rgba(PALETTE["muted"]), col_w - 76, 6)
    arch_x, arch_w = x, col_w - 76
    layer_gap = 15
    ly = top + 270
    def layer_box(y, title, body, accent, height=82):
        rounded(d, (arch_x, y, arch_x + arch_w, y + height), 15, fill=(249, 248, 243, 238), outline=accent, width=2)
        d.ellipse((arch_x + 18, y + 24, arch_x + 44, y + 50), fill=accent)
        d.text((arch_x + 60, y + 16), title, font=font(22), fill=rgba(PALETTE["ink"]))
        line_text(d, arch_x + 60, y + 48, body, 18, rgba(PALETTE["muted"]), arch_w - 82, 4)
    layer_box(ly, "01  数据接入", "PPT / Word / PDF / Excel / TXT + 图片 OCR → 解析 → 分块 → 向量化 → 审核启用", rgba(PALETTE["red"]), 104)
    ly += 104 + layer_gap
    layer_box(ly, "02  知识资产", "500+ 维修案例　·　103 条维修规范　·　持续上传的企业文档", rgba(PALETTE["wood"]), 84)
    ly += 84 + layer_gap
    layer_box(ly, "03  智能体决策链", "检索规范 → 匹配案例 → 划分保修责任 → 生成可执行维修方案", rgba(PALETTE["red"]), 96)
    ly += 96 + layer_gap
    layer_box(ly, "04  企业基础设施", "Docker 私有化　·　本地向量模型 / 索引　·　语义缓存　·　8 路并发保护", rgba(PALETTE["olive"]), 96)
    ly += 96 + layer_gap
    layer_box(ly, "05  交付与治理", "HTML / PDF　·　编号存档　·　三角色权限　·　操作审计　·　看板 / 周报", rgba(PALETTE["amber"]), 96)
    # Vertical arrows make the dependency between layers explicit.
    for ay in (top + 374, top + 473, top + 572, top + 677):
        arrow(d, arch_x + arch_w / 2, ay, arch_x + arch_w / 2, ay + 14, rgba(PALETTE["line"]), 3)
    rounded(d, (arch_x, bottom - 190, arch_x + arch_w, bottom - 82), 16, fill=rgba(PALETTE["ink"]), outline=rgba(PALETTE["ink"]), width=2)
    d.text((arch_x + 20, bottom - 168), "数据不出机房　·　三角色权限　·　责任可追溯", font=font(21), fill=rgba(PALETTE["paper"]))

    # RIGHT: proof points and deliverables.
    x = xs[2] + 38
    badge(d, x, top + 42, "03", "可验证成效", rgba(PALETTE["olive"]))
    line_text(d, x, top + 116, "从平台能力，走到企业交付。", 34, rgba(PALETTE["ink"]), col_w - 76, 6)
    line_text(d, x, top + 164, "工程指标与业务资产一起留下来。", 22, rgba(PALETTE["muted"]), col_w - 76, 6)
    # Big before/after metric.
    metric_y = top + 286
    rounded(d, (x, metric_y, x + col_w - 76, metric_y + 180), 20, fill=(239, 246, 238, 235), outline=rgba(PALETTE["olive"]), width=2)
    d.text((x + 22, metric_y + 22), "知识检索耗时", font=font(22), fill=rgba(PALETTE["muted"]))
    d.text((x + 22, metric_y + 66), "10–20 秒", font=font(37), fill=rgba(PALETTE["muted"]))
    arrow(d, x + 190, metric_y + 96, x + 280, metric_y + 96, rgba(PALETTE["olive"]), 6)
    d.text((x + 300, metric_y + 58), "约 100 ms", font=font(37), fill=rgba(PALETTE["olive"]))
    d.text((x + 300, metric_y + 116), "本地向量模型 + 数据库索引", font=font(17), fill=rgba(PALETTE["muted"]))
    # Other metrics.
    d.text((x, metric_y + 224), "工程与业务资产", font=font(24), fill=rgba(PALETTE["wood"]))
    metric_rows = [
        ("0.6 秒", "回答首字延迟，流式输出"),
        ("秒回", "重复问题命中语义缓存"),
        ("5 种格式", "PPT / Word / PDF / Excel / TXT"),
        ("8 路流式", "并发保护 + 排队机制"),
        ("100 人规模", "多角色协作使用"),
    ]
    yy = metric_y + 274
    for value, label in metric_rows:
        d.text((x, yy), value, font=font(29), fill=rgba(PALETTE["ink"]))
        line_text(d, x + 158, yy + 3, label, 19, rgba(PALETTE["muted"]), col_w - 250, 4)
        yy += 62
    d.line((x, yy + 8, x + col_w - 76, yy + 8), fill=rgba(PALETTE["line"]), width=2)
    d.text((x, yy + 38), "可交付、可追溯", font=font(24), fill=rgba(PALETTE["wood"]))
    deliverables = ["HTML / PDF 维修方案", "编号存档与责任溯源", "管理看板与运营周报", "对抗式安全审计闭环"]
    yy += 92
    for item in deliverables:
        draw_icon(d, x + 20, yy + 14, "check", rgba(PALETTE["olive"]), 0.35)
        d.text((x + 52, yy), item, font=font(21), fill=rgba(PALETTE["ink"]))
        yy += 51
    gov_y = yy + 20
    rounded(d, (x, gov_y, x + col_w - 76, gov_y + 110), 16, fill=(247, 244, 236, 235), outline=rgba(PALETTE["line"]), width=2)
    d.text((x + 20, gov_y + 16), "治理底线", font=font(21), fill=rgba(PALETTE["wood"]))
    d.text((x + 20, gov_y + 58), "数据不出机房　·　权限分层　·　操作可查", font=font(18), fill=rgba(PALETTE["ink"]))
    # bottom quote within card.
    rounded(d, (x, bottom - 190, x + col_w - 76, bottom - 82), 16, fill=rgba(PALETTE["amber"], 55), outline=rgba(PALETTE["amber"]), width=2)
    d.text((x + 22, bottom - 166), "不是做一个机器人", font=font(24), fill=rgba(PALETTE["ink"]))
    d.text((x + 22, bottom - 126), "而是交付一个企业系统", font=font(27), fill=rgba(PALETTE["wood"]))

    # Full-width business loop: this is the architecture relationship the
    # original brief asked to make visible beyond the three columns.
    flow_y, flow_bottom = 2635, 3020
    rounded(d, (M, flow_y, W - M, flow_bottom), 26, fill=(255, 254, 251, 238), outline=(222, 218, 210, 230), width=3)
    d.text((M + 40, flow_y + 38), "04｜业务闭环", font=font(25), fill=rgba(PALETTE["wood"]))
    d.text((M + 40, flow_y + 90), "一次请求，留下可追溯的企业资产", font=font(36), fill=rgba(PALETTE["ink"]))
    loop = [
        ("提问", "现场问题", PALETTE["red"]),
        ("检索", "规范 + 案例", PALETTE["wood"]),
        ("判定", "保修责任", PALETTE["olive"]),
        ("生成", "维修方案", PALETTE["amber"]),
        ("导出", "HTML / PDF", PALETTE["red"]),
        ("沉淀", "编号、审计、周报", PALETTE["olive"]),
    ]
    lx = M + 40
    ly = flow_y + 180
    lw = (W - 2 * M - 80 - 5 * 18) // 6
    for i, (title, body, accent) in enumerate(loop):
        bx = lx + i * (lw + 18)
        rounded(d, (bx, ly, bx + lw, ly + 112), 16, fill=(248, 246, 240, 235), outline=rgba(accent), width=2)
        d.ellipse((bx + 18, ly + 18, bx + 48, ly + 48), fill=rgba(accent))
        d.text((bx + 64, ly + 14), title, font=font(24), fill=rgba(PALETTE["ink"]))
        line_text(d, bx + 18, ly + 62, body, 18, rgba(PALETTE["muted"]), lw - 36, 4)
        if i < len(loop) - 1:
            arrow(d, bx + lw + 3, ly + 56, bx + lw + 14, ly + 56, rgba(PALETTE["red"]), 3)
    d.text((M + 40, flow_y + 326), "工程能力", font=font(21), fill=rgba(PALETTE["muted"]))
    d.text((M + 160, flow_y + 326), "本地向量模型　·　Docker 私有化　·　三角色权限　·　对抗式安全审计", font=font(21), fill=rgba(PALETTE["ink"]))

    # Footer band.
    footer_y = 3132
    d.line((M, footer_y, W - M, footer_y), fill=rgba(PALETTE["red"]), width=4)
    draw_logo(d, M, footer_y + 20, 0.48, include_tagline=False)
    d.text((W - M, footer_y + 58), "昭桥｜企业 AI 系统交付案例", font=font(22), fill=rgba(PALETTE["muted"]), anchor="ra")
    d.text((M + 230, footer_y + 95), "从真实维修案例出发，把知识变成现场可以调用的系统能力。", font=font(22), fill=rgba(PALETTE["ink"]))

    # Composite semi-transparent drawn cards over a paper base before encoding.
    paper = Image.new("RGBA", canvas.size, rgba(PALETTE["paper"]))
    rgb = Image.alpha_composite(paper, canvas).convert("RGB")
    rgb.save(OUT, "PNG", dpi=(300, 300), optimize=True)
    web = OUT.with_name(OUT.stem + "_web.png")
    rgb.resize((1240, 1754), Image.Resampling.LANCZOS).save(web, "PNG", optimize=True)
    pdf = OUT.with_suffix(".pdf")
    rgb.save(pdf, "PDF", resolution=300.0)
    contact = Image.new("RGB", (1240, 1850), "white")
    contact.paste(rgb.resize((620, 877), Image.Resampling.LANCZOS), (310, 40))
    ImageDraw.Draw(contact).text((20, 12), "房修小匠｜三栏案例图", font=font(22), fill=PALETTE["ink"])
    contact.save(BUILD / "case01_fangxiu_contact_sheet.png", "PNG", optimize=True)
    return OUT, web, pdf


if __name__ == "__main__":
    for path in compose():
        print(path)
