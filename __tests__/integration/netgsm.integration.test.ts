import { config } from "dotenv";

import {
  BalanceType,
  IysConsentType,
  IysRecipientType,
  IysSource,
  IysStatus,
  SmsStatus,
} from "../../src/enums";
import Netgsm from "../../src/netgsm";

config();

describe("Environment variables", () => {
  test("NETGSM_USERNAME tanımlı olmalı", () => {
    expect(process.env.NETGSM_USERNAME).toBeDefined();
    expect(process.env.NETGSM_USERNAME).not.toBe("");
  });

  test("NETGSM_PASSWORD tanımlı olmalı", () => {
    expect(process.env.NETGSM_PASSWORD).toBeDefined();
    expect(process.env.NETGSM_PASSWORD).not.toBe("");
  });

  test("NETGSM_MESSAGE_HEADER tanımlı olmalı", () => {
    expect(process.env.NETGSM_MESSAGE_HEADER).toBeDefined();
    expect(process.env.NETGSM_MESSAGE_HEADER).not.toBe("");
  });

  test("TEST_PHONE_NUMBER tanımlı olmalı", () => {
    expect(process.env.TEST_PHONE_NUMBER).toBeDefined();
    expect(process.env.TEST_PHONE_NUMBER).not.toBe("");
  });
});

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
      throw new Error(
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

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${day}.${month}.${year} ${hour}:${minute}:${seconds}`;
    };

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);

    const endDate = new Date();

    const reportPayload = {
      bulkIds: [instantSmsJobId],
      startdate: formatDate(startDate),
      stopdate: formatDate(endDate),
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

  // 8. IYS'ye alıcı ekleme
  it("should add a recipient to IYS", async () => {
    if (!process.env.NETIYS_BRAND_CODE || !process.env.TEST_PHONE_NUMBER) {
      // eslint-disable-next-line no-console
      throw new Error(
        "Skipping IYS test: NETIYS_BRAND_CODE or TEST_PHONE_NUMBER is not defined in .env"
      );
    }

    const brandCode = process.env.NETIYS_BRAND_CODE;
    const phoneNumber = process.env.TEST_PHONE_NUMBER;

    const iysPayload = {
      brandCode,
      data: [
        {
          type: IysConsentType.MESSAGE,
          source: IysSource.HS_WEB,
          recipient: `+${phoneNumber}`,
          status: IysStatus.APPROVE,
          // Geçerli bir tarih formatı: YYYY-AA-GG SS:dd:ss
          consentDate: new Date().toISOString().slice(0, 19).replace("T", " "),
          recipientType: IysRecipientType.BIREYSEL,
        },
      ],
    };

    try {
      const iysResponse = await netgsm.addIysRecipients(iysPayload);
      expect(iysResponse.code).toBe("0");
      expect(iysResponse.error).toBe("false");
      expect(iysResponse.uid).toBeDefined();
      // eslint-disable-next-line no-console
      console.log(`IYS'ye alıcı eklendi, UID: ${iysResponse.uid}`);
    } catch (error) {
      throw new Error(`IYS'ye alıcı eklenemedi: ${JSON.stringify(error)}`);
    }
  }, 10000);

  // 9. IYS'de alıcı sorgulama
  it("should search for a recipient in IYS", async () => {
    const brandCode = process.env.NETIYS_BRAND_CODE;
    const phoneNumber = process.env.TEST_PHONE_NUMBER;

    if (!brandCode || !phoneNumber) {
      // eslint-disable-next-line no-console
      throw new Error(
        "Skipping IYS search test: NETIYS_BRAND_CODE or TEST_PHONE_NUMBER is not defined in .env"
      );
    }

    // Kaydın sisteme işlenmesi için kısa bir süre bekle
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const searchPayload = {
      brandCode,
      data: [
        {
          type: IysConsentType.MESSAGE,
          recipient: `+${phoneNumber}`,
          recipientType: IysRecipientType.BIREYSEL,
        },
      ],
    };

    try {
      const searchResponse = await netgsm.searchIysRecipients(searchPayload);
      expect(searchResponse.code).toBe("0");
      expect(searchResponse.error).toBe("false");
      expect(searchResponse.query).toBeDefined();
      expect(searchResponse.query?.recipient).toBe(`+${phoneNumber}`);
      // eslint-disable-next-line no-console
      console.log(`IYS'de alıcı bulundu: ${searchResponse.query?.recipient}`);
    } catch (error) {
      throw new Error(`IYS'de alıcı sorgulanamadı: ${JSON.stringify(error)}`);
    }
  }, 10000);
});
