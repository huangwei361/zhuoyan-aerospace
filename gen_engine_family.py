"""生成官网蓝焰系列四代发动机的真实照片。

BF-1/2/3/H 四代对应四个推力级别，视觉上要有明显的规模递进。

用法：
    python gen_engine_family.py
"""

from __future__ import annotations

import os
import sys
import time

import requests

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "assets")
os.makedirs(OUT, exist_ok=True)

BASE = "https://ark.cn-beijing.volces.com/api/v3"
MODEL = "doubao-seedream-5-0-pro-260628"
KEY = os.environ.get("ARK_API_KEY", "")

NEGATIVE = (
    "illustration, cartoon, anime, 3d render, cgi, vector art, painting, sketch, "
    "drawing, diagram, infographic, text overlay, logo, letters, caption, watermark, "
    "ui, frame, border, collage, low quality, blurry, distorted, plastic, "
    "oversaturated, artificial, stock photo watermark"
)

SHOTS = [
    (
        "bf1",
        "a compact liquid oxygen methane rocket engine on an indoor test stand, "
        "copper regenerative cooling tubes, small turbopump, cryogenic valves and piping, "
        "frost on metal, industrial laboratory, single small engine, engineering photography, "
        "photorealistic, real photograph, natural lighting, ultra detailed, 8k",
        "4:3",
    ),
    (
        "bf2",
        "a mid-size liquid oxygen methane rocket engine, larger thrust chamber with "
        "copper cooling channels, stainless steel turbopump assembly, bank of cryogenic "
        "valves and manifolds, inside a bright assembly hall, industrial manufacturing, "
        "photorealistic, real photograph, natural lighting, ultra detailed, 8k",
        "4:3",
    ),
    (
        "bf3",
        "a large reusable liquid oxygen methane rocket engine cluster, three engines "
        "mounted together on a thrust structure, polished copper nozzles, complex piping "
        "and wiring harnesses, inside a high-bay facility with overhead cranes, "
        "photorealistic, real photograph, dramatic industrial lighting, ultra detailed, 8k",
        "4:3",
    ),
    (
        "bfh",
        "the engine section of a massive orbital rocket booster, dozens of large "
        "liquid oxygen methane engines arranged in a ring and center cluster, "
        "giant copper and steel nozzles, sea-level and vacuum variants visible, "
        "at a coastal launch site at dusk, low angle hero shot, "
        "photorealistic, real photograph, cinematic, ultra detailed, 8k",
        "4:3",
    ),
]


def generate(name: str, prompt: str, ratio: str, tries: int = 3) -> bool:
    dest = os.path.join(OUT, f"{name}.webp")
    if os.path.exists(dest) and os.path.getsize(dest) > 20000:
        print(f"  [skip] {name}.webp")
        return True

    body = {
        "model": MODEL,
        "prompt": f"{prompt}. Avoid: {NEGATIVE}",
        "size": "2K",
        "response_format": "url",
        "watermark": False,
    }
    headers = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

    for attempt in range(1, tries + 1):
        try:
            t0 = time.time()
            r = requests.post(
                f"{BASE}/images/generations", headers=headers, json=body, timeout=300
            )
            if r.status_code != 200:
                print(f"  [retry {attempt}] {name} HTTP {r.status_code}: {r.text[:100]}")
                time.sleep(3)
                continue
            url = r.json()["data"][0]["url"]
            img = requests.get(url, timeout=180)
            if img.status_code != 200:
                print(f"  [retry {attempt}] {name} 下载失败")
                continue

            # 转 WebP（压缩）
            import io
            from PIL import Image

            im = Image.open(io.BytesIO(img.content)).convert("RGB")
            if im.width > 1600:
                im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
            im.save(dest, "WEBP", quality=82, method=6)

            print(f"  [ok]   {name}.webp  {os.path.getsize(dest)//1024} KB  {time.time()-t0:.1f}s")
            return True
        except Exception as e:
            print(f"  [retry {attempt}] {name} {type(e).__name__}: {str(e)[:100]}")
            time.sleep(4)
    print(f"  [FAIL] {name}")
    return False


def main():
    print(f"model={MODEL}\n")
    ok = 0
    for name, prompt, ratio in SHOTS:
        if generate(name, prompt, ratio):
            ok += 1
    print(f"\n{ok}/{len(SHOTS)} 成功")
    return 0 if ok == len(SHOTS) else 1


if __name__ == "__main__":
    sys.exit(main())
