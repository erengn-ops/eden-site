"""Instagram gönderilerini Graph API'den çekip siteye yazar.

GitHub Actions'ta çalışır (.github/workflows/instagram.yml). IG_TOKEN ortam
değişkeni gerekir: Instagram hesabına bağlı Facebook Sayfası için alınmış,
instagram_basic + pages_show_list + pages_read_engagement izinli token.

Çıktılar:
  data/instagram.json      -> /sosyal-medya/ sayfası bunu okur
  images/ig/<id>.webp      -> gönderi görselleri (Instagram CDN linkleri süreli
                              olduğu için indirilip saklanır)
"""

import io
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image

API = "https://graph.facebook.com/v21.0"
ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "instagram.json"
IMG_DIR = ROOT / "images" / "ig"
MAX_POSTS = 24
MAX_EDGE = 1080


def get(path, **params):
    params["access_token"] = os.environ["IG_TOKEN"]
    url = f"{API}/{path}?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.load(r)


def find_ig_user_id():
    if os.environ.get("IG_USER_ID"):
        return os.environ["IG_USER_ID"]
    pages = get("me/accounts", fields="instagram_business_account{id,username}")
    for page in pages.get("data", []):
        ig = page.get("instagram_business_account")
        if ig and ig.get("username") == "eden.floralart":
            return ig["id"]
    sys.exit("eden.floralart Instagram hesabı bu token ile bulunamadı.")


def save_webp(url, dest):
    with urllib.request.urlopen(url, timeout=60) as r:
        im = Image.open(io.BytesIO(r.read()))
    im = im.convert("RGB")
    im.thumbnail((MAX_EDGE, MAX_EDGE))
    im.save(dest, "WEBP", quality=80, method=6)
    return im.size


def main():
    if not os.environ.get("IG_TOKEN"):
        print("IG_TOKEN tanımlı değil; senkron atlandı.")
        return
    ig_id = find_ig_user_id()
    profile = get(ig_id, fields="username,biography,profile_picture_url")
    media = get(
        f"{ig_id}/media",
        fields="id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
        limit=MAX_POSTS,
    )

    IMG_DIR.mkdir(parents=True, exist_ok=True)
    old = json.loads(DATA.read_text()) if DATA.exists() else {}

    avatar = old.get("profile", {}).get("avatar", "/images/ig/avatar.webp")
    if profile.get("profile_picture_url"):
        save_webp(profile["profile_picture_url"], IMG_DIR / "avatar.webp")
        avatar = "/images/ig/avatar.webp"

    posts = []
    for m in media.get("data", []):
        src = m.get("thumbnail_url") if m["media_type"] == "VIDEO" else m.get("media_url")
        if not src:
            continue
        dest = IMG_DIR / f"{m['id']}.webp"
        if dest.exists():
            w, h = Image.open(dest).size
        else:
            w, h = save_webp(src, dest)
        posts.append({
            "id": m["id"],
            "permalink": m["permalink"],
            "type": m["media_type"],
            "caption": (m.get("caption") or "").strip(),
            "image": f"/images/ig/{m['id']}.webp",
            "w": w,
            "h": h,
            "timestamp": m["timestamp"],
        })

    if not posts:
        sys.exit("API boş liste döndü; mevcut veri korunuyor.")

    bio = [line for line in (profile.get("biography") or "").splitlines() if line.strip()]
    out = {
        "updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "profile": {
            "username": profile.get("username", "eden.floralart"),
            "bio": bio or old.get("profile", {}).get("bio", []),
            "avatar": avatar,
        },
        "posts": posts,
    }

    # Gönderiler değişmediyse dosyaya dokunma, boş commit olmasın.
    if old.get("posts") == posts and old.get("profile") == out["profile"]:
        print("Değişiklik yok.")
        return

    DATA.parent.mkdir(parents=True, exist_ok=True)
    DATA.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")

    keep = {f"{p['id']}.webp" for p in posts} | {"avatar.webp"}
    for f in IMG_DIR.glob("*.webp"):
        if f.name not in keep and f.stem.isdigit():
            f.unlink()

    print(f"{len(posts)} gönderi yazıldı.")


if __name__ == "__main__":
    main()
