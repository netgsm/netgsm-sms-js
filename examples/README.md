# @netgsm/sms Örnekleri

Bu dizin, Netgsm SMS API'sini kullanmak için çeşitli örnekler içerir. Bu örnekler, API'nin temel ve gelişmiş özelliklerini nasıl kullanacağınızı göstermektedir.

## Başlamadan Önce

Örnekleri çalıştırmadan önce, aşağıdaki adımları tamamladığınızdan emin olun:

1. Netgsm hesabınızın olduğundan ve API erişiminizin etkinleştirildiğinden emin olun.
2. Netgsm kullanıcı kodunuzu ve şifrenizi hazır bulundurun.
3. Projeyi klonlayın ve bağımlılıkları yükleyin:

```bash
git clone https://github.com/netgsm/netgsm-sms-js.git
cd netgsm-sms-js
npm install
```

## Temel Örnekler

### [Temel Kullanım](./basic-usage.js)

Bu örnek, Netgsm SMS API'sinin temel kullanımını göstermektedir:

- SMS gönderme
- SMS raporlarını sorgulama
- Mesaj başlıklarını listeleme
- Bakiye sorgulama

Örneği çalıştırmak için:

```bash
node examples/basic-usage.js
```

## Gelişmiş Örnekler

### [Zamanlanmış SMS](./advanced/scheduled-sms.js)

Bu örnek, belirli bir tarih ve saatte gönderilecek SMS'lerin nasıl ayarlanacağını gösterir:

- Zamanlanmış SMS gönderme
- Zamanlanmış SMS'leri iptal etme
- Zamanlanmış SMS durumunu sorgulama

Örneği çalıştırmak için:

```bash
node examples/advanced/scheduled-sms.js
```

### [Toplu SMS](./advanced/bulk-sms.js)

Bu örnek, farklı alıcılara farklı mesajlar göndermeyi gösterir:

- Doğrudan liste ile toplu SMS gönderme
- CSV dosyasından toplu SMS gönderme
- Toplu SMS raporlarını sorgulama ve istatistikleri hesaplama

Örneği çalıştırmak için:

```bash
node examples/advanced/bulk-sms.js
```

### [Ek Örnekler](./advanced/additional-examples.js)

Bu örnek, Netgsm SMS API'sinin çeşitli kullanım senaryolarını göstermektedir:

- İleri tarihli mesaj gönderimi (ddMMyyyyHHmm formatında)
- Birden fazla numaraya gönderim
- Son tarihli SMS gönderimi (startdate ve stopdate ile)
- Türkçe karakter desteği ile gönderim
- İYS filtreli gönderim (Ticari içerikli bireysel, ticari içerikli tacir ve bilgilendirme amaçlı)

Örneği çalıştırmak için:

```bash
node examples/advanced/additional-examples.js
```

## Örnekleri Özelleştirme

Her örnek dosyasında, aşağıdaki bilgileri kendi bilgilerinizle değiştirmeniz gerekmektedir:

```javascript
const netgsm = new Netgsm({
  usercode: 'KULLANICI_KODUNUZ',
  password: 'PAROLANIZ',
  appName: 'UYGULAMA_ADINIZ' // İsteğe bağlı
});
```