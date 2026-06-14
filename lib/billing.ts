// VND prices + Vietnamese bank-transfer (VietQR) configuration.

export const VND_PRICES: Record<string, { monthly: number; annual: number }> = {
  pro: { monthly: 199_000, annual: 1_910_000 },
  business: { monthly: 599_000, annual: 5_750_000 },
};

export function planAmount(plan: string, billing: string): number | null {
  const p = VND_PRICES[plan];
  if (!p) return null;
  return billing === "annual" ? p.annual : p.monthly;
}

// Bank account that receives transfers. Configure via env (never hard-code).
//   BANK_BIN          VietQR bank BIN, e.g. 970436 (Vietcombank), 970422 (MB)…
//   BANK_ACCOUNT_NO   account number
//   BANK_ACCOUNT_NAME account holder name (no diacritics)
//   BANK_NAME         human-readable bank name (shown to the user)
export const BANK = {
  bin: process.env.BANK_BIN || "",
  account: process.env.BANK_ACCOUNT_NO || "",
  name: process.env.BANK_ACCOUNT_NAME || "",
  label: process.env.BANK_NAME || "",
};
export const bankConfigured = () => !!(BANK.bin && BANK.account && BANK.name);

// Hours the user is told to wait for admin confirmation.
export const CONFIRM_HOURS = Number(process.env.PAYMENT_CONFIRM_HOURS || 24);

// Transfer memo / matching code — ASCII uppercase so banks don't mangle it.
export function transferContent(plan: string, userId: string): string {
  const short = userId.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `FLASHMEET ${plan.toUpperCase()} ${short}`;
}

// VietQR.io image API (no API key needed) — renders a scannable QR with the
// amount and memo pre-filled.
export function vietQrUrl(amount: number, content: string): string {
  const base = `https://img.vietqr.io/image/${BANK.bin}-${BANK.account}-compact2.png`;
  const q = new URLSearchParams({ amount: String(amount), addInfo: content, accountName: BANK.name });
  return `${base}?${q.toString()}`;
}

export const fmtVnd = (n: number) => n.toLocaleString("vi-VN") + "đ";
