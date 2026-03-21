type SupabaseAdminClient = any;

const COMMISSION_LEVELS: Array<{ level: 1 | 2 | 3; pct: number }> = [
  { level: 1, pct: 0.1 },
  { level: 2, pct: 0.05 },
  { level: 3, pct: 0.025 }
];

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export async function distributeCommissions(params: {
  supabaseAdmin: SupabaseAdminClient;
  orderId: string;
  buyerId: string;
  amount: number;
  currency: string;
}) {
  const { supabaseAdmin, orderId, buyerId, amount, currency } = params;
  if (!orderId || !buyerId) return;
  if (!Number.isFinite(amount) || amount <= 0) return;

  const { data: buyerProfile, error: buyerError } = await supabaseAdmin
    .from("profiles")
    .select("id,referred_by_id")
    .eq("id", buyerId)
    .maybeSingle();

  if (buyerError) throw buyerError;
  if (!buyerProfile) return;

  const recipients: Array<{ level: 1 | 2 | 3; recipientId: string; pct: number }> = [];
  let currentReferrerId: string | null = buyerProfile.referred_by_id ?? null;

  for (const { level, pct } of COMMISSION_LEVELS) {
    if (!currentReferrerId) break;
    if (currentReferrerId === buyerId) break;

    recipients.push({ level, recipientId: currentReferrerId, pct });

    const { data: nextProfile, error: nextError } = await supabaseAdmin
      .from("profiles")
      .select("id,referred_by_id")
      .eq("id", currentReferrerId)
      .maybeSingle();

    if (nextError) throw nextError;
    currentReferrerId = nextProfile?.referred_by_id ?? null;
  }

  if (recipients.length === 0) return;

  const rows = recipients.map((r) => ({
    order_id: orderId,
    buyer_id: buyerId,
    recipient_id: r.recipientId,
    level: r.level,
    percentage: r.pct,
    amount: round2(amount * r.pct),
    currency: String(currency || "usd").toLowerCase(),
    status: "pending"
  }));

  const { error: insertError } = await supabaseAdmin.from("commissions").insert(rows);
  if (insertError) {
    const msg = String(insertError.message || "");
    if (msg.toLowerCase().includes("duplicate")) return;
    throw insertError;
  }
}

