# Katkıda Bulunma Rehberi

@netgsm/sms projesine katkıda bulunmak istediğiniz için teşekkür ederiz! Bu rehber, projeye katkıda bulunmak isteyenler için adım adım talimatlar içerir.

## İçindekiler

- [Davranış Kuralları](#davranış-kuralları)
- [Nasıl Katkıda Bulunabilirim?](#nasıl-katkıda-bulunabilirim)
- [Geliştirme Ortamı Kurulumu](#geliştirme-ortamı-kurulumu)
- [Geliştirme Süreci](#geliştirme-süreci)
- [Kod Standartları](#kod-standartları)
- [Pull Request Süreci](#pull-request-süreci)
- [Test Yazma](#test-yazma)
- [Dokümantasyon](#dokümantasyon)
- [Sürüm Oluşturma](#sürüm-oluşturma)
- [Sorun Bildirme](#sorun-bildirme)
- [Lisans](#lisans)

## Davranış Kuralları

Bu proje [Katkıda Bulunanlar Sözleşmesi](./CODE_OF_CONDUCT.md) ile yönetilmektedir. Projeye katkıda bulunarak bu kurallara uymayı kabul etmiş olursunuz.

## Nasıl Katkıda Bulunabilirim?

Projeye katkıda bulunmanın birçok yolu vardır:

- **Hata Raporları**: Bulduğunuz hataları bildirin
- **Özellik İstekleri**: Yeni özellik önerilerinde bulunun
- **Kod Katkıları**: Hata düzeltmeleri veya yeni özellikler ekleyin
- **Dokümantasyon**: Dokümantasyonu iyileştirin veya genişletin
- **Örnekler**: Yeni kullanım örnekleri ekleyin
- **Testler**: Test kapsamını artırın

## Geliştirme Ortamı Kurulumu

1. Projeyi fork edin
2. Repoyu klonlayın: `git clone https://github.com/[KULLANICI_ADINIZ]/netgsm-sms-js.git`
3. Proje dizinine gidin: `cd netgsm-sms-js`
4. Bağımlılıkları yükleyin: `npm install`
5. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değişkenleri doldurun:
   ```
   NETGSM_USERCODE=your_usercode
   NETGSM_PASSWORD=your_password
   NETGSM_HEADER=your_message_header
   NETGSM_RECIPIENT=your_test_phone_number
   ```

### Geliştirme Komutları

- `npm run build`: TypeScript kodunu derler
- `npm test`: Tüm testleri çalıştırır
- `npm run test:unit`: Sadece birim testlerini çalıştırır
- `npm run test:integration`: Sadece entegrasyon testlerini çalıştırır
- `npm run lint`: Kod kalitesini kontrol eder
- `npm run lint:fix`: Kod kalitesi sorunlarını otomatik düzeltir

## Geliştirme Süreci

1. Yeni bir branch oluşturun:
   - Özellik için: `git checkout -b feature/yeni-ozellik`
   - Hata düzeltmesi için: `git checkout -b fix/hata-duzeltme`
   - Dokümantasyon için: `git checkout -b docs/dokumantasyon-guncelleme`

2. Değişikliklerinizi yapın

3. Testleri çalıştırın: `npm test`

4. Değişikliklerinizi commit edin:
   - Özellik için: `git commit -m "feat: yeni özellik eklendi"`
   - Hata düzeltmesi için: `git commit -m "fix: hata düzeltildi"`
   - Dokümantasyon için: `git commit -m "docs: dokümantasyon güncellendi"`

5. Branch'inizi push edin: `git push origin feature/yeni-ozellik`

6. Pull Request oluşturun

### Commit Mesajları

Commit mesajlarınızı [Conventional Commits](https://www.conventionalcommits.org/) formatına uygun olarak yazın:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Yaygın tipler:
- `feat`: Yeni bir özellik
- `fix`: Bir hata düzeltmesi
- `docs`: Sadece dokümantasyon değişiklikleri
- `style`: Kod davranışını etkilemeyen değişiklikler (boşluk, biçimlendirme, vb.)
- `refactor`: Hata düzeltmesi veya özellik eklemeyen kod değişiklikleri
- `test`: Test ekleme veya düzeltme
- `chore`: Yapılandırma, derleme süreci vb. değişiklikler

## Kod Standartları

- TypeScript tip tanımlarını doğru şekilde kullanın
- Tüm yeni özellikler için test ekleyin
- Mevcut testleri geçtiğinden emin olun
- Kodunuzu ESLint ve Prettier ile biçimlendirin
- Açıklayıcı commit mesajları kullanın
- Kodunuzu açıklayıcı yorumlarla belgelendirin (JSDoc formatında)
- Karmaşık işlevler için açıklama ekleyin

### Kod Stili

Bu proje ESLint ve Prettier kullanarak kod stilini standartlaştırır:

- Girintiler için 2 boşluk kullanın
- Satır sonlarında noktalı virgül kullanın
- Maksimum satır uzunluğu 100 karakter
- Tek tırnak yerine çift tırnak kullanın
- Değişken isimleri için camelCase kullanın
- Sınıf isimleri için PascalCase kullanın
- Sabitler için UPPER_SNAKE_CASE kullanın

## Pull Request Süreci

1. PR açmadan önce kodunuzu güncel `main` branch'i ile birleştirin
2. PR açıklamasında değişikliklerinizi detaylı olarak açıklayın
3. PR'ınızın CI testlerini geçtiğinden emin olun
4. İnceleme geri bildirimlerini uygulayın
5. PR'ınız onaylandıktan sonra, proje yöneticileri tarafından birleştirilecektir

### PR Şablonu

PR oluştururken [PR şablonunu](./PULL_REQUEST_TEMPLATE.md) kullanın ve tüm gerekli bilgileri doldurun.

## Test Yazma

- Birim testleri `__tests__/unit` dizinine ekleyin
- Entegrasyon testleri `__tests__/integration` dizinine ekleyin
- Test kapsamını en az %90 seviyesinde tutun
- Her test dosyası için açıklayıcı isimler kullanın (örn. `netgsm.test.ts`)
- Her test için açıklayıcı açıklamalar ekleyin

### Test Örnekleri

```typescript
describe('Netgsm.sendSms', () => {
  it('should send SMS successfully', async () => {
    // Test kodunuz
  });

  it('should handle API errors correctly', async () => {
    // Test kodunuz
  });
});
```

## Dokümantasyon

- Tüm public API'ler için JSDoc yorumları ekleyin
- README.md dosyasını güncel tutun
- Yeni özellikler için kullanım örnekleri ekleyin
- API değişiklikleri için CHANGELOG.md dosyasını güncelleyin

## Sürüm Oluşturma

Sürüm oluşturma işlemi proje yöneticileri tarafından yapılır. Sürüm numaralandırması [Semantic Versioning](https://semver.org/) kurallarına göre yapılır:

- MAJOR: Geriye dönük uyumsuz API değişiklikleri
- MINOR: Geriye dönük uyumlu yeni özellikler
- PATCH: Geriye dönük uyumlu hata düzeltmeleri

## Sorun Bildirme

Bir hata veya özellik isteği bildirmek için:

1. GitHub Issues bölümünü kullanın
2. Uygun şablonu seçin (hata raporu veya özellik isteği)
3. Tüm gerekli bilgileri sağlayın:
   - Hata raporları için: Yeniden üretme adımları, beklenen davranış, gerçek davranış, ortam bilgileri
   - Özellik istekleri için: Kullanım senaryosu, önerilen çözüm, alternatifler
4. Mümkünse yeniden üretme adımları veya kod örnekleri ekleyin

## Lisans

Katkıda bulunarak, katkılarınızın projenin lisansı (MIT) altında lisanslanacağını kabul etmiş olursunuz. 