"""Shopier mağazasındaki ürünleri siteye yazar.

GitHub Actions'ta çalışır (.github/workflows/shopier.yml). Shopier'in herkese
açık mağaza sayfasını okur; API anahtarı gerekmez.

Çıktılar:
  data/shopier.json        -> ürün listesi (ad, fiyat, stok, görsel, bağlantı)
  images/shop/<id>.webp    -> ürün görselleri (Shopier CDN'den indirilip küçültülür)
  magaza/index.html        -> <!-- SHOPIER:GRID --> ... <!-- /SHOPIER:GRID --> arası
                              ve <!-- SHOPIER:LD --> ... <!-- /SHOPIER:LD --> arası
  index.html               -> <!-- SHOPIER:STRIP --> ... <!-- /SHOPIER:STRIP --> arası

Sayfa okunamaz ya da hiç ürün çıkmazsa mevcut dosyalara dokunmadan hata verir;
site son çalışan listeyi göstermeye devam eder.
"""

import html
import io
import json
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image

SHOP = "edenfloralart"
STORE_URL = f"https://www.shopier.com/{SHOP}"
BASKET_URL = f"https://www.shopier.com/basket/{SHOP}"
ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "shopier.json"
IMG_DIR = ROOT / "images" / "shop"
MAX_EDGE = 900
STRIP_COUNT = 6
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
}


def fetch(url, binary=False):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read()
    return data if binary else data.decode("utf-8", "replace")


def parse_store(page):
    cards = re.findall(
        r'<div class="product-card shopier--product-card[^"]*">(.*?)</a></div>', page, re.S
    )
    out = []
    for c in cards:
        m_id = re.search(r'data-back-id="(\d+)"', c)
        m_url = re.search(r'href="(https://www\.shopier\.com/[^"]+)"', c)
        m_img = re.search(r'<img src="(https://cdn\.shopier\.app/[^"]+)"', c)
        m_name = re.search(r'<h3 class="shopier-store--store-product-card-title">\s*(.*?)\s*</h3>', c, re.S)
        m_price = re.search(r'data-price="([^"]+)"', c)
        if not (m_id and m_url and m_img and m_name and m_price):
            continue
        name = re.sub(r"\s+", " ", html.unescape(m_name.group(1))).strip()
        badges = re.findall(r'class="[^"]*badge[^"]*"[^>]*>\s*([^<]+?)\s*<', c)
        out.append({
            "id": m_id.group(1),
            "name": name,
            "url": m_url.group(1),
            "image_src": m_img.group(1).replace("/pictures_mid/", "/pictures_large/"),
            "price_text": m_price.group(1).replace(",00 TL", " TL").strip(),
            "price": parse_price(m_price.group(1)),
            "badge": badges[0].strip() if badges else "",
        })
    return out


def parse_price(t):
    # "16.000,00 TL" -> 16000.0
    num = re.sub(r"[^\d,]", "", t).replace(",", ".")
    try:
        return float(num)
    except ValueError:
        return None


def product_details(url):
    """Ürün sayfasından stok ve kısa açıklama."""
    page = fetch(url)
    stock = None
    m = re.search(r'"stock":(\d+)', page)
    if m:
        stock = int(m.group(1))
    desc = ""
    m = re.search(r'<meta property="og:description" content="([^"]*)"', page)
    if m:
        desc = re.sub(r"\s+", " ", html.unescape(m.group(1))).strip()
    return stock, desc


def save_webp(url, dest):
    im = Image.open(io.BytesIO(fetch(url, binary=True))).convert("RGB")
    im.thumbnail((MAX_EDGE, MAX_EDGE))
    im.save(dest, "WEBP", quality=80, method=6)
    return im.size


CAT_LABELS = {"lambader": "Lambader", "masa": "Masa lambası", "cicek": "Dev çiçek"}


def category(p):
    """Shopier kart verisinde kategori yok; ad ve fiyattan çıkarılır."""
    n = p["name"].upper()
    if any(k in n for k in ("LİLYUM", "LILYUM", "GÜL", "BABY")):
        return "cicek"
    if p["price"] and p["price"] <= 5000:
        return "masa"
    return "lambader"


def display_name(n):
    """'İKİLİ ORGANZE POLIN' -> 'İkili Organze Polin' (Türkçe büyük/küçük harf)."""
    n = re.sub(r"\s+", " ", n).strip()
    if n != n.upper():
        return n
    def word(w):
        # Türkçe kelimede (İ içeriyorsa) I = ı; ürün adlarında (POLIN, LUNARIA) I = i.
        low = (w.replace("I", "ı") if "İ" in w else w.replace("I", "i")).replace("İ", "i").lower()
        first = {"i": "İ" if "İ" in w else "I", "ı": "I"}.get(low[:1], low[:1].upper())
        return first + low[1:]
    return " ".join(word(w) for w in n.split(" "))


def esc(s):
    return html.escape(s, quote=True)


