# Eden Floral Art - Tanıtım Sitesi

Tek sayfalık, statik (build gerektirmeyen) Türkçe tanıtım sitesi. Düz HTML + CSS + az miktarda vanilla JS.
Hareket katmanı için CDN'den Lenis ve GSAP/ScrollTrigger yüklenir; yüklenemezse site yine tam çalışır
(animasyonsuz). `prefers-reduced-motion` tercihine saygı duyar.

## Dosya yapısı

```
eden-site/
  index.html          Tüm içerik, SEO etiketleri, JSON-LD (Florist)
  assets/style.css    Tüm stiller
  assets/main.js      Scroll animasyonları, galeri, mıknatıslı butonlar
  images/*.webp       Galeri ve bölüm görselleri (Instagram'dan)
  images/og.jpg       Sosyal medya paylaşım görseli (1200x630)
  dogum-odasi-susu/index.html   Reklam açılış sayfası: doğum odası süsü
  nisan-susleme/index.html      Reklam açılış sayfası: nişan, söz, kına, düğün
  vitrin-tasarimi/index.html    Reklam açılış sayfası: vitrin (BIRELIN Nişantaşı çalışması)
  organizasyon/index.html       Reklam açılış sayfası: organizasyon firmaları (B2B)
  404.html            Bulunamayan adresler için sayfa (GitHub Pages bunu otomatik kullanır)
  favicon.svg, favicon-32.png, favicon.ico, apple-touch-icon.png   Simgeler (E monogramı)
  CNAME               GitHub Pages özel alan adı (edenfloralart.com)
  .nojekyll           GitHub Pages'in Jekyll işlemesini kapatır
  robots.txt          Arama motoru kuralları
  sitemap.xml         Site haritası
```

## Yayınlama (GitHub Pages)

