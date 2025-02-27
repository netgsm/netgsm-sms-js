# Değişiklik Günlüğü

Bu projede yapılan tüm önemli değişiklikler bu dosyada belgelenecektir.

Format [Keep a Changelog](https://keepachangelog.com/tr-TR/1.0.0/) standardını takip etmektedir ve bu proje [Semantic Versioning](https://semver.org/spec/v2.0.0.html) kullanmaktadır.

## [1.1.2] - 2025-02-27

### Eklendi
- `checkBalance` metodu için `appkey` parametresi desteği

### Düzeltildi
- Entegrasyon testlerindeki sözdizimi hataları giderildi

## [1.1.1] - 2025-02-27

### Değiştirildi
- Dokümantasyon iyileştirmeleri
- Tip tanımları güncellendi

## [1.1.0] - 2025-02-26

### Eklendi
- REST v2 API desteği
- `sendRestSms` metodu
- `getReport` metodu
- `getHeaders` metodu
- `getInbox` metodu
- `cancelSms` metodu
- `checkBalance` metodu

### Değiştirildi
- Hata işleme mekanizması iyileştirildi
- TypeScript tip tanımları geliştirildi

### Kullanımdan Kaldırıldı
- `sendSms` metodu (yerine `sendRestSms` kullanın)
- `fetchSmsReport` metodu (yerine `getReport` kullanın)
- `queryHeaders` metodu (yerine `getHeaders` kullanın)

## [1.0.0] - 2025-02-20

### Eklendi
- İlk kararlı sürüm
- SMS gönderme desteği
- SMS raporu sorgulama
- Başlık sorgulama
- Temel hata işleme
- TypeScript desteği 