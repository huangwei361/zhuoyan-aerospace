"""用真实照片替换官网蓝焰系列的 SVG 四代对比图。"""

import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
INDEX = os.path.join(HERE, "index.html")

s = open(INDEX, encoding="utf-8").read()

# 定位 SVG 块：从 <div class="chart-box ..."> 到对应的 </svg></div></div></section>
start_marker = '<div class="chart-box reveal" style="margin-top:clamp(32px,5vw,64px);">'
end_marker = '</svg>\n    </div>\n  </div>\n</section>'

i = s.find(start_marker)
j = s.find(end_marker)
if i == -1 or j == -1:
    # 打印当前实际结构以便定位
    idx = s.find("BLUE FLAME FAMILY")
    print("SVG 起点未找到，BLUE FLAME 在:", idx)
    print(repr(s[idx-100:idx+200]))
    raise SystemExit(1)

j = j + len(end_marker)

replacement = '''<div class="chart-box reveal" style="margin-top:clamp(32px,5vw,64px);background:transparent;border:none;padding:0;">
      <p style="font-family:var(--font-mono);font-size:11px;letter-spacing:.2em;color:var(--accent);font-weight:700;margin-bottom:8px;">BLUE FLAME FAMILY · 蓝焰系列</p>
      <h3 style="font-family:var(--font-serif);font-size:28px;font-weight:800;color:var(--primary);margin-bottom:24px;">一代工程血脉，四代产品</h3>

      <div class="mission-grid">
        <article class="mission-card">
          <img class="mission-card__img" src="assets/bf1.webp" alt="蓝焰-1 验证机" loading="lazy"/>
          <div class="mission-card__body">
            <div class="mission-card__num">BF-1 · 验证机</div>
            <h4 class="mission-card__title">蓝焰-1</h4>
            <p class="mission-card__desc">150 kN · 10 MPa · 复用 5 次 · 2026—2027</p>
          </div>
        </article>

        <article class="mission-card">
          <img class="mission-card__img" src="assets/bf2.webp" alt="蓝焰-2 工程化" loading="lazy"/>
          <div class="mission-card__body">
            <div class="mission-card__num">BF-2 · 工程化</div>
            <h4 class="mission-card__title">蓝焰-2</h4>
            <p class="mission-card__desc">1—3 MN · 18—22 MPa · 复用 20+ 次 · 2028—2030</p>
          </div>
        </article>

        <article class="mission-card">
          <img class="mission-card__img" src="assets/bf3.webp" alt="蓝焰-3 复用版" loading="lazy"/>
          <div class="mission-card__body">
            <div class="mission-card__num">BF-3 · 复用版</div>
            <h4 class="mission-card__title">蓝焰-3</h4>
            <p class="mission-card__desc">10 MN 级 · 25—30 MPa · 复用 100+ 次 · 2030—2032</p>
          </div>
        </article>

        <article class="mission-card">
          <img class="mission-card__img" src="assets/bfh.webp" alt="蓝焰重型 全尺寸" loading="lazy"/>
          <div class="mission-card__body">
            <div class="mission-card__num">BF-H · 全尺寸</div>
            <h4 class="mission-card__title">蓝焰 重型</h4>
            <p class="mission-card__desc">LEO 运力 200—250 t · 翻修 ≤ 48 h · 入轨 ≤ ¥1,000/kg</p>
          </div>
        </article>
      </div>

      <p style="font-size:14px;color:var(--muted);margin-top:20px;line-height:1.8;">
        从 BF-1 到 BF-H 不是四个新项目，是四个版本号 —— 每代产品继承上一代的推力室、涡轮泵、阀门、试验规程与数据资产，边际成本递减，可靠性递增。
      </p>
    </div>
  </div>
</section>'''

s = s[:i] + replacement + s[j:]

open(INDEX, "w", encoding="utf-8").write(s)
print(f"替换完成，原 {j-i} 字符 → 新 {len(replacement)} 字符")
print(f"剩余 SVG 数量: {s.count('<svg')}")
