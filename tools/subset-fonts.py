#!/usr/bin/env python3
"""
昭桥官网字体子集化脚本。
改动 dist/index.html 中的任何文案（中文或 data-en 英文）后，请重新运行：
    pip install fonttools brotli
    python3 tools/subset-fonts.py --src /path/to/source-fonts
源字体（OFL，可从 github.com/google/fonts 下载）：
    NotoSansSC.ttf（可变字体 NotoSansSC[wght].ttf）、SpaceGrotesk.ttf（SpaceGrotesk[wght].ttf）、Inter.ttf（Inter[opsz,wght].ttf）
输出到 dist/assets/fonts/*.woff2。脚本会收集 index.html 里出现的全部字符（含 data-en 属性），中英两种语言都覆盖。
"""
import argparse, html, os, re
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'dist', 'assets', 'fonts')
LATIN = ''.join(chr(c) for c in range(0x20, 0x7F)) + '—–·’‘“”…→↗←↓°±×%'

def page_text():
    s = open(os.path.join(ROOT, 'dist', 'index.html'), encoding='utf-8').read() + open(os.path.join(ROOT, 'dist', 'assets', 'js', 'site.js'), encoding='utf-8').read()
    s = html.unescape(html.unescape(s))
    return ''.join(sorted(set(s + LATIN + '０１２３４５６７８９｜，。、；：！？（）《》「」')))

def build(src, axes, text, out):
    f = TTFont(src)
    if 'fvar' in f:
        f = instancer.instantiateVariableFont(f, axes)
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.name_IDs = ['*']; opts.notdef_outline = True
    sub = subset.Subsetter(opts); sub.populate(text=text); sub.subset(f)
    f.flavor = 'woff2'; f.save(os.path.join(OUT, out))
    print(out, os.path.getsize(os.path.join(OUT, out)) // 1024, 'KB')

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--src', default='/workspace/fonts'); a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    t = page_text()
    cjk = ''.join(ch for ch in t if ord(ch) > 0x2000 or ch in LATIN)
    build(os.path.join(a.src, 'NotoSansSC.ttf'), {'wght': 400}, cjk, 'zq-sans-400.woff2')
    build(os.path.join(a.src, 'NotoSansSC.ttf'), {'wght': 900}, cjk, 'zq-sans-900.woff2')
    build(os.path.join(a.src, 'SpaceGrotesk.ttf'), {'wght': 600}, LATIN, 'space-grotesk-600.woff2')
    build(os.path.join(a.src, 'Inter.ttf'), {'wght': 400, 'opsz': 14}, LATIN, 'inter-400.woff2')
    build(os.path.join(a.src, 'Inter.ttf'), {'wght': 700, 'opsz': 14}, LATIN, 'inter-700.woff2')
