"""通过 GitHub API 上传文件（绕过 git 的 HTTPS 传输层问题）。

沙盒内 git push 会因 TLS 中断失败，但 gh 的 API 通道正常，
所以改用 Contents API 逐文件提交。

用法：
    python push_api.py
"""

from __future__ import annotations

import base64
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = "huangwei361/zhuoyan-aerospace"
BRANCH = "main"

SKIP_DIRS = {".git", "__pycache__", "_shots", "_source_images", "frames"}
SKIP_EXT = {".pyc", ".jpg", ".png"}


def gh(*args: str) -> str:
    r = subprocess.run(
        ["gh", *args], capture_output=True, text=True, encoding="utf-8", errors="replace"
    )
    if r.returncode != 0:
        raise RuntimeError(f"gh {' '.join(args[:2])}: {r.stderr[:300]}")
    return r.stdout


def sha_of(path: str) -> str | None:
    try:
        out = gh("api", f"repos/{REPO}/contents/{path}?ref={BRANCH}")
        import json

        return json.loads(out).get("sha")
    except Exception:
        return None


def upload(path: str, data: bytes) -> bool:
    import json

    # 必须是相对仓库根的路径，绝对路径会被 GitHub API 拒绝
    rel = os.path.relpath(path, HERE).replace("\\", "/")
    b64 = base64.b64encode(data).decode()
    existing = sha_of(rel)

    # Windows 命令行有 32K 长度限制，base64 后的图片会超限（WinError 206）。
    # 改用 gh api --input 从 stdin 读 JSON。
    payload = {
        "message": f"update {rel}",
        "content": b64,
        "branch": BRANCH,
    }
    if existing:
        payload["sha"] = existing

    tmp = os.path.join(HERE, "_gh_payload.json")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(payload, f)

    try:
        with open(tmp, "rb") as fin:
            subprocess.run(
                [
                    "gh", "api", "--method", "PUT",
                    f"repos/{REPO}/contents/{rel}",
                    "--input", "-",
                ],
                stdin=fin,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=180,
                check=True,
            )
        print(f"  [ok] {rel}  {len(data)//1024}KB")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  [FAIL] {rel}: {(e.stderr or '')[:160]}")
        return False
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def main():
    files = []
    for root, dirs, names in os.walk(HERE):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for n in names:
            if os.path.splitext(n)[1].lower() in SKIP_EXT:
                continue
            if n == ".gitignore":
                continue
            p = os.path.join(root, n)
            files.append(p)

    print(f"上传 {len(files)} 个文件到 {REPO}:{BRANCH}\n")
    ok = 0
    for p in sorted(files):
        with open(p, "rb") as f:
            data = f.read()
        if upload(p, data):
            ok += 1
    print(f"\n{ok}/{len(files)} 上传成功")
    return 0 if ok == len(files) else 1


if __name__ == "__main__":
    sys.exit(main())
