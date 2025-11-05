/**
 * @netgsm/sms - IYS (İzin Yönetim Sistemi) Operasyonları Örneği
 *
 * Bu örnek, Netgsm API'sini kullanarak IYS'ye alıcı ekleme ve
 * mevcut alıcıları sorgulama işlemlerini göstermektedir.
 */

const { Netgsm, Enums } = require('@netgsm/sms');

// Netgsm istemcisini yapılandırma
// .env dosyasındaki değişkenler kullanılır
const netgsm = new Netgsm({
  username: 'KULLANICI_KODUNUZ',
  password: 'PAROLANIZ',
  appname: 'UYGULAMA_ADINIZ', // İsteğe bağlı
});

/**
 * IYS'ye yeni alıcı ekleme örneği
 */
async function addRecipientToIys() {
  console.log('IYS alıcı ekleniyor.');
  try {
    const response = await netgsm.addIysRecipients({
      brandCode: '000000', // İletişim adresi izinlerinizi yüklemeyi tercih ettiğiniz marka kodunuz
      data: [
        {
          type: Enums.IysConsentType.MESSAGE, // Mesaj gönderim izni
          source: Enums.IysSource.HS_WEB, // Kayıt tipi
          recipient: `+905XXXXXXXXX`, // İzin alınan kullanıcının telefon numarası ya da e-posta bilgisidir. +905XXXXXXXXX ya da info@netgsm.com.tr formatlarında olmalıdır.
          status: Enums.IysStatus.APPROVE, // İzin durumu
          consentDate: new Date().toISOString().slice(0, 19).replace('T', ' '), // YYYY-mm-dd HH:mm:ss formatı
          recipientType: Enums.IysRecipientType.BIREYSEL, // İzin alınan kullanıcının tipi
        },
      ],
    });

    console.log('IYS alıcı ekleme yanıtı:', response);
    return response;
  } catch (error) {
    console.error('IYS alıcı ekleme hatası:', error);
  }
}

/**
 * IYS'de alıcı sorgulama örneği
 */
async function searchRecipientInIys() {
  try {
    const response = await netgsm.searchIysRecipients({
      brandCode: '000000', // İletişim adresi izinlerinizi yüklemeyi tercih ettiğiniz marka kodunuz
      data: [
        {
          type: Enums.IysConsentType.MESSAGE, // Kayıt tipi
          recipient: `+905XXXXXXXXX`, // İzin alınan kullanıcının telefon numarası ya da e-posta bilgisidir. +905XXXXXXXXX ya da info@netgsm.com.tr formatlarında olmalıdır.
          recipientType: Enums.IysRecipientType.BIREYSEL, // İzin alınan kullanıcının tipi
        },
      ],
    });

    console.log('IYS alıcı sorgulama yanıtı:', response);
    return response;
  } catch (error) {
    console.error('IYS alıcı sorgulama hatası:', error);
  }
}

/**
 * Tüm IYS örneklerini çalıştırma
 */
async function runIysExamples() {
  console.log('IYS alıcı ekleme örneği çalıştırılıyor...');
  await addRecipientToIys();

  console.log('\nIYS alıcı sorgulama örneği çalıştırılıyor...');
  await searchRecipientInIys();

  console.log('\nTüm IYS örnekleri tamamlandı.');
}

// Örnekleri çalıştırmak için aşağıdaki satırın başındaki yorum işaretini kaldırın
// ve 'node examples/advanced/iys-operations.js' komutu ile çalıştırın.

// runIysExamples();

module.exports = {
  addRecipientToIys,
  searchRecipientInIys,
  runIysExamples,
};
