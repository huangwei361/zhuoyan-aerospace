"""校验官网：i18n 键完整性、资源存在、锚点有效、HTML 结构。"""

from __future__ import annotations

import os
import re
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(HERE, "index.html")
JS = os.path.join(HERE, "js", "main.js")
CSS = os.path.join(HERE, "css", "styles.css")

html = open(HTML, encoding="utf-8").read()
js = open(JS, encoding="utf-8").read()
css = open(CSS, encoding="utf-8").read()

errors = []
warnings = []

# ---------------------------------------------------------------- i18n 键
# HTML 里用到的键
used_zh = set(re.findall(r'data-i18n-zh="([^"]+)"', html))
used_en = set(re.findall(r'data-i18n-en="([^"]+)"', html))

# JS 字典里的键
dict_zh = set(re.findall(r'"([a-z0-9_.]+)":', js.split("en: {")[0]))
dict_en = set(re.findall(r'"([a-z0-9_.]+)":', js.split("en: {")[1])) if "en: {" in js else set()

print(f"HTML 用到的键: zh {len(used_zh)} / en {len(used_en)}")
print(f"JS 字典里的键: zh {len(dict_zh)} / en {len(dict_en)}")

if used_zh != used_en:
    only_zh = used_zh - used_en
    only_en = used_en - used_zh
    if only_zh:
        errors.append(f"只出现在 data-i18n-zh: {sorted(only_zh)}")
    if only_en:
        errors.append(f"只出现在 data-i18n-en: {sorted(only_en)}")

missing_zh = used_zh - dict_zh
missing_en = used_en - dict_en
if missing_zh:
    errors.append(f"HTML 引用但 zh 字典缺失: {sorted(missing_zh)}")
if missing_en:
    errors.append(f"HTML 引用但 en 字典缺失: {sorted(missing_en)}")

unused = (dict_zh | dict_en) - (used_zh | used_en)
if unused:
    warnings.append(f"字典里有但 HTML 未用: {sorted(unused)}")

# ---------------------------------------------------------------- 资源
refs = re.findall(r'(?:src|href)="([^"#:]+?)"', html)
for r in sorted(set(refs)):
    if r.startswith("http") or r.startswith("mailto") or r.startswith("data:"):
        continue
    p = os.path.join(HERE, r)
    if not os.path.exists(p):
        errors.append(f"资源缺失: {r}")

# CSS 里引用的资源
for r in re.findall(r"url\(['\"]?([^'\")]+)", css):
    if r.startswith("data:"):
        continue
    p = os.path.normpath(os.path.join(HERE, "css", r))
    if not os.path.exists(p):
        errors.append(f"CSS 资源缺失: {r}  (期望 {p})")

# ---------------------------------------------------------------- 锚点
ids = set(re.findall(r'id="([^"]+)"', html))
anchors = set(re.findall(r'href="#([^"]+)"', html))
for a in sorted(anchors):
    if a not in ids:
        errors.append(f"锚点无对应 id: #{a}")

# ---------------------------------------------------------------- 结构
sections = re.findall(r'<section[^>]*>', html)
print(f"\n<section> 数量: {len(sections)}")

for tag in ["html", "head", "body", "main", "header", "footer"]:
    o = len(re.findall(rf"<{tag}[\s>]", html))
    c = len(re.findall(rf"</{tag}>", html))
    if o != c:
        errors.append(f"<{tag}> 开合不匹配: {o} / {c}")

div_o = len(re.findall(r"<div[\s>]", html))
div_c = len(re.findall(r"</div>", html))
print(f"<div> 开合: {div_o} / {div_c}")
if div_o != div_c:
    errors.append(f"<div> 开合不匹配: {div_o} / {div_c}")

# 自闭合的 meta/link 不要被算成未闭合
print(f"<img> 数量: {len(re.findall(r'<img[ >]', html))}")
print(f"<svg> 数量: {len(re.findall(r'<svg[ >]', html))} / </svg>: {len(re.findall(r'</svg>', html))}")

# ---------------------------------------------------------------- CSS 括号
if css.count("{") != css.count("}"):
    errors.append(f"CSS 括号不匹配: {css.count('{')} / {css.count('}')}")

# ---------------------------------------------------------------- JS 括号
for ch_open, ch_close in [("{", "}"), ("(", ")"), ("[", "]")]:
    if js.count(ch_open) != js.count(ch_close):
        warnings.append(
            f"JS {ch_open}{ch_close} 数量: {js.count(ch_open)} / {js.count(ch_close)}"
        )

# ---------------------------------------------------------------- 报告
print()
if warnings:
    print("--- 提示 ---")
    for w in warnings:
        print(f"  [WARN] {w}")

if errors:
    print("--- 错误 ---")
    for e in errors:
        print(f"  [ERROR] {e}")
else:
    print("[OK] 全部检查通过")

# 资源清单
imgs = re.findall(r'src="(assets/[^"]+)"', html)
print(f"\n引用图片 {len(imgs)} 张:")
for i in sorted(set(imgs)):
    print(f"  {i}")
