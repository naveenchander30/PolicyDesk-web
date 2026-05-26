import { describe, expect, it } from "vitest";
import { getSupabaseEnv } from "./env";

describe("getSupabaseEnv", () => {
  it("returns the Supabase public configuration when both values exist", () => {
    expect(
      getSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key"
      })
    ).toEqual({
      url: "https://example.supabase.co",
      anonKey: "anon-key"
    });
  });

  it("throws a clear error when the Supabase URL is missing", () => {
    expect(() =>
      getSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key"
      })
    ).toThrow("Missing NEXT_PUBLIC_SUPABASE_URL");
  });

  it("throws a clear error when the Supabase anon key is missing", () => {
    expect(() =>
      getSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co"
      })
    ).toThrow("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  });
});
