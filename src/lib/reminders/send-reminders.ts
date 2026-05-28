import { createServerSupabaseClient } from "@/lib/supabase/server";

const WHATSAPP_API_VERSION = "v22.0";
const WHATSAPP_BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

type PolicyForReminder = {
  policyNumber: string | null;
  insuranceTypeName: string;
  remaining: number;
};

type SendResult = {
  clientId: string;
  success: boolean;
  messageId?: string;
  error?: string;
};

export function formatPolicyDetails(policies: PolicyForReminder[]): string {
  return policies
    .map((p) => `Policy #${p.policyNumber || "N/A"}\n${p.insuranceTypeName} — $${p.remaining.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
    .join("\n\n");
}

export async function sendWhatsAppMessage(
  phone: string,
  clientName: string,
  policyDetails: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    return { success: false, error: "Missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN" };
  }

  const res = await fetch(
    `${WHATSAPP_BASE_URL}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "payment_reminder_detail",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: clientName },
                { type: "text", text: policyDetails },
              ],
            },
          ],
        },
      }),
    }
  );

  if (!res.ok) {
    let errorBody: string | undefined;
    try {
      const err = await res.json();
      errorBody = JSON.stringify(err);
    } catch {
      errorBody = `HTTP ${res.status} ${res.statusText}`;
    }
    return { success: false, error: errorBody };
  }

  const data = await res.json();
  return { success: true, messageId: data.messages?.[0]?.id };
}

export async function sendReminders(): Promise<SendResult[]> {
  const supabase = await createServerSupabaseClient();

  // Get all clients with pending/overdue payments
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, phone");

  if (!clients) return [];

  const results: SendResult[] = [];

  for (const client of clients) {
    if (!client.phone) continue;

    // Get policies with pending payments
    const { data: policies } = await supabase
      .from("policies")
      .select("id, policy_number, insurance_types(name), premium_amount")
      .eq("client_id", client.id);

    if (!policies || policies.length === 0) continue;

    const policiesForReminder: PolicyForReminder[] = [];

    for (const policy of policies) {
      const { data: payments } = await supabase
        .from("payments")
        .select("id, amount_due, amount_paid, status")
        .eq("policy_id", policy.id)
        .in("status", ["pending", "overdue"]);

      if (!payments || payments.length === 0) continue;

      const totalDue = payments.reduce((s, p) => s + Number(p.amount_due || 0), 0);
      const totalPaid = payments.reduce((s, p) => s + Number(p.amount_paid || 0), 0);
      const remaining = totalDue - totalPaid;

      if (remaining <= 0) continue;

      policiesForReminder.push({
        policyNumber: policy.policy_number,
        insuranceTypeName: (policy.insurance_types as { name: string }[])?.[0]?.name || "Unknown",
        remaining,
      });

      // Log each payment that contributed
      for (const payment of payments) {
        await supabase.from("reminder_logs").insert({
          payment_id: payment.id,
          destination_phone: client.phone,
          template_name: "payment_reminder_detail",
          status: "pending",
        });
      }
    }

    if (policiesForReminder.length === 0) continue;

    const details = formatPolicyDetails(policiesForReminder);

    const MAX_RETRIES = 3;
    let lastError: string | undefined;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(3, attempt - 1)));
      }

      const sendResult = await sendWhatsAppMessage(client.phone, client.name, details);
      if (sendResult.success) {
        // Update reminder_logs to "sent"
        await supabase
          .from("reminder_logs")
          .update({ status: "sent", provider_message_id: sendResult.messageId, sent_at: new Date().toISOString() })
          .eq("destination_phone", client.phone)
          .eq("status", "pending");

        results.push({ clientId: client.id, success: true, messageId: sendResult.messageId });
        break;
      } else {
        lastError = sendResult.error || "API request failed";
        if (attempt === 2) {
          // Mark as failed after last retry
          await supabase
            .from("reminder_logs")
            .update({ status: "failed", provider_response: lastError })
            .eq("destination_phone", client.phone)
            .eq("status", "pending");

          results.push({ clientId: client.id, success: false, error: lastError });
        }
      }
    }
  }

  return results;
}