def short(s, n):
    s = s.strip()
    if len(s) <= n:
        return s
    cut = s[:n]
    i = cut.rfind(" ")
    return (cut[:i] if i > n // 2 else cut).rstrip(" ,.;:-") + "…"


def card(p, prefix, lazy=True):
    lazy_attr = 'loading="lazy" ' if lazy else ""
    name = display_name(p["name"])
    cat = category(p)
    badge_html = f'<span class="shop-badge">{esc(p["badge"])}</span>' if p["badge"] else ""
    link = (f'href="{esc(p["url"])}" target="_blank" rel="noopener" data-shop-id="{p["id"]}" '
            f'data-shop-name="{esc(name)}" data-shop-price="{p["price"] or ""}"')
    return (
        f'<article class="shop-card" data-cat="{cat}">'
        f'<div class="shop-img">'
        f'<img {lazy_attr}src="{prefix}{p["image"]}" width="{p["w"]}" height="{p["h"]}" '
        f'alt="{esc(name)}: Eden Floral Art el yapımı {esc(CAT_LABELS[cat].lower())}">{badge_html}'
        f'<a class="shop-add" {link} aria-label="{esc(name)}, sepete ekle"><span>Sepete ekle</span></a>'
        f'</div>'
        f'<div class="shop-meta"><h3 class="shop-name"><a {link} tabindex="-1">{esc(name)}</a></h3>'
        f'<p class="shop-price">{esc(p["price_text"])}</p></div>'
        f'<p class="shop-cat">{esc(CAT_LABELS[cat])}</p>'
        f"</article>"
    )


def ld_json(products):
    items = []
    for i, p in enumerate(products, 1):
        offer = {
            "@type": "Offer",
            "url": p["url"],
            "priceCurrency": "TRY",
            "availability": "https://schema.org/MadeToOrder",
            "seller": {"@id": "https://edenfloralart.com/#business"},
        }
        if p["price"]:
            offer["price"] = f'{p["price"]:.2f}'
        prod = {
            "@type": "Product",
            "name": display_name(p["name"]),
            "image": "https://edenfloralart.com/" + p["image"],
            "brand": {"@type": "Brand", "name": "Eden Floral Art"},
            "offers": offer,
        }
        if p["desc"]:
            prod["description"] = short(p["desc"], 300)
        items.append({"@type": "ListItem", "position": i, "item": prod})
    data = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": "https://edenfloralart.com/magaza/#urunler",
        "name": "Eden Floral Art satıştaki ürünler: lambader, masa lambası ve dev çiçekler",
        "numberOfItems": len(items),
        "itemListElement": items,
    }
    return '<script type="application/ld+json">\n' + json.dumps(data, ensure_ascii=False, indent=1) + "\n</script>"


def replace_block(path, tag, content):
    s = path.read_text(encoding="utf-8")
    pat = re.compile(rf"(<!-- {tag} -->)(.*?)(<!-- /{tag} -->)", re.S)
    if not pat.search(s):
        sys.exit(f"{path} içinde {tag} işaretleri yok.")
    new = pat.sub(lambda m: m.group(1) + "\n" + content + "\n" + m.group(3), s, count=1)
    if new != s:
        path.write_text(new, encoding="utf-8")


def main():
    products = parse_store(fetch(STORE_URL))
    if not products:
        sys.exit("Shopier sayfasından ürün okunamadı; mevcut liste korunuyor.")

    old = json.loads(DATA.read_text()) if DATA.exists() else {}
    old_by_id = {p["id"]: p for p in old.get("products", [])}
    IMG_DIR.mkdir(parents=True, exist_ok=True)

    for p in products:
        try:
            p["stock"], p["desc"] = product_details(p["url"])
        except Exception as e:  # tek ürün sayfası okunamazsa eski bilgiyle devam
            print(f"{p['id']}: ürün sayfası okunamadı ({e})")
            prev = old_by_id.get(p["id"], {})
            p["stock"], p["desc"] = prev.get("stock"), prev.get("desc", "")
        time.sleep(0.5)

        dest = IMG_DIR / f"{p['id']}.webp"
        prev = old_by_id.get(p["id"])
        if dest.exists() and prev and prev.get("image_src") == p["image_src"]:
            p["w"], p["h"] = Image.open(dest).size
        else:
            p["w"], p["h"] = save_webp(p["image_src"], dest)
        p["image"] = f"images/shop/{p['id']}.webp"

    keep = {f"{p['id']}.webp" for p in products}
    for f in IMG_DIR.glob("*.webp"):
        if f.name not in keep:
            f.unlink()

    fields = ["id", "name", "url", "price", "price_text", "stock", "badge", "desc", "image", "image_src", "w", "h"]
    clean = [{k: p.get(k) for k in fields} for p in products]
    if old.get("products") != clean:
        DATA.parent.mkdir(parents=True, exist_ok=True)
        DATA.write_text(json.dumps({
            "updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "store": STORE_URL, "basket": BASKET_URL, "products": clean,
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    grid = "\n".join(card(p, "../") for p in clean)
    replace_block(ROOT / "magaza" / "index.html", "SHOPIER:GRID", grid)
    replace_block(ROOT / "magaza" / "index.html", "SHOPIER:LD", ld_json(clean))
    replace_block(ROOT / "index.html", "SHOPIER:STRIP", "\n".join(card(p, "") for p in clean[:STRIP_COUNT]))
    print(f"{len(clean)} ürün yazıldı.")


if __name__ == "__main__":
    main()
