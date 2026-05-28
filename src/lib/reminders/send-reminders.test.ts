import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { formatPolicyDetails, sendWhatsAppMessage } from "./send-reminders";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => Promise.resolve({ data: [], error: null })),
          then: Promise.resolve({ data: [], error: null }),
        })),
        then: Promise.resolve({ data: [], error: null }),
      })),
    })),
  }),
}));

describe("formatPolicyDetails", () => {
  it("formats policy details into a string", () => {
    const policies = [
      { policyNumber: "POL-001", insuranceTypeName: "LIC", remaining: 10000 },
    ];
    const result = formatPolicyDetails(policies as Parameters<typeof formatPolicyDetails>[0]);
    expect(result).toContain("POL-001");
    expect(result).toContain("LIC");
    expect(result).toContain("10,000");
  });
});

describe("sendWhatsAppMessage", () => {
  beforeEach(() => {
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "test-phone-id");
    vi.stubEnv("WHATSAPP_ACCESS_TOKEN", "test-token");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("posts to Meta API", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ messages: [{ id: "msg1" }] }) });
    const result = await sendWhatsAppMessage("+1234567890", "Test Name", "Details");
    expect(result).toEqual({ success: true, messageId: "msg1" });
  });

  it("handles API errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => ({ error: { message: "Invalid template" } }),
    });
    const result = await sendWhatsAppMessage("+1234567890", "Test Name", "Details");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("handles missing env vars", async () => {
    vi.unstubAllEnvs();
    const result = await sendWhatsAppMessage("+1234567890", "Test Name", "Details");
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/missing/i);
  });
});
