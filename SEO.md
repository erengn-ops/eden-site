# Eden Floral Art - SEO Rehberi

Son güncelleme: 12 Ekim 2026. Alan adı: https://edenfloralart.com (GitHub Pages).

## 1. Anahtar kelime haritası

Not: Arama hacmi verisi (Search Console / Google Ads Keyword Planner) elde yok; aşağıdaki seçimler ürün-niyet eşleşmesine göre yapıldı. Hacimleri Search Console "Performans" raporu dolunca doğrulayın.

| Sayfa | Birincil anahtar kelime | İkincil / uzun kuyruk | Not |
|---|---|---|---|
| `/` | dev çiçek | dev çiçek kiralama, dev kağıt çiçek, el yapımı dev çiçek, tül krapon organze çiçek, çiçek lambader, Eden Floral Art | Marka + kategori sayfası; alt sayfalara iç link |
| `/dogum-odasi-susu/` | doğum odası süsü | dev çiçek kiralama (metinde), hastane odası süsleme, hastane kapı süsü, bebek karşılama süsü, doğum odası kapı süsü, dev çiçek aranjmanı | Rekabet: hazır kapı süsü ürün sayfaları; fark: dev, el yapımı |
| `/nisan-susleme/` | nişan süsleme | dev çiçek kiralama, nişan süsü, söz süsleme, kına süsü, düğün çiçek dekoru, flower backdrop, çiçek fon, gelin-damat yolu çiçek, takı töreni arka fon | |
| `/vitrin-tasarimi/` | vitrin süsleme | dev çiçek kiralama, vitrin çiçek dekoru, mağaza vitrin tasarımı, vitrin dekorasyonu, mağaza köşe dekoru, ışıklı çiçek vitrin | B2B / mağaza sahibi niyeti |
| `/organizasyon/` | organizasyon çiçek dekoru | dev çiçek kiralama, organizasyon firmalarına dev çiçek, flower backdrop organizasyon, etkinlik çiçek dekoru, konsepte özel çiçek tasarımı | B2B |
| `/sosyal-medya/` | (ana dal sayfası, diğer ajan ekliyor) | Eden Floral Art Instagram, @eden.floralart | Sitemap'e eklendi; sayfa ana dalda yayınlanınca title/description/canonical/JSON-LD eklenmeli |
| Lambader (Shopier) | dev çiçek lambader | organze lambader, çiçek masa lambası | Site içinde ayrı sayfa yok; ana sayfada anılıyor. Ayrı sayfa açılırsa bu kelimeler için en iyi aday |

Satış ve kiralama ikisi de mevcut (sahibi onayladı, 12 Ekim 2026): "dev çiçek kiralama" ana sayfa, nişan, vitrin ve organizasyon sayfalarında "Kiralama veya satın alma" bölümü/SSS ile geçer; nişan, vitrin ve organizasyon meta description'larına da sığdığı yerde eklendi.

Kelime kullanım ilkesi: birincil kelime title, H1, meta description ve ilk paragrafta; ikincil kelimeler H2/H3 ve metin içinde doğal biçimde. Başlık/metin şişirilmedi.

## 2. Sayfa sayfa yapılan değişiklikler

