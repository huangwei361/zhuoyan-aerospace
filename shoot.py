"""用 Edge headless 给官网截图（多区块 + 多断点）。

用法：
    python shoot.py                 # 全部
    python shoot.py desktop         # 只桌面
    python shoot.py mobile
"""

from __future__ import annotations

import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "_shots")
os.makedirs(OUT, exist_ok=True)

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

TARGETS = [
    ("desktop", 1440, 2000, 1),
    ("desktop-full", 1440, 5200, 1),
    ("tablet", 900, 2000, 1),
    ("mobile", 390, 2000, 2),
]


def browser() -> str:
    for p in (EDGE, CHROME):
        if os.path.exists(p):
            return p
    raise SystemExit("no browser found")


def shoot(name: str, w: int, h: int, dpr: int) -> bool:
    exe = browser()
    ud = tempfile.mkdtemp(prefix="shot_")
    out = os.path.join(OUT, f"{name}.png")
    url = "file:///" + os.path.join(HERE, "index.html").replace("\\", "/")
    cmd = [
        exe, "--headless", "--disable-gpu", "--no-sandbox",
        "--hide-scrollbars", "--disable-extensions",
        f"--user-data-dir={ud}",
        f"--window-size={w},{h}",
        f"--force-device-scale-factor={dpr}",
        f"--screenshot={out}",
        "--virtual-time-budget=10000",
        url,
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    ok = os.path.exists(out) and os.path.getsize(out) > 5000
    if ok:
        print(f"  [ok] {name}.png  {os.path.getsize(out)//1024} KB  ({w}x{h})")
    else:
        print(f"  [FAIL] {name}: {r.stderr[:200]}")
    return ok


def main():
    args = sys.argv[1:]
    targets = [t for t in TARGETS if not args or t[0] in args]
    print("截图:")
    for name, w, h, dpr in targets:
        shoot(name, w, h, dpr)


if __name__ == "__main__":
    main()
