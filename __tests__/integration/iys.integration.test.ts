import { config } from "dotenv";

import {
  IysAddressType,
  IysConsentStatus,
  IysRecipientType,
  IysSource,
} from "../../src/enums";
import Netgsm from "../../src/netgsm";

config();

// Telefon numarasını IYS formatına çevir: 905xxxxxxxxx → +905xxxxxxxxx
const toIysRecipient = (phone: string) =>
  phone.startsWith("+") ? phone : `+${phone}`;

describe("IYS Integration Tests", () => {
  let netgsm: Netgsm;
  let brandCode: number;
  let recipient: string;

  beforeAll(() => {
    if (!process.env.NETGSM_USERNAME || !process.env.NETGSM_PASSWORD) {
      throw new Error("Missing required env vars: NETGSM_USERNAME, NETGSM_PASSWORD");
    }
    if (!process.env.IYS_BRAND_CODE) {
      throw new Error("Missing required env var: IYS_BRAND_CODE");
    }
    if (!process.env.TEST_PHONE_NUMBER) {
      throw new Error("Missing required env var: TEST_PHONE_NUMBER");
    }

    netgsm = new Netgsm({
      username: process.env.NETGSM_USERNAME,
      password: process.env.NETGSM_PASSWORD,
    });

    brandCode = parseInt(process.env.IYS_BRAND_CODE, 10);
    recipient = toIysRecipient(process.env.TEST_PHONE_NUMBER);
  });

  // 1. Mevcut izin durumunu sorgula
  it("should query existing consent status", async () => {
    const res = await netgsm.iys.queryConsent({
      brandCode,
      recipient,
      type: IysAddressType.MESAJ,
      recipientType: IysRecipientType.BIREYSEL,
    });

    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
    console.log(`İzin sorgusu sonucu:`, res.data);
  }, 15000);

  // 2. ONAY kaydı oluştur
  it("should save ONAY consent", async () => {
    const res = await netgsm.iys.saveConsents({
      brandCode,
      permissions: [
        {
          recipient,
          recipientType: IysRecipientType.BIREYSEL,
          type: IysAddressType.MESAJ,
          source: IysSource.HS_MESAJ,
          status: IysConsentStatus.ONAY,
          consentDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        },
      ],
    });

    expect(res.success).toBe(true);
    expect(res.data.uid).toBeTruthy();
    console.log(`ONAY kaydı oluşturuldu, uid: ${res.data.uid}`);
  }, 15000);

  // 3. ONAY kaydını doğrula
  it("should confirm ONAY status after save", async () => {
    const res = await netgsm.iys.queryConsent({
      brandCode,
      recipient,
      type: IysAddressType.MESAJ,
      recipientType: IysRecipientType.BIREYSEL,
    });

    expect(res.success).toBe(true);
    const consentRecord = res.data.find((d) => d.type === "MESAJ");
    expect(consentRecord).toBeDefined();
    console.log(`Güncel izin durumu: ${consentRecord?.status}`);
  }, 15000);

  // 4. RET kaydı güncelle
  it("should update consent to RET", async () => {
    const res = await netgsm.iys.saveConsents({
      brandCode,
      permissions: [
        {
          recipient,
          recipientType: IysRecipientType.BIREYSEL,
          type: IysAddressType.MESAJ,
          source: IysSource.HS_MESAJ,
          status: IysConsentStatus.RET,
          consentDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        },
      ],
    });

    expect(res.success).toBe(true);
    expect(res.data.uid).toBeTruthy();
    console.log(`RET kaydı güncellendi, uid: ${res.data.uid}`);
  }, 15000);

  // 5. RET kaydını doğrula
  it("should confirm RET status after update", async () => {
    const res = await netgsm.iys.queryConsent({
      brandCode,
      recipient,
      type: IysAddressType.MESAJ,
      recipientType: IysRecipientType.BIREYSEL,
    });

    expect(res.success).toBe(true);
    const consentRecord = res.data.find((d) => d.type === "MESAJ");
    expect(consentRecord).toBeDefined();
    console.log(`Güncel izin durumu: ${consentRecord?.status}`);
  }, 15000);

  // 6. Webhook kaydet (URL varsa)
  it("should register webhook if IYS_WEBHOOK_URL is provided", async () => {
    if (!process.env.IYS_WEBHOOK_URL) {
      console.log("IYS_WEBHOOK_URL tanımlı değil, test atlanıyor");
      return;
    }

    const res = await netgsm.iys.setWebhook({
      brandCode,
      webhookUrl: process.env.IYS_WEBHOOK_URL,
    });

    expect(res.success).toBe(true);
    expect(res.data.uid).toBeTruthy();
    console.log(`Webhook kaydedildi, uid: ${res.data.uid}`);
  }, 15000);

  // 7. Birden fazla izin kaydı (batch) — aynı tip, farklı numaralar
  it("should save multiple permissions in one request", async () => {
    if (!process.env.TEST_PHONE_NUMBER_2) {
      console.log("TEST_PHONE_NUMBER_2 tanımlı değil, test atlanıyor");
      return;
    }

    const consentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const recipient2 = toIysRecipient(process.env.TEST_PHONE_NUMBER_2);

    const res = await netgsm.iys.saveConsents({
      brandCode,
      permissions: [
        {
          recipient,
          recipientType: IysRecipientType.BIREYSEL,
          type: IysAddressType.MESAJ,
          source: IysSource.HS_MESAJ,
          status: IysConsentStatus.ONAY,
          consentDate,
        },
        {
          recipient: recipient2,
          recipientType: IysRecipientType.BIREYSEL,
          type: IysAddressType.MESAJ,
          source: IysSource.HS_MESAJ,
          status: IysConsentStatus.ONAY,
          consentDate,
        },
      ],
    });

    expect(res.success).toBe(true);
    console.log(`Batch izin kaydı uid: ${res.data.uid}`);
  }, 15000);
});