- Her sayfada benzersiz `<title>` (en çok 60 karakter) ve meta description (140-160 karakter); `og:*` ve `twitter:*` aynı metne eşitlendi.
- Tek H1, birincil kelimeyle. Landing sayfalarına H2/H3'lü, 250-350 kelimelik bilgi bölümü eklendi (nedir, malzeme, boyut, sipariş adımları, iç linkler). Ana sayfaya "Dev çiçek nedir, nerelerde kullanılır?" bölümü eklendi.
- Canonical, `hreflang="tr"` + `x-default`, `og:locale tr_TR`, `<html lang="tr">`, `robots` meta (max-image-preview:large).
- Landing sayfalarında görünür breadcrumb (Ana sayfa / Sayfa) + BreadcrumbList.
- Yapısal veri (JSON-LD, `@graph`): Florist (alan adı: `/#business`, adres/telefon yok, `areaServed` Türkiye/TR, `sameAs` Instagram + Shopier), WebSite, WebPage, ImageObject (hero görseli), BreadcrumbList ve Service (landing sayfalar), FAQPage (sayfadaki gerçek SSS'den üretilir; ana sayfa dahil). `aggregateRating` / `review` yok.
- Performans: hero görseli `preload` + `fetchpriority="high"` (lazy değil), Google Fonts CSS bloklamadan yüklenir (`preload` + `media=print` takası, `noscript` yedekli), `preconnect` var; JS `defer`; görsellerde `width/height` var.
- `site.webmanifest` + `theme-color` eklendi. `robots.txt` ve `sitemap.xml` (lastmod'lu, `/sosyal-medya/` dahil) güncellendi.
- Alt metinler birkaç yerde anahtar kelime farkındalıklı ama doldurmadan güncellendi; görsel dosya adları değişmedi.

## 3. Sahibinin onaylaması gereken noktalar (HTML'de `TODO` yorumu)

Onaylananlar (12 Ekim 2026): sipariş zamanı (genellikle 2–3 hafta önce), üretim süresi (işe/tasarıma göre 1–3 hafta), kargo (yalnız kargo süresi: Türkiye geneli en fazla 3–4 gün, üretim buna dahil değil; ücret paket boyutuna göre), boyut (tasarıma göre değişir, kişiye/mekâna özel), satış ve kiralama (ikisi de), organizasyon firmaları için kiralama veya satın alma, BIRELIN / @ginzadesignjewelry / @zumicoevent adlarının anılma izni.

Hâlâ açık:

- Yerinde kurulum yapılan şehirler.
- Bakım/saklama önerisi ve tekrar kullanım ("solmaz, tozdan ve nemden uzak saklayın" gibi genel öneriler yazıldı; onaylayın).
- Organizasyon firmalarına toptan/düzenli sipariş koşulları (kiralama veya satın alma modeliyle çalışıldığı onaylandı).
- Vitrin sezonluk yenileme / şehir dışı montaj.
- Adres/telefon eklenirse JSON-LD `address` / `telephone` alanları eklenmeli (şimdilik yok).

## 4. Google Search Console ve Bing Webmaster Tools (HTML etiketi yöntemi)

Doğrulama etiketi henüz eklenmedi (yer tutucu yok). Adımlar:

**Google Search Console**
1. https://search.google.com/search-console adresine girin, "Mülk ekle" → **URL öneki** seçeneğine `https://edenfloralart.com/` yazın (Alan adı seçeneği DNS kaydı ister; HTML etiketi yalnız URL öneki ile çıkar).
2. Doğrulama yöntemi olarak **HTML etiketi**ni seçin. Verilen `<meta name="google-site-verification" content="...">` değerini bize iletin; ana sayfanın (`index.html`) `<head>` kısmına eklenir.
3. Siteyi yayınlayın (push), sonra Search Console'da **Doğrula**'ya basın.
4. Sol menü **Site Haritaları** → `sitemap.xml` yazıp **Gönder**.
5. **URL Denetimi**'nde dört landing sayfasını ve ana sayfayı tek tek denetleyip "Dizine eklenmesini iste" deyin.

**Bing Webmaster Tools**
1. https://www.bing.com/webmasters → Search Console'dan içe aktarma varsa en kolayı odur; yoksa "Siteyi ekle" → `https://edenfloralart.com/`.
2. Doğrulamada **HTML Meta Tag** yöntemini seçin; `<meta name="msvalidate.01" content="...">` değerini bize iletin, aynı `<head>`'e eklenir.
3. Yayından sonra **Doğrula**, ardından **Site Haritaları** → `https://edenfloralart.com/sitemap.xml` gönderin.

Sonrasında izlenecekler: Kapsam (Dizine eklenen sayfa sayısı), Performans (sorgular: "doğum odası süsü", "nişan süsleme" vb. ve konum), Geliştirmeler (Breadcrumb, SSS), Core Web Vitals (birkaç hafta veri sonra).

Yapısal veriyi doğrulamak için: https://search.google.com/test/rich-results ve https://validator.schema.org (her landing URL'sini yayından sonra deneyin).

## 5. Google İşletme Profili (Google Business Profile)

Henüz oluşturulmadı; öneriler:

- İşletme türü: hizmet alanı işletmesi (service-area business). Adres ve müşteri ziyareti yoksa **adresi gizleyin**; "Müşterilere adresimde hizmet vermiyorum" seçeneğini işaretleyin. Sahibi adres göstermek isterse atölye adresi ayrı karar (sitede harita bağlantısı zaten footer'da).
- Hizmet alanı: Türkiye geneli kargo olsa da GBP hizmet alanı en çok 20 bölge/şehirle sınırlıdır; fiilen yerinde hizmet verilen şehirleri seçin (TODO sahibi).
- Ana kategori için "Çiçekçi" mi yoksa "Etkinlik dekorasyon / parti malzemeleri" mi daha uygun, Google'ın kategori listesinden seçin; ek kategorilere dev çiçek, vitrin dekoru gibi karşılıkları ekleyin. Adı değiştirmeyin: tam olarak "Eden Floral Art".
- Web sitesi: `https://edenfloralart.com/`; ek bağlantılar: Instagram ve Shopier. Telefon yoksa boş bırakılabilir; mesajlaşma/Instagram bağlantısını açıklamada belirtin.
- Hizmetler bölümüne dört landing sayfasının adlarını (doğum odası süsü, nişan süsleme, vitrin süsleme, organizasyon) ekleyin; fiyat yazmayın ya da "DM'den teklif" notu düşün.
- Fotoğraflar: sitedeki gerçek iş fotoğrafları. Sahte yorum yok; gerçek müşterilerden yorum isteyin.
- Doğrulama (video / posta kodu vb.) Google'ın istediği yöntemle sahibi tarafından yapılır.

## 6. Sonraki adımlar (öneri)

- Lambader için ayrı bir landing sayfası (`/lambader/`): "dev çiçek lambader" kelimesi şu an yalnız ana sayfada.
- Sitedeki görsel kalitesi eski olan dosyalar (README'de listeli) yenilendiğinde LCP ve görsel arama için kazanç.
- Search Console verisi gelince title/description'ları tıklama oranına göre ayarlayın.
- İç link: ana sayfa hizmet kartları ve landing sayfaların "Diğer hizmetler" bağlantıları zaten karşılıklı; `/sosyal-medya/` sayfası yayında olunca ona da link verin.
