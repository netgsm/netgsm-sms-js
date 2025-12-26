/**
 * @netgsm/sms - Temel Kullanım Örneği
 * 
 * Bu örnek, Netgsm SMS API'sinin temel kullanımını göstermektedir.
 * SMS gönderme, rapor sorgulama, başlık listeleme ve bakiye sorgulama işlemlerini içerir.
 */

const { Netgsm, Enums } = require('@netgsm/sms');

// Netgsm istemcisini yapılandırma
// Gerçek kullanımda kendi bilgilerinizi girin
const netgsm = new Netgsm({
  username: 'KULLANICI_KODUNUZ',
  password: 'PAROLANIZ',
  appname: 'UYGULAMA_ADINIZ' // İsteğe bağlı
});

/**
 * SMS gönderme örneği
 */
async function sendSmsExample() {
  try {
    console.log('SMS gönderiliyor...');
    
    const response = await netgsm.sendRestSms({
      msgheader: 'BAŞLIĞINIZ', // SMS başlığınız
      encoding: Enums.Encoding.TR, // Türkçe karakter desteği
      // startdate: '010620241530', // İsteğe bağlı (ddMMyyyyHHmm formatında)
      messages: [{
        msg: 'Merhaba! Bu bir test mesajıdır.',
        no: '5XXXXXXXXX' // Alıcı numarası (başında 0 olmadan)
      }]
    });
    
    console.log('SMS gönderildi:', response);
    return response.jobid; // Rapor sorgulamak için jobid'yi döndürüyoruz
  } catch (error) {
    console.error('SMS gönderme hatası:', error);
  }
}

/**
 * OTP SMS gönderme örneği
 */
async function sendOtpExample() {
  try {
    console.log('OTP SMS gönderiliyor...');
    
    const response = await netgsm.sendOtpSms({
      msgheader: 'BAŞLIĞINIZ', // SMS başlığınız
      msg: 'Merhaba! Bu bir test mesajıdır.', // max 160 karakter
      no: '5XXXXXXXXX' // Alıcı numarası (başında 0 olmadan)      
    });
    
    console.log('OTP SMS gönderildi:', response);
    return response.jobid; // Rapor sorgulamak için jobid'yi döndürüyoruz
  } catch (error) {
    console.error('OTP SMS gönderme hatası:', error);
  }
}


/**
 * SMS raporu sorgulama örneği
 */
async function checkReportExample(jobId) {
  try {
    console.log(`${jobId} numaralı SMS raporu sorgulanıyor...`);
    
    const report = await netgsm.getReport({
      bulkIds: [jobId]      
    });
    
    console.log('SMS raporu:', report);
  } catch (error) {
    console.error('Rapor sorgulama hatası:', error);
  }
}

/**
 * Mesaj başlıklarını listeleme örneği
 */
async function listHeadersExample() {
  try {
    console.log('Mesaj başlıkları listeleniyor...');
    
    const headers = await netgsm.getHeaders();
    
    console.log('Mesaj başlıkları:', headers);
  } catch (error) {
    console.error('Başlık listeleme hatası:', error);
  }
}

/**
 * Bakiye sorgulama örneği
 */
async function checkBalanceExample() {
  try {
    console.log('Bakiye sorgulanıyor...');
    
    const balance = await netgsm.checkBalance({
      type: Enums.BalanceType.SMS // SMS bakiyesi
    });
    
    console.log('Bakiye:', balance);
  } catch (error) {
    console.error('Bakiye sorgulama hatası:', error);
  }
}

/**
 * Tüm örnekleri çalıştır
 */
async function runExamples() {
  try {
    // Bakiye sorgulama
    await checkBalanceExample();
    
    // Başlıkları listeleme
    await listHeadersExample();
    
    // SMS gönderme
    const jobId = await sendSmsExample();
    
    if (jobId) {
      // Rapor sorgulamadan önce kısa bir bekleme
      console.log('Rapor sorgulamadan önce 5 saniye bekleniyor...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // SMS raporunu sorgulama
      await checkReportExample(jobId);
    }
    
    console.log('Tüm örnekler tamamlandı.');
  } catch (error) {
    console.error('Örnekler çalıştırılırken hata oluştu:', error);
  }
}

// Örnekleri çalıştır
// runExamples();

// Örnekleri çalıştırmak için yukarıdaki satırın başındaki yorum işaretini kaldırın
// ve "node examples/basic-usage.js" komutu ile çalıştırın

module.exports = {
  sendSmsExample,
  sendOtpExample,
  checkReportExample,
  listHeadersExample,
  checkBalanceExample,
  runExamples
}; 