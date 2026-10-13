"""Instagram arşivini (tüm gönderiler, albüm içleri dahil) indirir.

Galeri için fotoğraf seçmekte kullanılır; çıktılar yalnız `ig-archive`
dalına yazılır (.github/workflows/ig-archive.yml), ana siteye girmez.

Çıktılar:
  archive/ig.json                 -> gönderi listesi (kısa kod, tür, açıklama, tarih, dosyalar)
  archive/img/<kod>-<n>.webp      -> her gönderinin görselleri (videolarda kapak)
"""

import io
import json
import os
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

API = "https://graph.facebook.com/v21.0"
OUT = Path(__file__).resolve().parent.parent / "archive"
MAX_EDGE = 1400


def get(path, **params):
    params["access_token"] = os.environ["IG_TOKEN"]
    url = path if path.startswith("http") else f"{API}/{path}?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.load(r)


def ig_user_id():
    if os.environ.get("IG_USER_ID"):
        return os.environ["IG_USER_ID"]
    for page in get("me/accounts", fields="instagram_business_account{id,username}").get("data", []):
        ig = page.get("instagram_business_account")
        if ig and ig.get("username") == "eden.floralart":
            return ig["id"]
    raise SystemExit("eden.floralart bulunamadı")


def save(url, dest):
    with urllib.request.urlopen(url, timeout=90) as r:
        im = Image.open(io.BytesIO(r.read())).convert("RGB")
    im.thumbnail((MAX_EDGE, MAX_EDGE))
    im.save(dest, "WEBP", quality=82, method=6)
    return im.size


def main():
    (OUT / "img").mkdir(parents=True, exist_ok=True)
    fields = ("id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,"
              "children{media_type,media_url,thumbnail_url}")
    page = get(f"{ig_user_id()}/media", fields=fields, limit=50)
    posts = []
    while True:
        for m in page.get("data", []):
            code = m["permalink"].rstrip("/").split("/")[-1]
            items = m.get("children", {}).get("data") or [m]
            files = []
            for n, c in enumerate(items, 1):
                src = c.get("thumbnail_url") if c.get("media_type") == "VIDEO" else c.get("media_url")
                if not src:
                    continue
                dest = OUT / "img" / f"{code}-{n}.webp"
                try:
                    w, h = Image.open(dest).size if dest.exists() else save(src, dest)
                except Exception as e:  # tek görsel inmezse devam
                    print(code, n, e)
                    continue
                files.append({"file": f"img/{dest.name}", "type": c.get("media_type"), "w": w, "h": h})
            posts.append({"code": code, "permalink": m["permalink"], "type": m["media_type"],
                          "timestamp": m["timestamp"], "caption": (m.get("caption") or "").strip(),
                          "files": files})
        nxt = page.get("paging", {}).get("next")
        if not nxt:
            break
        page = get(nxt)
    (OUT / "ig.json").write_text(json.dumps(posts, ensure_ascii=False, indent=1) + "\n")
    print(len(posts), "gönderi,", sum(len(p["files"]) for p in posts), "görsel")


if __name__ == "__main__":
    main()
