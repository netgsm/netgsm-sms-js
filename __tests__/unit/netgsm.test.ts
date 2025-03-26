import { describe, expect, it, beforeEach } from "@jest/globals";
import fetchMock from "jest-fetch-mock";

import { ApiErrorCode, BalanceType, OperatorCode } from "../../src/enums";
import Netgsm from "../../src/netgsm";

fetchMock.enableMocks();

describe("Netgsm Unit Tests", () => {
  let netgsm: Netgsm;

  beforeEach(() => {
    fetchMock.resetMocks();
    netgsm = new Netgsm({
      username: "test-user",
      password: "test-pass",
    });
  });

  describe("sendRestSms", () => {
    const validPayload = {
      msgheader: "TEST",
      messages: [
        {
          msg: "Test message",
          no: "5551234567",
        },
      ],
    };

    it("should send SMS successfully using REST v2 API", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "00",
          jobid: "12345",
          description: "Success",
        })
      );

      const response = await netgsm.sendRestSms(validPayload);

      expect(response).toEqual({
        code: "00",
        jobid: "12345",
        description: "Success",
      });
    });

    it("should send multiple SMS successfully using REST v2 API", async () => {
      const multipleMessages = {
        msgheader: "TEST",
        messages: [
          { msg: "Test message 1", no: "5551234567" },
          { msg: "Test message 2", no: "5557654321" },
        ],
      };

      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "00",
          jobid: "12345,12346",
          description: "Success",
        })
      );

      const response = await netgsm.sendRestSms(multipleMessages);
      expect(response.jobid).toBe("12345,12346");
    });

    it("should handle API errors with status code for REST v2 API", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "40",
          jobid: null,
          description: "Check the msgheader parameter",
        }),
        {
          status: 406,
          statusText: "Not Acceptable",
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );

      await expect(netgsm.sendRestSms(validPayload)).rejects.toEqual({
        status: 406,
        code: "40",
        jobid: null,
        description: "Check the msgheader parameter",
      });
    });

    it("should handle network errors for REST v2 API", async () => {
      fetchMock.mockReject(new Error("Network error"));

      await expect(netgsm.sendRestSms(validPayload)).rejects.toThrow("Network error");
    });
  });

  describe("cancelSms", () => {
    const validPayload = { jobid: "12345" };

    it("should cancel SMS successfully", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "00",
          jobid: "12345",
          description: "Success",
        })
      );

      const result = await netgsm.cancelSms(validPayload);
      expect(result).toEqual({
        code: "00",
        jobid: "12345",
        description: "Success",
      });
    });

    it("should handle API errors when cancelling SMS", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "60",
          jobid: "12345",
          description: "Error occurred",
        })
      );

      await expect(netgsm.cancelSms(validPayload)).rejects.toEqual({
        status: 406,
        code: "60",
        jobid: "12345",
        description: "Error occurred",
      });
    });

    it("should handle network errors when cancelling SMS", async () => {
      fetchMock.mockReject(new Error("Network error"));

      await expect(netgsm.cancelSms(validPayload)).rejects.toThrow("Network error");
    });
  });

  describe("getReport", () => {
    const validPayload = {
      bulkIds: ["12345"],
      startdate: "01.01.2023 00:00:00",
      stopdate: "31.01.2023 23:59:59",
      pageNumber: 0,
      pageSize: 10,
    };

    it("should fetch report successfully using REST v2 API", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "00",
          description: "Success",
          jobs: [
            {
              jobid: "12345",
              status: 1,
              number: "5551234567",
              operator: OperatorCode.TURKCELL,
              msglen: 10,
              deliveredDate: "2023-01-15 14:30:00",
            },
          ],
        })
      );

      const response = await netgsm.getReport(validPayload);
      expect(response.jobs).toBeDefined();
      expect(response.jobs?.[0].status).toBe(1);
      expect(response.jobs?.[0].operator).toBe(OperatorCode.TURKCELL);
    });

    it("should fetch multiple reports successfully using REST v2 API", async () => {
      const multipleReports = {
        ...validPayload,
        bulkIds: ["12345", "12346"],
      };

      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "00",
          description: "Success",
          jobs: [
            { jobid: "12345", status: 0, number: "5551234567", operator: OperatorCode.TURKCELL },
            { jobid: "12346", status: 1, number: "5557654321", operator: OperatorCode.VODAFONE },
          ],
        })
      );

      const response = await netgsm.getReport(multipleReports);
      expect(response.jobs?.length).toBe(2);
      expect(response.jobs?.[1].status).toBe(1);
      expect(response.jobs?.[1].operator).toBe(OperatorCode.VODAFONE);
    });

    it("should handle empty report response using REST v2 API", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "00",
          description: "Success",
          jobs: [],
        })
      );

      const response = await netgsm.getReport(validPayload);
      expect(response.jobs?.length).toBe(0);
    });

    it("should handle report API errors with status code using REST v2 API", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "80",
          description: "Invalid date format",
        }),
        {
          status: 406,
          statusText: "Not Acceptable",
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );

      await expect(netgsm.getReport(validPayload)).rejects.toEqual({
        status: 406,
        code: "80",
        description: "Invalid date format",
      });
    });
  });

  describe("getHeaders", () => {
    it("should fetch headers successfully", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          msgheaders: ["HEADER1", "HEADER2"],
        })
      );

      const response = await netgsm.getHeaders({ appname: "test-app" });
      expect(response.msgheaders).toBeDefined();
      expect(response.msgheaders?.length).toBe(2);
      expect(response.msgheaders?.[0]).toBe("HEADER1");
    });

    it("should fetch multiple headers successfully", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          msgheaders: ["HEADER1", "HEADER2", "HEADER3"],
        })
      );

      const response = await netgsm.getHeaders();
      expect(response.msgheaders?.length).toBe(3);
      expect(response.msgheaders?.[1]).toBe("HEADER2");
    });

    it("should fetch headers without appname", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          msgheaders: ["HEADER1"],
        })
      );

      const response = await netgsm.getHeaders();
      expect(response.msgheaders).toBeDefined();
      expect(response.msgheaders?.[0]).toBe("HEADER1");
    });

    it("should handle empty header response", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          msgheaders: [],
        })
      );

      const response = await netgsm.getHeaders();
      expect(response.msgheaders?.length).toBe(0);
    });

    it("should handle header query API errors", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: ApiErrorCode.INVALID_AUTH,
          description: "Invalid authentication",
        }),
        {
          status: 406,
          statusText: "Not Acceptable",
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );

      await expect(netgsm.getHeaders()).rejects.toEqual({
        status: 406,
        code: ApiErrorCode.INVALID_AUTH,
        description: "Invalid authentication",
      });
    });
  });

  describe("getInbox", () => {
    it("should fetch inbox messages successfully", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "00",
          description: "Success",
          messages: [
            {
              message: "Test message",
              sender: "5551234567",
              receiver: "8503050000",
              datetime: "15.01.2023 14:30:00",
            },
          ],
        })
      );

      const response = await netgsm.getInbox({
        startdate: "01012023000000",
        stopdate: "31012023235959",
      });

      expect(response.messages).toBeDefined();
      expect(response.messages?.length).toBe(1);
      expect(response.messages?.[0].message).toBe("Test message");
      expect(response.messages?.[0].sender).toBe("5551234567");
    });

    it("should fetch multiple inbox messages successfully", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "00",
          description: "Success",
          messages: [
            {
              message: "Test message 1",
              sender: "5551234567",
              receiver: "8503050000",
              datetime: "15.01.2023 14:30:00",
            },
            {
              message: "Test message 2",
              sender: "5557654321",
              receiver: "8503050000",
              datetime: "16.01.2023 15:45:00",
            },
          ],
        })
      );

      const response = await netgsm.getInbox({
        startdate: "01012023000000",
        stopdate: "31012023235959",
      });

      expect(response.messages?.length).toBe(2);
      expect(response.messages?.[1].message).toBe("Test message 2");
      expect(response.messages?.[1].sender).toBe("5557654321");
    });

    it("should handle empty inbox response", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "00",
          description: "Success",
          messages: [],
        })
      );

      const response = await netgsm.getInbox({
        startdate: "01012023000000",
        stopdate: "31012023235959",
      });

      expect(response.messages?.length).toBe(0);
    });

    it("should handle inbox query API errors", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: "80",
          description: "Invalid date format",
        }),
        {
          status: 406,
          statusText: "Not Acceptable",
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );

      await expect(
        netgsm.getInbox({
          startdate: "invalid-date",
          stopdate: "31012023235959",
        })
      ).rejects.toEqual({
        status: 406,
        code: "80",
        description: "Invalid date format",
      });
    });
  });

  describe("checkBalance", () => {
    it("should fetch package information successfully", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          balance: [
            {
              amount: 399,
              balance_name: "SMS Count",
            },
            {
              amount: 11,
              balance_name: "Voice Message",
            },
          ],
        })
      );

      const response = await netgsm.checkBalance({
        stip: BalanceType.PACKAGE,
      });
      expect(Array.isArray(response.balance)).toBe(true);
      expect(response.balance?.length).toBe(2);
      if (Array.isArray(response.balance)) {
        expect(response.balance[0].amount).toBe(399);
        expect(response.balance[0].balance_name).toBe("SMS Count");
      }
    });

    it("should fetch package information with appkey successfully", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          balance: [
            {
              amount: 399,
              balance_name: "SMS Count",
            },
          ],
        })
      );

      const response = await netgsm.checkBalance({
        stip: BalanceType.PACKAGE,
        appkey: "test-app",
      });
      expect(Array.isArray(response.balance)).toBe(true);
      if (Array.isArray(response.balance)) {
        expect(response.balance[0].amount).toBe(399);
        expect(response.balance[0].balance_name).toBe("SMS Count");
      }
    });

    it("should fetch credit information successfully", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: ApiErrorCode.SUCCESS,
          balance: "57,860",
        })
      );

      const response = await netgsm.checkBalance({
        stip: BalanceType.CREDIT,
      });
      expect(response.code).toBe(ApiErrorCode.SUCCESS);
      expect(response.balance).toBe("57,860");
    });

    it("should handle API errors", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          code: ApiErrorCode.INVALID_AUTH,
          description: "Invalid authentication",
        }),
        {
          status: 406,
          statusText: "Not Acceptable",
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );

      await expect(netgsm.checkBalance({ stip: BalanceType.PACKAGE })).rejects.toEqual({
        status: 406,
        code: ApiErrorCode.INVALID_AUTH,
        description: "Invalid authentication",
      });
    });
  });
});
