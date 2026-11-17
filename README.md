# Rescate desde Turquía — web sitesi

Türkiye'deki barınaklardan kurtarılan köpeklerin Barcelona'da sahiplendirilmesi için hazırlanan, İspanyolca ve İngilizce iki dilli statik web sitesi.

- 19 sayfa × 2 dil = 38 HTML sayfası (`/es/...` ve `/en/...`)
- Ana sayfa, Nosotros, Adoptar, Historias, Blog, Contacto
- 7 köpek profil sayfası (fotoğraf galerili)
- 4 blog yazısı (her biri ayrı sayfa, SEO başlık ve açıklamalarıyla)
- Gizlilik politikası ve yasal uyarı (Aviso legal) sayfaları
- İletişim formu ve bülten aboneliği (Web3Forms ile e-postaya iletilir)
- Framework yok: saf HTML + CSS + biraz JavaScript. Derleme betiğinin hiçbir bağımlılığı yok.

## Gereksinimler

- [Node.js](https://nodejs.org) 18 veya üzeri

## Hızlı başlangıç

```bash
npm install      # yalnızca yerel önizleme sunucusu (serve) için
npm run dev      # siteyi derler ve http://localhost:3000 adresinde açar
```

Yalnızca derlemek için:

```bash
npm run build    # çıktı: dist/
```

ZIP'in içinde hazır derlenmiş bir `dist/` klasörü de var. Hiçbir şey kurmadan bu klasörü doğrudan bir barındırma servisine yükleyebilirsiniz. Ancak formların çalışması için önce aşağıdaki ayarı yapıp yeniden derlemeniz gerekir.

## Klasör yapısı

```
build.mjs              Derleme betiği: şablonları + metinleri dist/es ve dist/en'e çevirir
site.config.json       Site adresi ve form ayarları (gizli bilgi içermez)
package.json
netlify.toml           Netlify için hazır ayar
public/                Olduğu gibi kopyalanan dosyalar (favicon, site.webmanifest)
src/
  pages.json           Sayfa listesi, her dil için <title> ve meta açıklama
  templates/*.html     Sayfa gövdeleri. Metinler {{t.anahtar}} ya da {{a.anahtar}} olarak yer alır
  i18n/es.json         İspanyolca metinler (tüm sayfalarda ortak)
  i18n/en.json         İngilizce metinler
  articles/*.json      Blog yazılarının metinleri ({ "es": {...}, "en": {...} })
  assets/css/site.css  Ortak stiller, animasyonlar, hover efektleri
  assets/js/main.js    İletişim formu, bülten, köpek galerisi
  assets/img/          Tüm görseller (WebP; logolar PNG)
  assets/og/           Sosyal medya paylaşım görselleri (1200×630 JPEG)
dist/                  Derlenmiş site (npm run build ile yeniden oluşturulur)
```

## Metinleri düzenleme

- Bir metni değiştirmek için `src/i18n/es.json` ve `src/i18n/en.json` dosyalarındaki ilgili anahtarı güncelleyin. Örneğin ana sayfa başlığı `aboutTitle` anahtarındadır.
- Blog yazılarının metinleri `src/articles/<yazı>.json` dosyalarındadır.
- Sayfa başlıkları (`<title>`) ve arama motoru açıklamaları `src/pages.json` dosyasındadır.
- Değişiklikten sonra `npm run build` çalıştırın.
- Bir anahtar eksikse derleme hata verir ve eksik anahtarı listeler.

Köşeli parantez içindeki metinler (ör. `[Escribe aquí la respuesta]`, `[Fecha]`) doldurulması gereken yer tutuculardır.

## Formları e-postaya bağlama (Web3Forms)

İletişim formu ve bülten kayıtları [Web3Forms](https://web3forms.com) üzerinden **rescatedesdeturquia@gmail.com** adresine gönderilir. Bu adres sitede hiçbir yerde görünmez. Web3Forms'un "access key" değeri herkese açık olacak şekilde tasarlanmıştır; yine de bu pakete eklenmemiştir.

1. https://web3forms.com adresine gidin ve **rescatedesdeturquia@gmail.com** yazarak bir Access Key oluşturun. Anahtar bu adrese e-postayla gelir.
2. Anahtarı `site.config.json` dosyasına yazın:
   ```json
   { "web3formsAccessKey": "BURAYA-ANAHTAR" }
   ```
   Alternatif olarak barındırma servisinde `WEB3FORMS_ACCESS_KEY` ortam değişkeni tanımlayabilirsiniz.
3. `npm run build` çalıştırın ve yeniden yayınlayın.

Anahtar yokken formlar mesaj göndermez ve ziyaretçiye "gönderilemedi" uyarısı gösterir.

Gelen e-postalarda şu alanlar bulunur: ad, e-posta, telefon, konu (sahiplenme / yardım / diğer), ilgilenilen köpek, mesaj ve dil. Spam'e karşı gizli bir "botcheck" alanı eklidir.

### Bülten (isteğe bağlı: Brevo veya Mailchimp)

- **Varsayılan davranış:** Her yeni abone, "Nueva suscripción al boletín" başlığıyla aynı Gmail adresine e-posta olarak gelir. Bu yalnızca abone listesini toplamaya yarar.
- **Toplu bülten göndermek için:** Abonelere toplu e-posta atmak ve "abonelikten çık" bağlantısını yönetmek için bir bülten aracı kullanın (ör. [Brevo](https://www.brevo.com) veya Mailchimp):
  1. Araçta bir liste ve gömülü (embedded) bir abonelik formu oluşturun.
  2. Formun `action` adresini (URL) kopyalayın.
  3. Bu adresi `site.config.json` içine `"newsletterAction": "https://..."` olarak ya da `NEWSLETTER_ACTION` ortam değişkeni olarak ekleyin.
  4. Site e-postayı `EMAIL` alanıyla bu adrese gönderir. Alan adının aracınızın formuyla eşleştiğinden emin olun.

## Yayınlama

Alan adı `site.config.json` içinde ayarlı: `"siteUrl": "https://www.rescatedesdeturquia.com"`. Derleme bu adresle şunları üretir:

- canonical bağlantılar
- `hreflang` dil bağlantıları
- Open Graph görsel adresleri
- `sitemap.xml` ve `robots.txt`

### Netlify (önerilen)

1. Bu klasörü bir GitHub deposuna yükleyin.
2. Netlify'da **Add new site → Import from Git** ile depoyu seçin. `netlify.toml` hazırdır: derleme komutu `npm run build`, yayın klasörü `dist`.
3. **Site settings → Environment variables** bölümüne `WEB3FORMS_ACCESS_KEY`, isterseniz `SITE_URL` ve `NEWSLETTER_ACTION` ekleyin.
4. Alan adınızı **Domain management** bölümünden bağlayın.

Git kullanmadan da yayınlayabilirsiniz: `npm run build` sonrası `dist/` klasörünü Netlify'ın "Deploy manually" alanına sürükleyip bırakın.

### Diğer seçenekler

`dist/` klasörü düz statik dosyalardan oluşur. Vercel, Cloudflare Pages, GitHub Pages ya da herhangi bir FTP'li barındırmaya olduğu gibi yüklenebilir. Vercel / Cloudflare Pages ayarları:

- Build command: `npm run build`
- Output directory: `dist`

## Adres yapısı

| Sayfa | İspanyolca | İngilizce |
|---|---|---|
| Ana sayfa | https://www.rescatedesdeturquia.com/es/ | https://www.rescatedesdeturquia.com/en/ |
| Nosotros | /es/nosotros.html | /en/nosotros.html |
| Adoptar | /es/adoptar.html | /en/adoptar.html |
| Historias | /es/historias.html | /en/historias.html |
| Blog | /es/blog.html | /en/blog.html |
| Blog yazıları | /es/blog-guia-adopcion.html, /es/blog-test-rabia.html, /es/blog-salud-documentos.html, /es/blog-primeros-dias.html | aynı adlar /en/ altında |
| Köpek profilleri | /es/bruno.html, /es/ayda.html, /es/maya.html, /es/charlie.html, /es/suzi.html, /es/thor.html, /es/zoren.html | aynı adlar /en/ altında |
| Contacto | /es/contacto.html | /en/contacto.html |
| Gizlilik | /es/privacidad.html | /en/privacidad.html |
| Yasal uyarı | /es/aviso-legal.html | /en/aviso-legal.html |

Kök adres https://www.rescatedesdeturquia.com/ ziyaretçiyi diline göre `/es/` veya `/en/` adresine yönlendirir. Site haritası: https://www.rescatedesdeturquia.com/sitemap.xml (yayınladıktan sonra Google Search Console'a ekleyin).

Alan adını Netlify'a bağlarken hem `www.rescatedesdeturquia.com` hem `rescatedesdeturquia.com` ekleyin ve `www` olanı ana alan adı (primary domain) yapın. Böylece www'suz adres www'lu adrese yönlenir.

## Yasal sayfalar — doldurulması gerekenler

`src/articles/privacidad.json` ve `src/articles/aviso-legal.json` dosyalarında şu alanlar yer tutucu olarak duruyor: `[Nombre y apellidos de la persona responsable]`, `[NIF o NIE]`, `[Dirección postal]`. Proje henüz dernek olarak kurulmadığı için metinler "henüz dernek olarak kurulmamış bir gönüllü projesi" olarak yazıldı ve sorumlu kişi bir gerçek kişi olarak tanımlandı. Dernek kurulduğunda bu bölümleri derneğin resmi adı, NIF'i, adresi ve sicil numarasıyla güncelleyin. Hangi bilgilerin zorunlu olduğu (özellikle kişisel NIF/NIE ve adresin yayınlanması) faaliyetin niteliğine göre değişebilir; yayından önce bir hukuk uzmanına danışmanız önerilir.

## Teknik SEO

Derleme her sayfa için otomatik olarak şunları üretir:

- **Etiketler:** Benzersiz `<title>` ve meta açıklama (ES/EN ayrı), `lang` özelliği, `robots` etiketi.
- **Adresler:** Her sayfanın tam adresiyle `canonical` bağlantısı ve `hreflang` (es, en, x-default) bağlantıları.
- **Sosyal paylaşım:** Open Graph ve Twitter etiketleri. Her sayfanın kendi 1200×630 paylaşım görseli var (`src/assets/og/`).
- **Yapılandırılmış veri (JSON-LD):**
  - Ana sayfa: `Organization` ve `WebSite` (Instagram hesabı dahil).
  - Alt sayfalar: `BreadcrumbList`.
  - Blog yazıları: `BlogPosting`.
- **Site haritası ve robots:** `sitemap.xml` tüm sayfaları dil eşleşmeleriyle listeler; `robots.txt` site haritasını gösterir.
- **404 ve manifest:** `404.html` (Netlify, Vercel ve Cloudflare Pages bunu otomatik kullanır) ve `site.webmanifest`.
- **Görseller:**
  - WebP formatında.
  - Her görselde `width`/`height` var; sayfa yüklenirken kayma olmaz.
  - Ekranın altındaki görseller tembel yüklenir (`loading="lazy"`).
  - Hero görseli önceden yüklenir.
- **Netlify ayarları (`netlify.toml`):** Görseller için önbellek, temel güvenlik başlıkları ve `rescatedesdeturquia.com` → `www.rescatedesdeturquia.com` 301 yönlendirmesi.

Yayından sonra yapılacaklar (hesap gerektiği için sizin yapmanız gerekir):

1. [Google Search Console](https://search.google.com/search-console)'a alan adını ekleyip doğrulayın ve `https://www.rescatedesdeturquia.com/sitemap.xml` adresini gönderin.
2. İsterseniz Bing Webmaster Tools'a da aynı site haritasını ekleyin.
3. Paylaşım önizlemesini kontrol edin: bir sayfa linkini WhatsApp veya Instagram'da paylaşınca görsel ve başlık görünmelidir.
4. Yeni bir blog yazısı eklerken `src/pages.json` içinde `"type": "article"` ve `"datePublished"` alanlarını doldurun; bir yazıyı güncellediğinizde `"dateModified"` ekleyin.

## Notlar

- Yazı tipleri (Bricolage Grotesque, DM Sans) Google Fonts'tan yüklenir.
- Kaydırma animasyonları CSS'in `animation-timeline: view()` özelliğini kullanır. Desteklemeyen tarayıcılarda içerik animasyonsuz ama eksiksiz görünür. "Hareketi azalt" ayarı açık olan ziyaretçilere animasyon gösterilmez.
- Kök adres (`/`) ziyaretçiyi tarayıcı diline göre `/es/` ya da `/en/` sayfasına yönlendirir. Varsayılan dil İspanyolcadır.
- Yeni bir köpek eklemek için şu adımları izleyin:
  1. Mevcut bir profil şablonunu kopyalayın (ör. `src/templates/bruno.html`).
  2. Fotoğrafları `src/assets/img/` klasörüne koyun.
  3. Metinleri `src/i18n/*.json` dosyalarına ekleyin.
  4. Sayfayı `src/pages.json` içine kaydedin.
  5. Kartı `adoptar.html` ve `index.html` şablonlarına ekleyin.