Alan adı: `https://edenfloralart.com` (apex, www'suz). Canonical, og:url, sitemap, robots ve JSON-LD buna göre ayarlıdır.
`CNAME` ve `.nojekyll` dosyaları hazırdır; klasör yerelde git deposu olarak commit edilmiştir.

1. GitHub'da boş bir depo oluşturun (ör. `edenfloralart`), README/gitignore eklemeden.
2. Bu klasörde: `git remote add origin <depo-adresi>` ve `git push -u origin main`
3. Depoda Settings → Pages: Source "Deploy from a branch", Branch `main` / `/ (root)`. Custom domain alanı `edenfloralart.com` olmalı (CNAME dosyasından dolar).
4. Alan adı sağlayıcısında DNS: apex için dört A kaydı `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   (isteğe bağlı AAAA: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`).
   `www` için CNAME kaydı `<kullanici-adi>.github.io` (www adresi apex'e yönlenir).
5. DNS yayıldıktan sonra Pages ayarında "Enforce HTTPS" kutusunu işaretleyin (sertifika birkaç dakika-saat sürebilir).
6. Yerelde denemek için: `python3 -m http.server 8000`

Güncellemek için dosyaları değiştirip `git commit` + `git push` yeterlidir.

## Yayından önce güncellenecekler

1. **Görsel kalitesi:** Instagram'ın herkese açık görünümü en fazla ~640 px genişlik verdi. Fotoğraflar bu yüzden
   küçük çerçevelerde kullanıldı. Orijinal yüksek çözünürlüklü dosyaları `images/` altına aynı adlarla (webp)
   koyarsanız site hemen keskinleşir. `og.jpg` da büyütülmüş olduğundan orijinaliyle değiştirilmelidir.
2. **Adres/telefon:** JSON-LD'de bilinmediği için yok. Eklemek isterseniz `address` ve `telephone` alanlarını ekleyin.
   Profildeki "Atölye" harita bağlantısı (maps.app.goo.gl/ew2hRniWmJs75cL78) footer'a konuldu.

## Sahibinin onaylaması gereken noktalar (HTML içinde `TODO` yorumları)

- Sipariş için önerilen minimum süre (SSS 1)
- Kargo süresi/ücreti ve yerinde kurulum yapılan şehirler (SSS 2)
- Organizasyon firmalarına toptan fiyat / iş ortaklığı koşulları (hizmet kartı 03 ve SSS 4)
- Satış mı kiralama mı seçeneği (SSS 6)
- Referans bölümünde @zumicoevent ve @ginzadesignjewelry adlarının anılmasına izin (paylaşımlardan alındı)
- "Yorumlar" öne çıkanlarındaki gerçek müşteri yorumları okunamadı; eklenmedi. İsterseniz referans bölümüne eklenebilir.
- Fiyat veya teslim günü yazılmadı. Lambader indirim kodu (YAZ10) süreli olduğu için eklenmedi.

## Görsel kaynakları (Instagram gönderileri, @eden.floralart)

| Dosya | Gönderi |
|---|---|
| dogum-odasi.webp | /p/DeT1galCJs2 (doğum odası, @zumicoevent) |
| lilyum-dugun.webp | /p/Db0iqSViClj (Tekirdağ düğünü, lilyum) |
| vitrin-kose.webp | /reel/DeOa0rVoLVM (@ginzadesignjewelry vitrin/köşe, üst kısım kırpıldı) |
| polin-lambader.webp | /reel/DWf93INiE_f (organze POLIN lambader) |
| lambader-indirim.webp | /reel/DcIassIIqFn (lambader, üst kısım kırpıldı) |
| dandelion-lilyum.webp | /p/Dd3cSd-CFbe (lilyum ve karahindiba) |
| bahar-yosun.webp | /p/Dd_YC2ciM05 (yosun ve çiçek aranjmanı) |
| renk-sonbahar.webp | /p/Dd57cfRCCTC (sonbahara yakışan renk) |
| rengarenk.webp | /p/Ddqf-LyCEi_ (rengarenk çiçek modelleri) |
| ranunculus.webp | /reel/Dd8a5ybozkM (ranunculus, üst kısım kırpıldı) |
| katli-cicek.webp | /reel/Dd03N5moQTf (kat kat şakayık, üst kısım kırpıldı) |
| og.jpg | /p/Db0iqSViClj |

Metinlerde kullanılan gerçek ifadeler: "İstenilen renk ve modelde çalışabiliyoruz", "Her sene bir kaç çiçek ekleye
ekleye geldiğimiz sonuç", tül/krapon/organze, Shopier'de lambader, Viyana'dan bulan çiftin Tekirdağ düğünü.

## Reklam açılış sayfaları

Adresler: `/dogum-odasi-susu/`, `/nisan-susleme/`, `/vitrin-tasarimi/`, `/organizasyon/` (sitemap.xml'e eklendi, ana sayfadaki hizmet kartlarından bağlı).
Sayfalar Google Search reklam gruplarına göre anahtar kelimeli H1/title/description taşır; her birinde 4 fayda, mini galeri, SSS ve Instagram CTA vardır.
Sunucuda klasör adresleri (`/nisan-susleme/`) `index.html`'e düşecek şekilde yapılandırılmalıdır (çoğu statik barındırma bunu kendiliğinden yapar).

## Reklam izleme (Meta Pixel / Google tag)

Her sayfanın `<head>` kısmında yorum satırı halinde hazır bloklar var. Kullanmak için yorumu kaldırın ve `PIXEL_ID`, `AW-XXXX`, `G-XXXX` değerlerini doldurun
(`TODO` işaretli). `assets/main.js` içindeki kanca, Instagram CTA tıklamalarında yalnızca fonksiyonlar yüklüyse
`fbq('trackCustom','InstagramCTA')` ve `gtag('event','instagram_click')` çağırır. Çerez/KVKK onay bildirimi gerekebilir; eklenmedi.

## Ek görsel kaynakları

| Dosya | Gönderi |
|---|---|
| birelin-vitrin-1.webp, birelin-vitrin-2.webp | /p/DYrpEW4iJaA (BIRELIN Nişantaşı vitrin; yalnızca ilk görsel alınabildi, üzerindeki oynat simgesi yüzünden iki parçaya kırpıldı) |
