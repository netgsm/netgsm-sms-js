/**
 * @netgsm/sms - Ek Örnekler
 * 
 * Bu dosya, Netgsm SMS API'sinin çeşitli kullanım senaryolarını göstermektedir:
 * 1. İleri tarihli mesaj gönderimi
 * 2. Birden fazla numaraya gönderim
 * 3. Son tarihli SMS gönderimi
 * 4. Türkçe karakter desteği ile gönderim
 * 5. İYS filtreli gönderim
 */

const { Netgsm } = require('@netgsm/sms');

// Netgsm istemcisini yapılandırma
// Gerçek kullanımda kendi bilgilerinizi girin
const netgsm = new Netgsm({
  usercode: 'KULLANICI_KODUNUZ',
  password: 'PAROLANIZ',
  appName: 'UYGULAMA_ADINIZ' // İsteğe bağlı
});

/**
 * 1. İleri tarihli mesaj gönderimi örneği
 * Not: Tarih formatı ddMMyyyyHHmm olmalıdır
 */
async function sendFutureMessage() {
  try {
    console.log('İleri tarihli mesaj gönderiliyor...');
    
    // Gelecek tarih oluşturma (örnek: 3 gün sonrası)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    
    // Tarihi ddMMyyyyHHmm formatına dönüştürme
    const formattedDate = formatDate(futureDate);
    console.log(`Gönderim tarihi: ${formattedDate}`);
    
    const response = await netgsm.sendRestSms({
      msgheader: 'BAŞLIĞINIZ',
      startdate: formattedDate, // İleri tarihli gönderim için başlangıç tarihi
      messages: [{
        msg: 'Bu ileri tarihli bir test mesajıdır.',
        no: '5XXXXXXXXX' // Alıcı numarası (başında 0 olmadan)
      }]
    });
    
    console.log('İleri tarihli mesaj yanıtı:', response);
    return response.jobid;
  } catch (error) {
    console.error('İleri tarihli mesaj hatası:', error);
  }
}

/**
 * 2. Birden fazla numaraya gönderim örneği
 */
async function sendToMultipleRecipients() {
  try {
    console.log('Birden fazla numaraya mesaj gönderiliyor...');
    
    const response = await netgsm.sendRestSms({
      msgheader: 'BAŞLIĞINIZ',
      messages: [
        {
          msg: 'Birinci alıcı için test mesajı.',
          no: '5XXXXXXXXX' // İlk alıcı numarası
        },
        {
          msg: 'İkinci alıcı için test mesajı.',
          no: '5XXXXXXXXX' // İkinci alıcı numarası
        }
      ]
    });
    
    console.log('Çoklu alıcı mesaj yanıtı:', response);
    return response.jobid;
  } catch (error) {
    console.error('Çoklu alıcı mesaj hatası:', error);
  }
}

/**
 * 3. Son tarihli SMS gönderimi örneği
 * Not: startdate ve stopdate birlikte kullanılır
 */
async function sendWithExpiryDate() {
  try {
    console.log('Son tarihli SMS gönderiliyor...');
    
    // Başlangıç tarihi (örnek: yarın)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    
    // Bitiş tarihi (örnek: 3 gün sonra)
    const stopDate = new Date();
    stopDate.setDate(stopDate.getDate() + 3);
    
    // Tarihleri ddMMyyyyHHmm formatına dönüştürme
    const formattedStartDate = formatDate(startDate);
    const formattedStopDate = formatDate(stopDate);
    
    console.log(`Başlangıç tarihi: ${formattedStartDate}`);
    console.log(`Bitiş tarihi: ${formattedStopDate}`);
    
    const response = await netgsm.sendRestSms({
      msgheader: 'BAŞLIĞINIZ',
      startdate: formattedStartDate, // Başlangıç tarihi
      stopdate: formattedStopDate,   // Bitiş tarihi
      messages: [{
        msg: 'Bu son tarihli bir test mesajıdır.',
        no: '5XXXXXXXXX' // Alıcı numarası
      }]
    });
    
    console.log('Son tarihli SMS yanıtı:', response);
    return response.jobid;
  } catch (error) {
    console.error('Son tarihli SMS hatası:', error);
  }
}

/**
 * 4. Türkçe karakter desteği ile gönderim örneği
 */
