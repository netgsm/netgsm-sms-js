/**
 * @netgsm/sms - IYS İzin Yönetimi Örneği
 *
 * Bu örnek, Netgsm IYS API'sini kullanarak izin sorgulama,
 * izin kaydetme ve webhook kaydetme işlemlerini göstermektedir.
 */

const {
  Netgsm,
  IysAddressType,
  IysConsentStatus,
  IysRecipientType,
  IysSource,
} = require('@netgsm/sms');

// Netgsm istemcisini yapılandırma
// Gerçek kullanımda kendi bilgilerinizi girin
const netgsm = new Netgsm({
  username: 'KULLANICI_KODUNUZ',
  password: 'PAROLANIZ'
});

const BRAND_CODE = 123456; // Netgsm hesabınızdaki marka kodunuz

/**
 * İzin durumu sorgulama örneği
 */
async function queryConsentExample() {
  try {
    console.log('İzin durumu sorgulanıyor...');

    const result = await netgsm.iys.queryConsent({
      brandCode: BRAND_CODE,
      recipient: '+905XXXXXXXXX',
      type: IysAddressType.MESAJ,
      recipientType: IysRecipientType.BIREYSEL
    });

    console.log('İzin sorgusu sonucu:', result.data);
  } catch (error) {
    console.error('İzin sorgulama hatası:', error);
  }
}

/**
 * İzin kaydetme örneği (ONAY)
 */
async function saveConsentExample() {
  try {
    console.log('İzin kaydediliyor...');

    const consentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const result = await netgsm.iys.saveConsents({
      brandCode: BRAND_CODE,
      permissions: [
        {
          recipient: '+905XXXXXXXXX',
          recipientType: IysRecipientType.BIREYSEL,
          type: IysAddressType.MESAJ,
          source: IysSource.HS_MESAJ,
          status: IysConsentStatus.ONAY,
          consentDate // Format: YYYY-MM-DD HH:mm:ss
        }
      ]
    });

    console.log('İzin kaydedildi, uid:', result.data.uid);
  } catch (error) {
    console.error('İzin kaydetme hatası:', error);
  }
}

/**
 * İzin geri alma örneği (RET)
 */
async function revokeConsentExample() {
  try {
    console.log('İzin geri alınıyor...');

    const consentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const result = await netgsm.iys.saveConsents({
      brandCode: BRAND_CODE,
      permissions: [
        {
          recipient: '+905XXXXXXXXX',
          recipientType: IysRecipientType.BIREYSEL,
          type: IysAddressType.MESAJ,
          source: IysSource.HS_MESAJ,
          status: IysConsentStatus.RET,
          consentDate
        }
      ]
    });

    console.log('İzin geri alındı, uid:', result.data.uid);
  } catch (error) {
    console.error('İzin geri alma hatası:', error);
  }
}

/**
 * Webhook kaydetme örneği
 */
async function setWebhookExample() {
  try {
    console.log('Webhook kaydediliyor...');

    const result = await netgsm.iys.setWebhook({
      brandCode: BRAND_CODE,
      webhookUrl: 'https://your-domain.com/iys-webhook'
    });

    console.log('Webhook kaydedildi, uid:', result.data.uid);
  } catch (error) {
    console.error('Webhook kaydetme hatası:', error);
  }
}

/**
 * Tüm örnekleri çalıştır
 */
async function runExamples() {
  try {
    await queryConsentExample();
    await saveConsentExample();
    await queryConsentExample(); // Kaydedilen izni doğrula
    await revokeConsentExample();
    await setWebhookExample();

    console.log('Tüm örnekler tamamlandı.');
  } catch (error) {
    console.error('Örnekler çalıştırılırken hata oluştu:', error);
  }
}

// Örnekleri çalıştır
// runExamples();

// Örnekleri çalıştırmak için yukarıdaki satırın başındaki yorum işaretini kaldırın
// ve "node examples/advanced/iys-consent.js" komutu ile çalıştırın

module.exports = {
  queryConsentExample,
  saveConsentExample,
  revokeConsentExample,
  setWebhookExample,
  runExamples
};
