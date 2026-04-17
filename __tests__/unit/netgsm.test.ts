import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import fetchMock from "jest-fetch-mock";

import {
  BalanceType,
  CancelErrorCode,
  InboxErrorCode,
  MsgHeaderErrorCode,
  OperatorCode,
  ReportErrorCode,
  SendOtpSmsErrorCode,
  SendSmsErrorCode,
  StatsErrorCode,
} from "../../src/enums";
import Netgsm from "../../src/netgsm";

fetchMock.enableMocks();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ok = (body: object, status = 200) =>
  fetchMock.mockResponseOnce(JSON.stringify(body), { status });

const err = (body: object, status = 406) =>
  fetchMock.mockResponseOnce(JSON.stringify(body), { status });

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Netgsm Unit Tests", () => {
  let netgsm: Netgsm;

  beforeEach(() => {
    fetchMock.resetMocks();
    netgsm = new Netgsm({ username: "test-user", password: "test-pass" });
  });

  // =========================================================================
  // Constructor
  // =========================================================================

  describe("Constructor", () => {
    it("should throw when username is missing", () => {
      expect(() => new Netgsm({ username: "", password: "pass" })).toThrow(
        "Username and password are required"
      );
    });

    it("should throw when password is missing", () => {
      expect(() => new Netgsm({ username: "user", password: "" })).toThrow(
        "Username and password are required"
      );
    });

    it("should expose sms and iys module instances", () => {
      expect(netgsm.sms).toBeDefined();
      expect(netgsm.iys).toBeDefined();
    });

    it("should append -sdk-js to appname and send it in the request body", async () => {
      const client = new Netgsm({ username: "u", password: "p", appname: "myapp" });
      ok({ code: "00", description: "ok", jobid: "1" });

      await client.sms.send({ msgheader: "T", messages: [{ msg: "m", no: "5" }] });

      const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
      expect(body.appname).toBe("myapp-sdk-js");
    });

    it("should prefer payload appname over sdkAppName", async () => {
      const client = new Netgsm({ username: "u", password: "p", appname: "sdk" });
      ok({ code: "00", description: "ok", jobid: "1" });

      await client.sms.send({
        msgheader: "T",
        messages: [{ msg: "m", no: "5" }],
        appname: "custom-app",
      });

      const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
      expect(body.appname).toBe("custom-app");
    });
  });

  // =========================================================================
  // SMS Module
  // =========================================================================

  describe("SMS Module — netgsm.sms", () => {
    // -----------------------------------------------------------------------
    // send
    // -----------------------------------------------------------------------

    describe("send", () => {
      const payload = {
        msgheader: "TEST",
        messages: [{ msg: "Hello", no: "5551234567" }],
      };

      it("should send SMS successfully", async () => {
        ok({ code: "00", jobid: "12345", description: "Success" });

        const res = await netgsm.sms.send(payload);

        expect(res).toEqual({ code: "00", jobid: "12345", description: "Success" });
        expect(fetchMock.mock.calls[0][0]).toContain("/sms/rest/v2/send");
      });

      it("should send multiple messages successfully", async () => {
        ok({ code: "00", jobid: "1,2", description: "Success" });

        const res = await netgsm.sms.send({
          msgheader: "TEST",
          messages: [
            { msg: "msg1", no: "5551111111" },
            { msg: "msg2", no: "5552222222" },
          ],
        });

        expect(res.jobid).toBe("1,2");
      });

      it("should forward optional fields in the request body", async () => {
        ok({ code: "00", jobid: "1", description: "ok" });

        await netgsm.sms.send({
          ...payload,
          iysfilter: "1",
          partnercode: "PC1",
          encoding: "TR",
          startdate: "01012025120000",
          stopdate: "01012025130000",
        });

        const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
        expect(body.iysfilter).toBe("1");
        expect(body.partnercode).toBe("PC1");
        expect(body.encoding).toBe("TR");
        expect(body.startdate).toBe("01012025120000");
        expect(body.stopdate).toBe("01012025130000");
      });

      it("should throw on API error", async () => {
        err({ code: "40", jobid: null, description: "Invalid header" });

        await expect(netgsm.sms.send(payload)).rejects.toEqual({
          status: 406,
          code: SendSmsErrorCode.INVALID_HEADER,
          jobid: null,
          description: "Invalid header",
        });
      });

      it("should throw on network error", async () => {
        fetchMock.mockReject(new Error("Network error"));

        await expect(netgsm.sms.send(payload)).rejects.toThrow("Network error");
      });

      it("should normalize unknown error code to 5000", async () => {
        err({ code: "999", jobid: null, description: "Unknown" });

        await expect(netgsm.sms.send(payload)).rejects.toMatchObject({
          code: SendSmsErrorCode.UNDEFINED_ERROR,
        });
      });

      it("should normalize missing error code to 5000", async () => {
        err({ jobid: null, description: "No code" });

        await expect(netgsm.sms.send(payload)).rejects.toMatchObject({
          code: SendSmsErrorCode.UNDEFINED_ERROR,
        });
      });
    });

    // -----------------------------------------------------------------------
    // sendOtp
    // -----------------------------------------------------------------------

    describe("sendOtp", () => {
      const payload = { msgheader: "TEST", msg: "Your OTP: 1234", no: "5551234567" };

      it("should send OTP SMS successfully", async () => {
        ok({ code: "00", description: "Success", jobId: "99" });

        const res = await netgsm.sms.sendOtp(payload);

        expect(res.code).toBe(SendOtpSmsErrorCode.SUCCESS);
        expect(res.jobId).toBe("99");
        expect(fetchMock.mock.calls[0][0]).toContain("/sms/rest/v2/otp");
      });

      it("should forward msg and no in the request body", async () => {
        ok({ code: "00", description: "ok" });

        await netgsm.sms.sendOtp(payload);

        const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
        expect(body.msg).toBe("Your OTP: 1234");
        expect(body.no).toBe("5551234567");
      });

      it("should throw on API error (long message)", async () => {
        err({ code: "20", description: "Message too long" });

        await expect(netgsm.sms.sendOtp(payload)).rejects.toMatchObject({
          code: SendOtpSmsErrorCode.MESSAGE_TEXT_ERROR,
          status: 406,
        });
      });

      it("should throw on API error (invalid number)", async () => {
        err({ code: "50", description: "number format" });

        await expect(netgsm.sms.sendOtp(payload)).rejects.toMatchObject({
          code: SendOtpSmsErrorCode.CHECK_NUMBER_50,
        });
      });

      it("should throw on network error", async () => {
        fetchMock.mockReject(new Error("Network error"));

        await expect(netgsm.sms.sendOtp(payload)).rejects.toThrow("Network error");
      });
    });

    // -----------------------------------------------------------------------
    // cancel
    // -----------------------------------------------------------------------

    describe("cancel", () => {
      const payload = { jobid: "12345" };

      it("should cancel SMS successfully", async () => {
        ok({ code: "00", jobid: "12345", description: "Cancelled" });

        const res = await netgsm.sms.cancel(payload);

        expect(res.code).toBe(CancelErrorCode.SUCCESS);
        expect(fetchMock.mock.calls[0][0]).toContain("/sms/rest/v2/cancel");
      });

      it("should throw when job ID is not found", async () => {
        err({ code: "60", jobid: "12345", description: "Not found" });

        await expect(netgsm.sms.cancel(payload)).rejects.toEqual({
          status: 406,
          code: CancelErrorCode.JOB_ID_NOT_FOUND,
          jobid: "12345",
          description: "Not found",
        });
      });

      it("should throw on network error", async () => {
        fetchMock.mockReject(new Error("Network error"));

        await expect(netgsm.sms.cancel(payload)).rejects.toThrow("Network error");
      });
    });

    // -----------------------------------------------------------------------
    // getReport
    // -----------------------------------------------------------------------

    describe("getReport", () => {
      const payload = {
        bulkIds: ["12345"],
        startdate: "01.01.2024 00:00:00",
        stopdate: "31.01.2024 23:59:59",
      };

      it("should fetch report successfully", async () => {
        ok({
          code: "00",
          description: "Success",
          jobs: [
            {
              jobid: "12345",
              status: 1,
              number: "5551234567",
              operator: OperatorCode.TURKCELL,
              msglen: 10,
            },
          ],
        });

        const res = await netgsm.sms.getReport(payload);

        expect(res.jobs).toHaveLength(1);
        expect(res.jobs?.[0].operator).toBe(OperatorCode.TURKCELL);
        expect(fetchMock.mock.calls[0][0]).toContain("/sms/rest/v2/report");
      });

      it("should return multiple jobs", async () => {
        ok({
          code: "00",
          description: "Success",
          jobs: [
            { jobid: "1", status: 1, number: "555", operator: OperatorCode.TURKCELL, msglen: 5 },
            { jobid: "2", status: 0, number: "556", operator: OperatorCode.VODAFONE, msglen: 5 },
          ],
        });

        const res = await netgsm.sms.getReport({ ...payload, bulkIds: ["1", "2"] });

        expect(res.jobs).toHaveLength(2);
        expect(res.jobs?.[1].operator).toBe(OperatorCode.VODAFONE);
      });

      it("should return empty jobs array", async () => {
        ok({ code: "00", description: "Success", jobs: [] });

        const res = await netgsm.sms.getReport(payload);

        expect(res.jobs).toHaveLength(0);
      });

      it("should throw on API error", async () => {
        err({ code: "70", description: "Invalid date format" });

        await expect(netgsm.sms.getReport(payload)).rejects.toEqual({
          status: 406,
          code: ReportErrorCode.PARAMETER_ERROR,
          description: "Invalid date format",
        });
      });
    });

    // -----------------------------------------------------------------------
    // getStats
    // -----------------------------------------------------------------------

    describe("getStats", () => {
      const payload = { jobid: "12345" };

      it("should fetch stats successfully", async () => {
        ok({
          code: "00",
          description: "Success",
          stats: [
            {
              status: "DELIVERED",
              totalMessageLength: 1,
              totalSms: 1,
              chargeStatement: "1",
              statement: "ok",
              domestic: true,
            },
          ],
        });

        const res = await netgsm.sms.getStats(payload);

        expect(res.stats).toHaveLength(1);
        expect(res.stats?.[0].status).toBe("DELIVERED");
        expect(fetchMock.mock.calls[0][0]).toContain("/sms/rest/v2/stats");
      });

      it("should forward optional senddate and appname", async () => {
        ok({ code: "00", description: "ok", stats: [] });

        await netgsm.sms.getStats({ jobid: "1", senddate: "01012024", appname: "myapp" });

        const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
        expect(body.sendDate).toBe("01012024");
        expect(body.appname).toBe("myapp");
      });

      it("should throw on API error", async () => {
        err({ code: "70", description: "Missing jobid" });

        await expect(netgsm.sms.getStats(payload)).rejects.toMatchObject({
          code: StatsErrorCode.PARAMETER_ERROR,
        });
      });
    });

    // -----------------------------------------------------------------------
    // getHeaders
    // -----------------------------------------------------------------------

    describe("getHeaders", () => {
      it("should fetch headers successfully", async () => {
        ok({ code: "00", msgheaders: ["BRAND1", "BRAND2"], description: "ok" });

        const res = await netgsm.sms.getHeaders({ appname: "test" });

        expect(res.msgheaders).toEqual(["BRAND1", "BRAND2"]);
        expect(fetchMock.mock.calls[0][0]).toContain("/sms/rest/v2/msgheader");
      });

      it("should work without a payload", async () => {
        ok({ code: "00", msgheaders: ["BRAND1"], description: "ok" });

        const res = await netgsm.sms.getHeaders();

        expect(res.msgheaders?.[0]).toBe("BRAND1");
      });

      it("should include appname as a query param when provided", async () => {
        ok({ code: "00", msgheaders: [], description: "ok" });

        await netgsm.sms.getHeaders({ appname: "myapp" });

        expect(fetchMock.mock.calls[0][0]).toContain("appname=myapp");
      });

      it("should throw on auth error", async () => {
        err({ code: "30", description: "Invalid authentication" });

        await expect(netgsm.sms.getHeaders()).rejects.toEqual({
          status: 406,
          code: MsgHeaderErrorCode.INVALID_AUTH,
          description: "Invalid authentication",
        });
      });

      it("should throw when no headers found", async () => {
        ok({ code: "70", description: "msgheader not found" });

        await expect(netgsm.sms.getHeaders()).rejects.toMatchObject({
          code: MsgHeaderErrorCode.PARAMETER_ERROR,
        });
      });
    });

    // -----------------------------------------------------------------------
    // getInbox
    // -----------------------------------------------------------------------

    describe("getInbox", () => {
      const payload = { startdate: "01012024000000", stopdate: "31012024235959" };

      it("should fetch inbox messages successfully", async () => {
        ok({
          code: "00",
          description: "Success",
          messages: [
            { message: "Hello", sender: "5551234567", receiver: "8503050000", datetime: "15.01.2024 14:30:00" },
          ],
        });

        const res = await netgsm.sms.getInbox(payload);

        expect(res.messages).toHaveLength(1);
        expect(res.messages?.[0].message).toBe("Hello");
        expect(fetchMock.mock.calls[0][0]).toContain("/sms/rest/v2/inbox");
      });

      it("should append date params as query strings", async () => {
        ok({ code: "00", description: "ok", messages: [] });

        await netgsm.sms.getInbox(payload);

        const url = fetchMock.mock.calls[0][0] as string;
        expect(url).toContain("startdate=01012024000000");
        expect(url).toContain("stopdate=31012024235959");
      });

      it("should return multiple messages", async () => {
        ok({
          code: "00",
          description: "Success",
          messages: [
            { message: "msg1", sender: "111", receiver: "222", datetime: "01.01.2024" },
            { message: "msg2", sender: "333", receiver: "222", datetime: "02.01.2024" },
          ],
        });

        const res = await netgsm.sms.getInbox(payload);

        expect(res.messages).toHaveLength(2);
      });

      it("should return empty messages array", async () => {
        ok({ code: "00", description: "Success", messages: [] });

        const res = await netgsm.sms.getInbox(payload);

        expect(res.messages).toHaveLength(0);
      });

      it("should throw on API error", async () => {
        err({ code: "70", description: "Invalid date format" });

        await expect(netgsm.sms.getInbox({ startdate: "bad", stopdate: "bad" })).rejects.toEqual({
          status: 406,
          code: InboxErrorCode.PARAMETER_ERROR,
          description: "Invalid date format",
        });
      });
    });

    // -----------------------------------------------------------------------
    // checkBalance
    // -----------------------------------------------------------------------

    describe("checkBalance", () => {
      it("should fetch package balance successfully", async () => {
        ok({
          balance: [
            { amount: 399, balance_name: "SMS Count" },
            { amount: 11, balance_name: "Voice Message" },
          ],
        });

        const res = await netgsm.sms.checkBalance({ stip: BalanceType.PACKAGE });

        expect(Array.isArray(res.balance)).toBe(true);
        if (Array.isArray(res.balance)) {
          expect(res.balance[0].amount).toBe(399);
        }
      });

      it("should fetch credit balance successfully", async () => {
        ok({ code: "00", balance: "57,860" });

        const res = await netgsm.sms.checkBalance({ stip: BalanceType.CREDIT });

        expect(res.balance).toBe("57,860");
      });

      it("should forward appkey in the request body when provided", async () => {
        ok({ balance: [] });

        await netgsm.sms.checkBalance({ stip: BalanceType.PACKAGE, appkey: "ak-123" });

        const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
        expect(body.appkey).toBe("ak-123");
      });

      it("should not include appkey in body when not provided", async () => {
        ok({ balance: [] });

        await netgsm.sms.checkBalance({ stip: BalanceType.PACKAGE });

        const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
        expect(body.appkey).toBeUndefined();
      });

      it("should throw on non-200 status", async () => {
        err({ code: "30", description: "Invalid authentication" }, 406);

        await expect(netgsm.sms.checkBalance({ stip: BalanceType.PACKAGE })).rejects.toMatchObject({
          status: 406,
          code: "30",
        });
      });
    });
  });

  // =========================================================================
  // HTTP / client error paths
  // =========================================================================

  describe("Client error handling", () => {
    const payload = { msgheader: "T", messages: [{ msg: "m", no: "5" }] };

    it("should throw PARSE_ERROR when response is not valid JSON", async () => {
      fetchMock.mockResponseOnce("not-json-{{{}}}");

      await expect(netgsm.sms.send(payload)).rejects.toMatchObject({
        code: "PARSE_ERROR",
      });
    });

    it("should throw INVALID_RESPONSE when response body is null", async () => {
      fetchMock.mockResponseOnce("null");

      await expect(netgsm.sms.send(payload)).rejects.toMatchObject({
        code: "INVALID_RESPONSE",
      });
    });

    it("should throw with HTTP status on 5xx errors", async () => {
      err({ description: "Internal Server Error" }, 500);

      await expect(netgsm.sms.send(payload)).rejects.toMatchObject({ status: 500 });
    });

    it("should throw with HTTP status on 401 error", async () => {
      err({ description: "Unauthorized" }, 401);

      await expect(netgsm.sms.send(payload)).rejects.toMatchObject({ status: 401 });
    });
  });

  // =========================================================================
  // Deprecated API — shim'lerin modüle delegate ettiğini doğrula
  // =========================================================================

  describe("Deprecated API — backward compatibility", () => {
    const smsSpy = () => fetchMock.mock.calls[0][0] as string;

    it("sendRestSms should delegate to sms.send", async () => {
      const spy = jest.spyOn(netgsm.sms, "send").mockResolvedValue({
        code: SendSmsErrorCode.SUCCESS,
        description: "ok",
        jobid: "1",
      });
      const payload = { msgheader: "T", messages: [{ msg: "m", no: "5" }] };

      await netgsm.sendRestSms(payload);

      expect(spy).toHaveBeenCalledWith(payload);
      spy.mockRestore();
    });

    it("sendOtpSms should delegate to sms.sendOtp", async () => {
      const spy = jest.spyOn(netgsm.sms, "sendOtp").mockResolvedValue({
        code: SendOtpSmsErrorCode.SUCCESS,
        description: "ok",
      });
      const payload = { msgheader: "T", msg: "otp", no: "5" };

      await netgsm.sendOtpSms(payload);

      expect(spy).toHaveBeenCalledWith(payload);
      spy.mockRestore();
    });

    it("cancelSms should delegate to sms.cancel", async () => {
      const spy = jest.spyOn(netgsm.sms, "cancel").mockResolvedValue({
        code: CancelErrorCode.SUCCESS,
        description: "ok",
      });
      const payload = { jobid: "123" };

      await netgsm.cancelSms(payload);

      expect(spy).toHaveBeenCalledWith(payload);
      spy.mockRestore();
    });

    it("getReport should delegate to sms.getReport", async () => {
      const spy = jest.spyOn(netgsm.sms, "getReport").mockResolvedValue({
        code: ReportErrorCode.SUCCESS,
        description: "ok",
      });
      const payload = { bulkIds: ["1"] };

      await netgsm.getReport(payload);

      expect(spy).toHaveBeenCalledWith(payload);
      spy.mockRestore();
    });

    it("getStats should delegate to sms.getStats", async () => {
      const spy = jest.spyOn(netgsm.sms, "getStats").mockResolvedValue({
        code: StatsErrorCode.SUCCESS,
        description: "ok",
      });
      const payload = { jobid: "1" };

      await netgsm.getStats(payload);

      expect(spy).toHaveBeenCalledWith(payload);
      spy.mockRestore();
    });

    it("getHeaders should delegate to sms.getHeaders", async () => {
      const spy = jest.spyOn(netgsm.sms, "getHeaders").mockResolvedValue({
        code: MsgHeaderErrorCode.SUCCESS,
        description: "ok",
        msgheaders: [],
      });
      const payload = { appname: "test" };

      await netgsm.getHeaders(payload);

      expect(spy).toHaveBeenCalledWith(payload);
      spy.mockRestore();
    });

    it("getInbox should delegate to sms.getInbox", async () => {
      const spy = jest.spyOn(netgsm.sms, "getInbox").mockResolvedValue({
        code: InboxErrorCode.SUCCESS,
        description: "ok",
      });
      const payload = { startdate: "01012024" };

      await netgsm.getInbox(payload);

      expect(spy).toHaveBeenCalledWith(payload);
      spy.mockRestore();
    });

    it("checkBalance should delegate to sms.checkBalance", async () => {
      const spy = jest.spyOn(netgsm.sms, "checkBalance").mockResolvedValue({
        balance: "100",
      });
      const payload = { stip: BalanceType.CREDIT };

      await netgsm.checkBalance(payload);

      expect(spy).toHaveBeenCalledWith(payload);
      spy.mockRestore();
    });

    it("deprecated sendRestSms should return correct data end-to-end", async () => {
      ok({ code: "00", jobid: "42", description: "ok" });

      const res = await netgsm.sendRestSms({
        msgheader: "T",
        messages: [{ msg: "m", no: "5" }],
      });

      expect(res.jobid).toBe("42");
      expect(smsSpy()).toContain("/sms/rest/v2/send");
    });
  });
});
