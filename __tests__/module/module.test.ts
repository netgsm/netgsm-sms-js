describe("Module System Compatibility", () => {
  it("should work with ESM import", async () => {
    const { default: Netgsm } = await import("../../src/netgsm");
    expect(Netgsm).toBeDefined();

    const instance = new Netgsm({
      userCode: "test",
      password: "test",
    });
    expect(instance).toBeInstanceOf(Netgsm);
  });
});
