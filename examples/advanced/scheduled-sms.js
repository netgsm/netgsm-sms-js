/**
 * @netgsm/sms - Zamanlanmış SMS Gönderimi Örneği
 * 
 * Bu örnek, Netgsm SMS API'sini kullanarak zamanlanmış SMS gönderme, 
 * zamanlanmış SMS iptal etme ve rapor sorgulama işlemlerini göstermektedir.
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
 * Zamanlanmış SMS gönderme örneği
 * @param {Date} scheduledDate - SMS'in gönderileceği tarih ve saat
 * @param {string} message - Gönderilecek mesaj
 * @param {string[]} recipients - Alıcı numaraları (başında 0 olmadan)
 * @param {string} header - SMS başlığı
 * @returns {Promise<string>} - İş kimliği (jobId)
 */
async function sendScheduledSms(scheduledDate, message, recipients, header) {
  try {
    console.log(`Zamanlanmış SMS ayarlanıyor: ${scheduledDate.toLocaleString()}`);
    
    // Tarihi Netgsm formatına dönüştür
    const formattedDate = formatDateForNetgsm(scheduledDate);
    
    const response = await netgsm.sendRestSms({
      msgheader: header,
      encoding: Enums.Encoding.TR,
      startdate: formattedDate, // Zamanlanmış gönderim için başlangıç tarihi
      messages: recipients.map(recipient => ({
        msg: message,
        no: recipient
      }))
    });
    
    console.log('Zamanlanmış SMS ayarlandı:', response);
    return response.jobid;
  } catch (error) {
    console.error('Zamanlanmış SMS hatası:', error);
    throw error;
  }
}

/**
 * Zamanlanmış SMS iptal etme örneği
 * @param {string} jobId - İptal edilecek SMS'in iş kimliği
 * @returns {Promise<object>} - İptal yanıtı
 */
async function cancelScheduledSms(jobId) {
  try {
    console.log(`${jobId} numaralı zamanlanmış SMS iptal ediliyor...`);
    
    const response = await netgsm.cancelScheduledSms({
      jobid: jobId
    });
    
    console.log('Zamanlanmış SMS iptal edildi:', response);
    return response;
  } catch (error) {
    console.error('SMS iptal hatası:', error);
    throw error;
  }
}

/**
 * Zamanlanmış SMS durumunu kontrol etme örneği
 * @param {string} jobId - Kontrol edilecek SMS'in iş kimliği
 * @returns {Promise<object>} - Rapor yanıtı
 */
async function checkScheduledSmsStatus(jobId) {
  try {
    console.log(`${jobId} numaralı zamanlanmış SMS durumu sorgulanıyor...`);
    
    const report = await netgsm.getReport({
      bulkIds: [jobId],
      type: Enums.ReportType.DETAILED
    });
    
    console.log('Zamanlanmış SMS durumu:', report);
    return report;
  } catch (error) {
    console.error('Durum sorgulama hatası:', error);
    throw error;
  }
}

/**
 * Tarihi Netgsm formatına dönüştürme yardımcı fonksiyonu
 * @param {Date} date - Dönüştürülecek tarih
 * @returns {string} - "ddMMyyyyHHmm" formatında tarih
 */
function formatDateForNetgsm(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}${month}${year}${hour}${minute}`;
}

/**
 * Zamanlanmış SMS örneğini çalıştırma
 */
async function runScheduledSmsExample() {
  try {
    // Şu andan 1 saat sonrası için zamanlanmış SMS
    const oneHourLater = new Date();
    oneHourLater.setHours(oneHourLater.getHours() + 1);
    
    // Zamanlanmış SMS gönder
    const jobId = await sendScheduledSms(
      oneHourLater,
      'Bu bir zamanlanmış test mesajıdır. Bir saat sonra gönderilecek.',
      ['5XXXXXXXXX'], // Alıcı numarası (başında 0 olmadan)
      'BAŞLIĞINIZ'
    );
    
    if (jobId) {
      // Durumu kontrol et
      await checkScheduledSmsStatus(jobId);
      
      // SMS'i iptal et
      await cancelScheduledSms(jobId);
      
      // İptalden sonra durumu tekrar kontrol et
      await checkScheduledSmsStatus(jobId);
    }
    
    console.log('Zamanlanmış SMS örneği tamamlandı.');
  } catch (error) {
    console.error('Örnek çalıştırılırken hata oluştu:', error);
  }
}

// Örneği çalıştır
// runScheduledSmsExample();

// Örneği çalıştırmak için yukarıdaki satırın başındaki yorum işaretini kaldırın
// ve "node examples/advanced/scheduled-sms.js" komutu ile çalıştırın

module.exports = {
  sendScheduledSms,
  cancelScheduledSms,
  checkScheduledSmsStatus,
  formatDateForNetgsm,
  runScheduledSmsExample
};