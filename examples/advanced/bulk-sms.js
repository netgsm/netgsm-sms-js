/**
 * @netgsm/sms - Toplu SMS Gönderimi Örneği
 * 
 * Bu örnek, Netgsm SMS API'sini kullanarak farklı alıcılara farklı mesajlar gönderme
 * ve toplu SMS raporlarını sorgulama işlemlerini göstermektedir.
 */

const { Netgsm, Enums } = require('@netgsm/sms');
const fs = require('fs');
const path = require('path');

// Netgsm istemcisini yapılandırma
// Gerçek kullanımda kendi bilgilerinizi girin
const netgsm = new Netgsm({
  username: 'KULLANICI_KODUNUZ',
  password: 'PAROLANIZ',
  appname: 'UYGULAMA_ADINIZ' // İsteğe bağlı
});

/**
 * Farklı alıcılara farklı mesajlar gönderme örneği
 * @param {Array<{message: string, recipient: string}>} messageList - Mesaj ve alıcı listesi
 * @param {string} header - SMS başlığı
 * @returns {Promise<string>} - İş kimliği (jobId)
 */
async function sendBulkSms(messageList, header) {
  try {
    console.log(`${messageList.length} alıcıya toplu SMS gönderiliyor...`);
    
    // Netgsm API'si için mesaj formatını hazırla
    const messages = messageList.map(item => ({
      msg: item.message,
      no: item.recipient
    }));
    
    const response = await netgsm.sendBulkSms({
      msgheader: header,
      messages: messages,
      encoding: Enums.Encoding.TR
    });
    
    console.log('Toplu SMS gönderildi:', response);
    return response.jobid;
  } catch (error) {
    console.error('Toplu SMS gönderme hatası:', error);
    throw error;
  }
}

/**
 * CSV dosyasından toplu SMS gönderimi örneği
 * @param {string} csvFilePath - CSV dosya yolu
 * @param {string} header - SMS başlığı
 * @returns {Promise<string>} - İş kimliği (jobId)
 */
async function sendBulkSmsFromCsv(csvFilePath, header) {
  try {
    console.log(`${csvFilePath} dosyasından toplu SMS gönderiliyor...`);
    
    // CSV dosyasını oku ve işle
    const messageList = await readCsvFile(csvFilePath);
    
    if (messageList.length === 0) {
      throw new Error('CSV dosyası boş veya geçersiz format içeriyor.');
    }
    
    return await sendBulkSms(messageList, header);
  } catch (error) {
    console.error('CSV dosyasından SMS gönderme hatası:', error);
    throw error;
  }
}

/**
 * Toplu SMS raporu sorgulama örneği
 * @param {string} jobId - Sorgulanacak iş kimliği
 * @returns {Promise<object>} - Rapor yanıtı
 */
async function queryBulkSmsReport(jobId) {
  try {
    console.log(`${jobId} numaralı toplu SMS raporu sorgulanıyor...`);
    
    const report = await netgsm.queryReport({
      bulkIds: jobId,
      type: Enums.ReportType.DETAILED
    });
    
    console.log('Toplu SMS raporu:', report);
    
    // İstatistikleri hesapla
    if (report && Array.isArray(report)) {
      const total = report.length;
      const delivered = report.filter(item => item.status === '0').length;
      const failed = report.filter(item => item.status !== '0').length;
      
      console.log(`Toplam: ${total}, İletilen: ${delivered}, Başarısız: ${failed}`);
    }
    
    return report;
  } catch (error) {
    console.error('Rapor sorgulama hatası:', error);
    throw error;
  }
}

/**
 * CSV dosyasını okuma yardımcı fonksiyonu
 * @param {string} filePath - CSV dosya yolu
 * @returns {Promise<Array<{message: string, recipient: string}>>} - Mesaj ve alıcı listesi
 */
function readCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      
      try {
        // CSV satırlarını işle
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const messageList = [];
        
        for (let i = 1; i < lines.length; i++) { // İlk satır başlık olabilir
          const [recipient, message] = lines[i].split(',').map(item => item.trim());
          
          if (recipient && message) {
            messageList.push({
              recipient: recipient.replace(/[^0-9]/g, ''), // Sadece rakamları al
              message: message
            });
          }
        }
        
        resolve(messageList);
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Örnek CSV dosyası oluşturma
 * @param {string} filePath - Oluşturulacak dosya yolu
 * @returns {Promise<void>}
 */
function createSampleCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const sampleData = 
      'recipient,message\n' +
      '5XXXXXXXXX1,Merhaba Ali, siparişiniz hazırlandı.\n' +
      '5XXXXXXXXX2,Merhaba Ayşe, siparişiniz kargoya verildi.\n' +
      '5XXXXXXXXX3,Merhaba Mehmet, ödemeniz alındı.\n';
    
    fs.writeFile(filePath, sampleData, 'utf8', (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

/**
 * Toplu SMS örneğini çalıştırma
 */
async function runBulkSmsExample() {
  try {
    // 1. Doğrudan liste ile toplu SMS gönderme
    const messageList = [
      { message: 'Merhaba Ali, siparişiniz hazırlandı.', recipient: '5XXXXXXXXX1' },
      { message: 'Merhaba Ayşe, siparişiniz kargoya verildi.', recipient: '5XXXXXXXXX2' },
      { message: 'Merhaba Mehmet, ödemeniz alındı.', recipient: '5XXXXXXXXX3' }
    ];
    
    const jobId = await sendBulkSms(messageList, 'BAŞLIĞINIZ');
    
    if (jobId) {
      // Rapor sorgulamadan önce kısa bir bekleme
      console.log('Rapor sorgulamadan önce 5 saniye bekleniyor...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Raporu sorgula
      await queryBulkSmsReport(jobId);
    }
    
    // 2. CSV dosyasından toplu SMS gönderme
    const csvFilePath = path.join(__dirname, 'sample_messages.csv');
    
    // Örnek CSV dosyası oluştur
    await createSampleCsvFile(csvFilePath);
    console.log(`Örnek CSV dosyası oluşturuldu: ${csvFilePath}`);
    
    // CSV'den SMS gönder
    const csvJobId = await sendBulkSmsFromCsv(csvFilePath, 'BAŞLIĞINIZ');
    
    if (csvJobId) {
      // Rapor sorgulamadan önce kısa bir bekleme
      console.log('Rapor sorgulamadan önce 5 saniye bekleniyor...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Raporu sorgula
      await queryBulkSmsReport(csvJobId);
    }
    
    console.log('Toplu SMS örneği tamamlandı.');
  } catch (error) {
    console.error('Örnek çalıştırılırken hata oluştu:', error);
  }
}

// Örneği çalıştır
// runBulkSmsExample();

// Örneği çalıştırmak için yukarıdaki satırın başındaki yorum işaretini kaldırın
// ve "node examples/advanced/bulk-sms.js" komutu ile çalıştırın

module.exports = {
  sendBulkSms,
  sendBulkSmsFromCsv,
  queryBulkSmsReport,
  readCsvFile,
  createSampleCsvFile,
  runBulkSmsExample
}; 