async function sendWithTurkishCharacters() {
  try {
    console.log('Türkçe karakterli mesaj gönderiliyor...');
    
    const response = await netgsm.sendRestSms({
      msgheader: 'BAŞLIĞINIZ',
      encoding: 'TR', // Türkçe karakter desteği için
      messages: [{
        msg: 'Merhaba! Bu mesaj Türkçe karakterler içermektedir: çğıöşüÇĞİÖŞÜ',
        no: '5XXXXXXXXX' // Alıcı numarası
      }]
    });
    
    console.log('Türkçe karakterli mesaj yanıtı:', response);
    return response.jobid;
  } catch (error) {
    console.error('Türkçe karakterli mesaj hatası:', error);
  }
}

/**
 * 5. İYS filtreli gönderim örneği
 */
async function sendWithIysFilter() {
  try {
    console.log('İYS filtreli mesajlar gönderiliyor...');
    
    // Ticari içerikli bireysele gönderim (İYS kontrollü)
    const response1 = await netgsm.sendRestSms({
      msgheader: 'BAŞLIĞINIZ',
      iysfilter: '11', // Ticari içerikli bireysele gönderim (İYS kontrollü)
      messages: [{
        msg: 'Bu ticari içerikli bireysel bir test mesajıdır.',
        no: '5XXXXXXXXX' // Bireysel alıcı numarası
      }]
    });
    
    console.log('Ticari içerikli bireysel mesaj yanıtı:', response1);
    
    // Ticari içerikli tacire gönderim (İYS kontrollü)
    const response2 = await netgsm.sendRestSms({
      msgheader: 'BAŞLIĞINIZ',
      iysfilter: '12', // Ticari içerikli tacire gönderim (İYS kontrollü)
      messages: [{
        msg: 'Bu ticari içerikli tacir bir test mesajıdır.',
        no: '5XXXXXXXXX' // Tacir alıcı numarası
      }]
    });
    
    console.log('Ticari içerikli tacir mesaj yanıtı:', response2);
    
    // Bilgilendirme amaçlı gönderim (İYS kontrolsüz)
    const response3 = await netgsm.sendRestSms({
      msgheader: 'BAŞLIĞINIZ',
      iysfilter: '0', // Bilgilendirme amaçlı gönderim (İYS kontrolsüz)
      messages: [{
        msg: 'Bu bilgilendirme amaçlı bir test mesajıdır.',
        no: '5XXXXXXXXX' // Alıcı numarası
      }]
    });
    
    console.log('Bilgilendirme amaçlı mesaj yanıtı:', response3);
    
    return {
      bireysel: response1.jobid,
      tacir: response2.jobid,
      bilgilendirme: response3.jobid
    };
  } catch (error) {
    console.error('İYS filtreli mesaj hatası:', error);
  }
}

/**
 * Tarihi ddMMyyyyHHmm formatına dönüştürme yardımcı fonksiyonu
 * @param {Date} date - Dönüştürülecek tarih
 * @returns {string} - "ddMMyyyyHHmm" formatında tarih
 */
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}${month}${year}${hours}${minutes}`;
}

/**
 * Tüm örnekleri çalıştırma
 */
async function runAllExamples() {
  try {
    // 1. İleri tarihli mesaj gönderimi
    console.log('\n--- 1. İleri Tarihli Mesaj Gönderimi ---');
    await sendFutureMessage();
    
    // 2. Birden fazla numaraya gönderim
    console.log('\n--- 2. Birden Fazla Numaraya Gönderim ---');
    await sendToMultipleRecipients();
    
    // 3. Son tarihli SMS gönderimi
    console.log('\n--- 3. Son Tarihli SMS Gönderimi ---');
    await sendWithExpiryDate();
    
    // 4. Türkçe karakter desteği ile gönderim
    console.log('\n--- 4. Türkçe Karakter Desteği ile Gönderim ---');
    await sendWithTurkishCharacters();
    
    // 5. İYS filtreli gönderim
    console.log('\n--- 5. İYS Filtreli Gönderim ---');
    await sendWithIysFilter();
    
    console.log('\nTüm örnekler tamamlandı.');
  } catch (error) {
    console.error('Örnekler çalıştırılırken hata oluştu:', error);
  }
}

// Örnekleri çalıştır
// runAllExamples();

// Örnekleri çalıştırmak için yukarıdaki satırın başındaki yorum işaretini kaldırın
// ve "node examples/advanced/additional-examples.js" komutu ile çalıştırın

module.exports = {
  sendFutureMessage,
  sendToMultipleRecipients,
  sendWithExpiryDate,
  sendWithTurkishCharacters,
  sendWithIysFilter,
  runAllExamples
}; 