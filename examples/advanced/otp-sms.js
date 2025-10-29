/**
 * @netgsm/sms - OTP SMS Gönderimi Örneği
 * 
 * Bu örnek, Netgsm SMS API'sini kullanarak OTP (Tek Kullanımlık Parola) 
 * SMS gönderme işlemlerini göstermektedir.
 */

const { Netgsm, OtpErrorCode } = require('@netgsm/sms');

// Netgsm istemcisini yapılandırma
// Gerçek kullanımda kendi bilgilerinizi girin
const netgsm = new Netgsm({
  username: 'KULLANICI_KODUNUZ',
  password: 'PAROLANIZ'
});

/**
 * OTP SMS gönderme örneği
 */
async function sendOtpSmsExample() {
  try {
    console.log('OTP SMS gönderiliyor...');
    
    const response = await netgsm.sendOtpSms({
      msgheader: 'BAŞLIĞINIZ',
      message: 'Dogrulama kodunuz: 123456. 5 dakika gecerlidir.', // Türkçe karakterler olmamalı
      no: '5XXXXXXXXX' // Alıcı numarası (başında 0 olmadan)
    });
    
    console.log('OTP SMS başarıyla gönderildi!');
    console.log('İş Kimliği:', response.jobid);
    console.log('Kod:', response.code);
    
    return response.jobid;
  } catch (error) {
    console.error('OTP SMS gönderme hatası:', error);
    
    // OTP hata kodlarını işleme
    if (error.code === OtpErrorCode.NO_OTP_PACKAGE) {
      console.error('Hata: Hesabınızda OTP SMS paketi tanımlı değil');
    } else if (error.code === OtpErrorCode.RATE_LIMIT) {
      console.error('Hata: Sorgulama sınırı aşıldı');
    } else if (error.code === OtpErrorCode.INVALID_AUTH) {
      console.error('Hata: Geçersiz kullanıcı adı veya parola');
    } else if (error.code === OtpErrorCode.INVALID_HEADER) {
      console.error('Hata: Geçersiz mesaj başlığı');
    } else if (error.code === OtpErrorCode.INVALID_NUMBER) {
      console.error('Hata: Geçersiz telefon numarası formatı');
    } else if (error.code === OtpErrorCode.MESSAGE_ERROR) {
      console.error('Hata: Mesaj metni veya boyut hatası');
    }
    
    throw error;
  }
}

/**
 * OTP kodu oluşturma ve gönderme
 * @param {string} phoneNumber - Alıcı telefon numarası
 */
async function generateAndSendOtp(phoneNumber) {
  // 6 haneli OTP kodu oluştur
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    const response = await netgsm.sendOtpSms({
      msgheader: 'BAŞLIĞINIZ',
      message: `Dogrulama kodunuz: ${otpCode}`,
      no: phoneNumber
    });
    
    console.log(`OTP ${otpCode} şu numaraya gönderildi: ${phoneNumber}`);
    console.log('İş Kimliği:', response.jobid);
    
    // OTP kodunu veritabanınıza son kullanma süresiyle birlikte kaydedin
    // Örnek: await saveOtpToDatabase(phoneNumber, otpCode, expiresIn: 300); // 5 dakika
    
    return { success: true, jobid: response.jobid, code: otpCode };
  } catch (error) {
    console.error('OTP gönderimi başarısız:', error);
    return { success: false, error: error };
  }
}

/**
 * OTP SMS örneğini çalıştırma
 */
async function runOtpSmsExample() {
  try {
    // Örnek 1: Temel OTP gönderimi
    await sendOtpSmsExample();
    
    console.log('\n---\n');
    
    // Örnek 2: OTP oluştur ve gönder
    await generateAndSendOtp('5XXXXXXXXX');
    
    console.log('OTP SMS örneği tamamlandı.');
  } catch (error) {
    console.error('Örnek çalıştırılırken hata oluştu:', error);
  }
}

// Örneği çalıştır
// runOtpSmsExample();

// Örneği çalıştırmak için yukarıdaki satırın başındaki yorum işaretini kaldırın
// ve "node examples/advanced/otp-sms.js" komutu ile çalıştırın

module.exports = {
  sendOtpSmsExample,
  generateAndSendOtp,
  runOtpSmsExample
};

