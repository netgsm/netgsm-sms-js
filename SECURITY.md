# Güvenlik Politikası

## Desteklenen Sürümler

Aşağıdaki sürümler şu anda güvenlik güncellemeleri ile desteklenmektedir:

| Sürüm | Destekleniyor |
| ----- | ------------- |
| 1.1.x | :white_check_mark: |
| 1.0.x | :x: |

## Güvenlik Açığı Bildirme

@netgsm/sms projesinde bir güvenlik açığı bulduysanız, lütfen bunu halka açık bir şekilde bildirmek yerine doğrudan proje yöneticilerine bildirin. Güvenlik açıklarını aşağıdaki adımları izleyerek bildirebilirsiniz:

1. Güvenlik açığının ayrıntılarını içeren bir e-posta gönderin.
2. Güvenlik açığının nasıl yeniden üretilebileceğini açıklayın.
3. Mümkünse, güvenlik açığını gidermek için önerilen bir çözüm veya geçici çözüm sağlayın.

Güvenlik açığı bildiriminizi aldıktan sonra:

1. Bildirimi aldığımızı size bildireceğiz.
2. Güvenlik açığını doğrulayacağız.
3. Düzeltme için bir zaman çizelgesi belirleyeceğiz.
4. Düzeltme yayınlandığında sizi bilgilendireceğiz.

## Güvenlik En İyi Uygulamaları

@netgsm/sms kütüphanesini kullanırken aşağıdaki güvenlik en iyi uygulamalarını izlemenizi öneririz:

1. Her zaman en son sürümü kullanın.
2. API kimlik bilgilerinizi (userCode, password) güvenli bir şekilde saklayın, asla kaynak kodunuza dahil etmeyin.
3. Ortam değişkenlerini (.env dosyası) kullanarak kimlik bilgilerinizi yönetin.
4. Kimlik bilgilerinizi sürüm kontrolünden hariç tutun (.gitignore).
5. Üretim ortamında HTTPS kullanın.

## Bağımlılık Güvenliği

Projemiz, bağımlılıklardaki güvenlik açıklarını izlemek için GitHub'ın Dependabot uyarılarını kullanmaktadır. Bağımlılıklarımızı düzenli olarak güncelleyerek bilinen güvenlik açıklarını gidermeye çalışıyoruz. 