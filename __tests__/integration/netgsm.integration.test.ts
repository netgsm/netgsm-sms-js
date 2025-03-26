import dotenv from "dotenv";

import { SmsStatus, ReportType, BalanceType } from "../../src/enums";
import Netgsm from "../../src/netgsm";

dotenv.config();

describe("Netgsm Integration Tests", () => {
  let netgsm: Netgsm;
  let scheduledSmsJobId: string;
  let instantSmsJobId: string;

  beforeAll(() => {
    if (!process.env.NETGSM_USERNAME || !process.env.NETGSM_PASSWORD) {
      throw new Error("Missing required environment variables");
    }

    netgsm = new Netgsm({
      username: process.env.NETGSM_USERNAME,
      password: process.env.NETGSM_PASSWORD,
      appname: "netgsm-test",
    });
  });

  // 1. Kredi balance sorgulama
  it("should check credit balance", async () => {
    const balanceResponse = await netgsm.checkBalance({
      stip: BalanceType.CREDIT,
    });

    expect(balanceResponse.code).toBe("00");
    expect(balanceResponse.balance).toBeDefined();
    // eslint-disable-next-line no-console
    console.log(`Mevcut kredi: ${balanceResponse.balance}`);
  }, 10000);

  // 2. Başlıkların listelenmesi
  it("should list message headers", async () => {
    const headersResponse = await netgsm.getHeaders();

    expect(headersResponse.code).toBe("00");
    expect(headersResponse.msgheaders).toBeDefined();
    expect(Array.isArray(headersResponse.msgheaders)).toBeTruthy();

    // Başlıkları konsola yazdır
    // eslint-disable-next-line no-console
    console.log(`Başlıklar: ${headersResponse.msgheaders?.join(", ")}`);

    // NETGSM_MESSAGE_HEADER değerinin başlıklar arasında olup olmadığını kontrol et
    const messageHeader = process.env.NETGSM_MESSAGE_HEADER;
    if (messageHeader && headersResponse.msgheaders) {
      const headerExists = headersResponse.msgheaders.includes(messageHeader);
      // eslint-disable-next-line no-console
      console.log(
        `"${messageHeader}" başlığı listede ${headerExists ? "bulunuyor" : "bulunmuyor"}`
      );

      // Başlığın listede olmasını bekleriz
      expect(headerExists).toBeTruthy();
    } else {
      // eslint-disable-next-line no-console
      console.log("NETGSM_MESSAGE_HEADER tanımlanmamış veya başlık listesi boş");
    }
  }, 10000);

  // 3. İleri tarihli SMS gönderimi
  it("should send scheduled SMS", async () => {
    // Yarın için tarih oluştur
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Tarihi ddMMyyyyHHmm formatına dönüştür
    const formattedDate = `${tomorrow.getDate().toString().padStart(2, "0")}${(tomorrow.getMonth() + 1).toString().padStart(2, "0")}${tomorrow.getFullYear()}${tomorrow.getHours().toString().padStart(2, "0")}${tomorrow.getMinutes().toString().padStart(2, "0")}`;

    const scheduledSmsPayload = {
      msgheader: process.env.NETGSM_MESSAGE_HEADER || "TEST",
      // İleri tarihli gönderim için startdate parametresi
      startdate: formattedDate, // Yarın aynı saat
      messages: [
        {
          msg: "İleri tarihli test mesajı",
          no: process.env.TEST_PHONE_NUMBER || "",
        },
      ],
    };

    const smsResponse = await netgsm.sendRestSms(scheduledSmsPayload);
    expect(smsResponse.code).toBe("00");
    expect(smsResponse.jobid).toBeTruthy();

    // Sonraki testlerde kullanmak için jobid'yi saklayalım
    scheduledSmsJobId = smsResponse.jobid || "";
    // eslint-disable-next-line no-console
    console.log(`İleri tarihli SMS jobid: ${scheduledSmsJobId}`);
  }, 10000);

  // 4. İleri tarihli SMS iptali
  it("should cancel scheduled SMS", async () => {
    const cancelPayload = {
      jobid: scheduledSmsJobId,
    };

    try {
      const cancelResponse = await netgsm.cancelSms(cancelPayload);
      // API başarılı yanıt vermeli
      expect(cancelResponse.code).toBe("00");
      // eslint-disable-next-line no-console
      console.log(`SMS iptal edildi: ${scheduledSmsJobId}`);
    } catch (error) {
      // Hata durumunda testi başarısız say
      // eslint-disable-next-line no-console
      console.error(
        `SMS iptal hatası: ${(error as { code: string; description: string }).code} - ${(error as { code: string; description: string }).description}`
      );
      fail(
        `SMS iptal edilemedi: ${(error as { code: string; description: string }).code} - ${(error as { code: string; description: string }).description}`
      );
    }
  }, 10000);

  // 5. Tarihsiz (anında) SMS gönderimi
  it("should send instant SMS", async () => {
    const instantSmsPayload = {
      msgheader: process.env.NETGSM_MESSAGE_HEADER || "TEST",
      messages: [
        {
          msg: "Anında gönderilen test mesajı",
          no: process.env.TEST_PHONE_NUMBER || "",
        },
      ],
    };

    const smsResponse = await netgsm.sendRestSms(instantSmsPayload);
    expect(smsResponse.code).toBe("00");
    expect(smsResponse.jobid).toBeTruthy();

    // Sonraki testlerde kullanmak için jobid'yi saklayalım
    instantSmsJobId = smsResponse.jobid || "";
    // eslint-disable-next-line no-console
    console.log(`Anında gönderilen SMS jobid: ${instantSmsJobId}`);

    // SMS işlenmesi için bekleyelim
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }, 15000);

  // 6. SMS raporu sorgulama
  it("should query SMS report", async () => {
    // Önceki testte alınan jobid'nin tanımlı olduğundan emin olalım
    expect(instantSmsJobId).toBeTruthy();

    const reportPayload = {
      bulkIds: [instantSmsJobId],
      startdate: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
      stopdate: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
    };

    const report = await netgsm.getReport(reportPayload);
    expect(report.jobs).toBeDefined();

    if (report.jobs && report.jobs.length > 0) {
      const smsStatus = report.jobs[0].status;
      // eslint-disable-next-line no-console
      console.log(`SMS durumu: ${smsStatus} (${SmsStatus[smsStatus]})`);
    } else {
      // eslint-disable-next-line no-console
      console.log("SMS raporu henüz mevcut değil");
    }
  }, 10000);

  // 7. Inbox listeleme
  it("should list inbox messages", async () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const formatDate = (date: Date): string => {
      return `${date.getDate().toString().padStart(2, "0")}${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${date.getFullYear()}`;
    };

    const inboxPayload = {
      startdate: formatDate(oneMonthAgo),
      stopdate: formatDate(today),
    };

    try {
      const inboxResponse = await netgsm.getInbox(inboxPayload);

      // API "00" (başarılı) veya "40" (mesaj bulunamadı) dönebilir
      // Her iki durum da geçerli test sonuçlarıdır
      expect(["00", "40"]).toContain(inboxResponse.code);

      if (inboxResponse.code === "00" && inboxResponse.messages) {
        // eslint-disable-next-line no-console
        console.log(`Gelen kutusu mesaj sayısı: ${inboxResponse.messages.length}`);
      } else {
        // eslint-disable-next-line no-console
        console.log("Gelen kutusunda mesaj bulunamadı");
      }
    } catch (error) {
      // Hata durumunda, hata kodunun "40" olduğunu kontrol et
      // "40" kodu "Gelen SMS bulunamadı" anlamına gelir ve bu bir hata değildir
      expect((error as { code: string }).code).toBe("40");
      // eslint-disable-next-line no-console
      console.log("Gelen kutusunda mesaj bulunamadı (beklenen durum)");
    }
  }, 10000);
});
