// Monthly / daily minute limits per plan. null = unlimited.
export const LIMITS: Record<string, { day: number | null; month: number | null }> = {
  free: { day: 10, month: 30 },
  pro: { day: null, month: 1000 },
  business: { day: null, month: 5000 },
  enterprise: { day: null, month: null },
};

export function planLimits(plan: string) {
  return LIMITS[plan] || LIMITS.free;
}

const toMin = (sec: number) => Math.floor((sec || 0) / 60);
const remain = (limit: number | null, usedSec: number) =>
  limit == null ? null : Math.max(0, limit - toMin(usedSec));

// Builds the usage payload. bonusMin = a ONE-TIME referral pool (minutes) that is
// consumed only after the plan's monthly quota is used up. It does not reset
// monthly and never expires; the month figures below are plan-only.
export function usagePayload(plan: string, secToday: number, secMonth: number, bonusMin = 0) {
  const lim = planLimits(plan);
  return {
    plan,
    unlimited: lim.month == null,
    bonus: Math.max(0, bonusMin || 0),
    day: { used: toMin(secToday), limit: lim.day, remain: remain(lim.day, secToday) },
    month: { used: toMin(secMonth), limit: lim.month, remain: remain(lim.month, secMonth) },
  };
}

// true if the user still has quota left. The one-time bonus pool lets them go
// past both the daily and monthly caps until the pool is empty.
export function hasQuota(plan: string, secToday: number, secMonth: number, bonusMin = 0) {
  const lim = planLimits(plan);
  const hasBonus = (bonusMin || 0) > 0;
  if (lim.month != null && toMin(secMonth) >= lim.month && !hasBonus) return false;
  if (lim.day != null && toMin(secToday) >= lim.day && !hasBonus) return false;
  return true;
}
