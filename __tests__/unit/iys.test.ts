import { describe, expect, it, beforeEach } from "@jest/globals";
import fetchMock from "jest-fetch-mock";

import {
  IysAddressType,
  IysConsentStatus,
  IysRecipientType,
  IysSource,
} from "../../src/enums";
import Netgsm from "../../src/netgsm";

fetchMock.enableMocks();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const loginOk = (token = "test-token") =>
  fetchMock.mockResponseOnce(
    JSON.stringify({
      success: true,
      errorCode: 0,
      message: "success",
      data: {
        access_token: token,
        profile: { userid: 1, username: "test", usercode: "test", aboneno: "test", aboneid: 1 },
      },
    }),
    { status: 200 }
  );

const iysOk = (data: object) =>
  fetchMock.mockResponseOnce(
    JSON.stringify({ success: true, errorCode: 0, message: "success", data }),
    { status: 200 }
  );

const iysFail = (errorCode: number, message: string, status = 200) =>
  fetchMock.mockResponseOnce(
    JSON.stringify({ success: false, errorCode, message, data: [] }),
    { status }
  );

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("IYS Module", () => {
  let netgsm: Netgsm;

  beforeEach(() => {
    fetchMock.resetMocks();
    netgsm = new Netgsm({ username: "test-user", password: "test-pass" });
  });

  // =========================================================================
  // queryConsent
  // =========================================================================

  describe("queryConsent", () => {
    const params = { brandCode: 123456, recipient: "+905555555555" };
    const consentItem = {
      type: "MESAJ",
      source: "HS_MESAJ",
      recipient: "+905555555555",
      status: "ONAY",
      consentDate: "2020-07-09 17:20:00",
      recipientType: "BIREYSEL",
      creationDate: null,
      queryStatus: "success",
    };

    it("should query consent successfully", async () => {
      loginOk();
      iysOk([consentItem]);

      const res = await netgsm.iys.queryConsent(params);

      expect(res.success).toBe(true);
      expect(res.data).toHaveLength(1);
      expect(res.data[0].status).toBe("ONAY");
    });

    it("should call IYS base URL", async () => {
      loginOk();
      iysOk([consentItem]);

      await netgsm.iys.queryConsent(params);

      const url = fetchMock.mock.calls[1][0] as string;
      expect(url).toContain("ext-api.netgsm.com.tr");
      expect(url).toContain("/iys/v1/consents");
    });

    it("should send Bearer token in Authorization header", async () => {
      loginOk("my-access-token");
      iysOk([consentItem]);

      await netgsm.iys.queryConsent(params);

      const headers = fetchMock.mock.calls[1][1]?.headers as Record<string, string>;
      expect(headers["Authorization"]).toBe("Bearer my-access-token");
    });

    it("should append required query params to URL", async () => {
      loginOk();
      iysOk([consentItem]);

      await netgsm.iys.queryConsent(params);

      const url = fetchMock.mock.calls[1][0] as string;
      expect(url).toContain("brandCode=123456");
      expect(url).toContain("recipient=");
    });

    it("should append optional query params when provided", async () => {
      loginOk();
      iysOk([consentItem]);

      await netgsm.iys.queryConsent({
        ...params,
        type: IysAddressType.MESAJ,
        recipientType: IysRecipientType.BIREYSEL,
        refId: "ref-123",
      });

      const url = fetchMock.mock.calls[1][0] as string;
      expect(url).toContain("type=MESAJ");
      expect(url).toContain("recipientType=BIREYSEL");
      expect(url).toContain("path=SMSAPI");
      expect(url).toContain("refId=ref-123");
    });

    it("should not append optional params when omitted", async () => {
      loginOk();
      iysOk([]);

      await netgsm.iys.queryConsent(params);

      const url = fetchMock.mock.calls[1][0] as string;
      expect(url).not.toContain("type=");
      expect(url).toContain("path=SMSAPI");
      expect(url).not.toContain("refId=");
    });

    it("should throw on API error", async () => {
      loginOk();
      iysFail(112, "Api Error");

      await expect(netgsm.iys.queryConsent(params)).rejects.toEqual({
        code: 112,
        description: "Api Error",
      });
    });

    it("should throw on login failure", async () => {
      iysFail(60, "Invalid credentials.");

      await expect(netgsm.iys.queryConsent(params)).rejects.toEqual({
        code: 60,
        description: "Invalid credentials.",
      });
    });
  });

  // =========================================================================
  // saveConsents
  // =========================================================================

  describe("saveConsents", () => {
    const permission = {
      recipient: "+905555555555",
      recipientType: IysRecipientType.BIREYSEL,
      type: IysAddressType.MESAJ,
      source: IysSource.HS_MESAJ,
      status: IysConsentStatus.ONAY,
      consentDate: "2026-02-20 16:46:00",
    };
    const params = {
      brandCode: 123456,
      permissions: [permission],
    };

    it("should save consents successfully", async () => {
      loginOk();
      iysOk({ uid: "ee5c7e61-3940-432a-af30-13b0c9944371" });

      const res = await netgsm.iys.saveConsents(params);

      expect(res.success).toBe(true);
      expect(res.data.uid).toBe("ee5c7e61-3940-432a-af30-13b0c9944371");
    });

    it("should POST to /iys/v1/consents", async () => {
      loginOk();
      iysOk({ uid: "abc" });

      await netgsm.iys.saveConsents(params);

      const url = fetchMock.mock.calls[1][0] as string;
      expect(url).toContain("/iys/v1/consents");
      expect(fetchMock.mock.calls[1][1]?.method).toBe("POST");
    });

    it("should send correct body", async () => {
      loginOk();
      iysOk({ uid: "abc" });

      await netgsm.iys.saveConsents(params);

      const body = JSON.parse(fetchMock.mock.calls[1][1]?.body as string);
      expect(body.brandCode).toBe(123456);
      expect(body.path).toBe("SMSAPI");
      expect(body.permissions).toHaveLength(1);
      expect(body.permissions[0].status).toBe("ONAY");
      expect(body.permissions[0].source).toBe("HS_MESAJ");
    });

    it("should include optional refId when provided", async () => {
      loginOk();
      iysOk({ uid: "abc" });

      await netgsm.iys.saveConsents({ ...params, refId: "ref-456" });

      const body = JSON.parse(fetchMock.mock.calls[1][1]?.body as string);
      expect(body.refId).toBe("ref-456");
    });

    it("should throw on API error", async () => {
      loginOk();
      iysFail(112, "Api Error");

      await expect(netgsm.iys.saveConsents(params)).rejects.toEqual({
        code: 112,
        description: "Api Error",
      });
    });
  });

  // =========================================================================
  // setWebhook
  // =========================================================================

  describe("setWebhook", () => {
    const params = { brandCode: 123456, webhookUrl: "https://example.com/webhook" };

    it("should set webhook successfully", async () => {
      loginOk();
      iysOk({ uid: "ee5c7e61-3940-432a-af30-13b0c9944371" });

      const res = await netgsm.iys.setWebhook(params);

      expect(res.success).toBe(true);
      expect(res.data.uid).toBeDefined();
    });

    it("should POST to /iys/v1/webhooks", async () => {
      loginOk();
      iysOk({ uid: "abc" });

      await netgsm.iys.setWebhook(params);

      const url = fetchMock.mock.calls[1][0] as string;
      expect(url).toContain("/iys/v1/webhooks");
      expect(fetchMock.mock.calls[1][1]?.method).toBe("POST");
    });

    it("should send brandCode and webhookUrl in body", async () => {
      loginOk();
      iysOk({ uid: "abc" });

      await netgsm.iys.setWebhook(params);

      const body = JSON.parse(fetchMock.mock.calls[1][1]?.body as string);
      expect(body.brandCode).toBe(123456);
      expect(body.webhookUrl).toBe("https://example.com/webhook");
    });

    it("should always include path=SMSAPI in body", async () => {
      loginOk();
      iysOk({ uid: "abc" });

      await netgsm.iys.setWebhook(params);

      const body = JSON.parse(fetchMock.mock.calls[1][1]?.body as string);
      expect(body.path).toBe("SMSAPI");
    });

    it("should throw on API error", async () => {
      loginOk();
      iysFail(112, "Api Error");

      await expect(netgsm.iys.setWebhook(params)).rejects.toEqual({
        code: 112,
        description: "Api Error",
      });
    });
  });

  // =========================================================================
  // Token management
  // =========================================================================

  describe("Token management", () => {
    it("should login only once for multiple consecutive requests", async () => {
      loginOk();
      iysOk({ uid: "1" });
      iysOk({ uid: "2" });

      const params = { brandCode: 123456, webhookUrl: "https://example.com/w" };
      await netgsm.iys.setWebhook(params);
      await netgsm.iys.setWebhook(params);

      const loginCalls = fetchMock.mock.calls.filter((c) =>
        (c[0] as string).includes("/iys/v1/auth/login")
      );
      expect(loginCalls).toHaveLength(1);
    });

    it("should re-login and retry once on 401 response", async () => {
      loginOk();
      iysFail(53, "Token has expired", 401);
      loginOk("new-token");
      iysOk({ uid: "abc" });

      const res = await netgsm.iys.setWebhook({
        brandCode: 123456,
        webhookUrl: "https://example.com/w",
      });

      expect(res.success).toBe(true);

      const loginCalls = fetchMock.mock.calls.filter((c) =>
        (c[0] as string).includes("/iys/v1/auth/login")
      );
      expect(loginCalls).toHaveLength(2);
    });

    it("should use refreshed token after re-login", async () => {
      loginOk("old-token");
      iysFail(53, "Token has expired", 401);
      loginOk("new-token");
      iysOk({ uid: "abc" });

      await netgsm.iys.setWebhook({ brandCode: 123456, webhookUrl: "https://example.com/w" });

      const retryHeaders = fetchMock.mock.calls[3][1]?.headers as Record<string, string>;
      expect(retryHeaders["Authorization"]).toBe("Bearer new-token");
    });
  });
});
