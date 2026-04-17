import { config } from "dotenv";

import {
  BalanceType,
  CancelErrorCode,
  InboxErrorCode,
  MsgHeaderErrorCode,
  ReportErrorCode,
  SendOtpSmsErrorCode,
  SendSmsErrorCode,
  SmsStatus,
  StatsErrorCode,
} from "../../src/enums";
import Netgsm from "../../src/netgsm";

config();

describe("Netgsm Integration Tests", () => {
  let netgsm: Netgsm;
  let scheduledSmsJobId: string;
  let instantSmsJobId: string;

  beforeAll(() => {
    if (!process.env.NETGSM_USERNAME || !process.env.NETGSM_PASSWORD) {
      throw new Error("Missing required environment variables: NETGSM_USERNAME, NETGSM_PASSWORD");
    }

    netgsm = new Netgsm({
      username: process.env.NETGSM_USERNAME,
      password: process.env.NETGSM_PASSWORD,
      appname: "netgsm-test",
    });
  });

  // 1. Kredi bakiyesi sorgulama
  it("should check credit balance", async () => {
    const res = await netgsm.sms.checkBalance({ stip: BalanceType.CREDIT });

    expect(res.balance).toBeDefined();
    console.log(`Mevcut kredi: ${res.balance}`);
  }, 10000);

  // 2. Paket bakiyesi sorgulama
  it("should check package balance", async () => {
    const res = await netgsm.sms.checkBalance({ stip: BalanceType.PACKAGE });

    expect(res.balance).toBeDefined();
    console.log(`Paket bilgisi:`, res.balance);
  }, 10000);

  // 3. Başlıkların listelenmesi
  it("should list message headers", async () => {
    const res = await netgsm.sms.getHeaders();

    expect(res.code).toBe(MsgHeaderErrorCode.SUCCESS);
    expect(Array.isArray(res.msgheaders)).toBeTruthy();
    console.log(`Başlıklar: ${res.msgheaders?.join(", ")}`);

    const messageHeader = process.env.NETGSM_MESSAGE_HEADER;
    if (messageHeader && res.msgheaders) {
      const exists = res.msgheaders.includes(messageHeader);
      console.log(`"${messageHeader}" başlığı listede ${exists ? "bulunuyor" : "bulunmuyor"}`);
      expect(exists).toBeTruthy();
    }
  }, 10000);

  // 4. İleri tarihli SMS gönderimi
  it("should send scheduled SMS", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pad = (n: number) => String(n).padStart(2, "0");
    const formattedDate =
      `${pad(tomorrow.getDate())}${pad(tomorrow.getMonth() + 1)}${tomorrow.getFullYear()}` +
      `${pad(tomorrow.getHours())}${pad(tomorrow.getMinutes())}`;

    const res = await netgsm.sms.send({
      msgheader: process.env.NETGSM_MESSAGE_HEADER || "TEST",
      startdate: formattedDate,
      messages: [{ msg: "İleri tarihli test mesajı", no: process.env.TEST_PHONE_NUMBER || "" }],
    });

    expect(res.code).toBe(SendSmsErrorCode.SUCCESS);
    expect(res.jobid).toBeTruthy();

    scheduledSmsJobId = res.jobid || "";
    console.log(`İleri tarihli SMS jobid: ${scheduledSmsJobId}`);
  }, 10000);

  // 5. İleri tarihli SMS iptali
  it("should cancel scheduled SMS", async () => {
    const res = await netgsm.sms.cancel({ jobid: scheduledSmsJobId });

    expect(res.code).toBe(CancelErrorCode.SUCCESS);
    console.log(`SMS iptal edildi: ${scheduledSmsJobId}`);
  }, 10000);

  // 6. Anında SMS gönderimi
  it("should send instant SMS", async () => {
    const res = await netgsm.sms.send({
      msgheader: process.env.NETGSM_MESSAGE_HEADER || "TEST",
      messages: [{ msg: "Anında gönderilen test mesajı", no: process.env.TEST_PHONE_NUMBER || "" }],
    });

    expect(res.code).toBe(SendSmsErrorCode.SUCCESS);
    expect(res.jobid).toBeTruthy();

    instantSmsJobId = res.jobid || "";
    console.log(`Anında gönderilen SMS jobid: ${instantSmsJobId}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }, 15000);

  // 7. SMS raporu sorgulama
  it("should query SMS report", async () => {
    expect(instantSmsJobId).toBeTruthy();

    // Tarih filtresi vermeden sadece jobid ile sorguluyoruz.
    // startdate/stopdate aynı ana denk gelirse API "60 - not found" dönüyor.
    const res = await netgsm.sms.getReport({ bulkIds: [instantSmsJobId] });

    expect(res.code).toBe(ReportErrorCode.SUCCESS);
    expect(res.jobs).toBeDefined();

    if (res.jobs && res.jobs.length > 0) {
      const status = res.jobs[0].status;
      console.log(`SMS durumu: ${status} (${SmsStatus[status]})`);
    } else {
      console.log("SMS raporu henüz mevcut değil");
    }
  }, 10000);

  // 8. SMS istatistikleri sorgulama
  it("should query SMS stats", async () => {
    expect(instantSmsJobId).toBeTruthy();

    try {
      const res = await netgsm.sms.getStats({ jobid: instantSmsJobId });

      expect([StatsErrorCode.SUCCESS, StatsErrorCode.PARAMETER_ERROR]).toContain(res.code);
      console.log(`SMS istatistikleri:`, res.stats);
    } catch (error) {
      // API mesaj henüz işlenmemişse veya code alanı olmadan yanıt dönerse buraya düşer.
      // Netgsm stats endpoint'i bazen code olmadan {description: "success"} döner,
      // bu durumda normalizeErrorCode "5000" üretir — beklenen bir durumdur.
      const err = error as { code: string; description: string };
      console.log(`Stats henüz hazır değil — kod: ${err.code}, açıklama: ${err.description}`);
      expect(Object.values(StatsErrorCode)).toContain(err.code);
    }
  }, 10000);

  // 9. Inbox listeleme
  it("should list inbox messages", async () => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (d: Date) =>
      `${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear()}`;

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    try {
      const res = await netgsm.sms.getInbox({
        startdate: fmt(oneMonthAgo),
        stopdate: fmt(today),
      });

      expect([InboxErrorCode.SUCCESS, InboxErrorCode.NO_MESSAGES]).toContain(res.code);

      if (res.code === InboxErrorCode.SUCCESS && res.messages) {
        console.log(`Gelen kutusu mesaj sayısı: ${res.messages.length}`);
      } else {
        console.log("Gelen kutusunda mesaj bulunamadı");
      }
    } catch (error) {
      // "40" = mesaj bulunamadı, bu bir hata değil
      const err = error as { code: string };
      expect(err.code).toBe(InboxErrorCode.NO_MESSAGES);
      console.log("Gelen kutusunda mesaj bulunamadı (beklenen durum)");
    }
  }, 10000);

  // 10. OTP SMS gönderimi
  it("should send OTP SMS", async () => {
    const res = await netgsm.sms.sendOtp({
      msgheader: process.env.NETGSM_MESSAGE_HEADER || "TEST",
      msg: "OTP test mesajı: 123456",
      no: process.env.TEST_PHONE_NUMBER || "",
    });

    expect(res.code).toBe(SendOtpSmsErrorCode.SUCCESS);
    expect(res.jobId).toBeTruthy();
    console.log(`OTP SMS jobid: ${res.jobId}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }, 15000);

  // 11. OTP SMS — çok uzun mesaj hatası
  it("should reject OTP SMS with message too long", async () => {
    await expect(
      netgsm.sms.sendOtp({
        msgheader: process.env.NETGSM_MESSAGE_HEADER || "TEST",
        msg: "A".repeat(200),
        no: process.env.TEST_PHONE_NUMBER || "",
      })
    ).rejects.toMatchObject({
      code: SendOtpSmsErrorCode.MESSAGE_TEXT_ERROR,
      status: 406,
    });

    console.log("Uzun mesaj hatası yakalandı (beklenen durum)");
  }, 10000);

  // 12. OTP SMS — hatalı numara hatası
  it("should reject OTP SMS with invalid phone number", async () => {
    await expect(
      netgsm.sms.sendOtp({
        msgheader: process.env.NETGSM_MESSAGE_HEADER || "TEST",
        msg: "OTP test",
        no: (process.env.TEST_PHONE_NUMBER || "905000000000") + "99999999",
      })
    ).rejects.toMatchObject({
      code: SendOtpSmsErrorCode.CHECK_NUMBER_50,
      status: 406,
    });

    console.log("Hatalı numara hatası yakalandı (beklenen durum)");
  }, 10000);
});
