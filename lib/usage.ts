// Monthly / daily minute limits per plan. null = unlimited.
export const LIMITS: Record<string, { day: number | null; month: number | null }> = {
  free: { day: 10, month: 30 },
  pro: { day: null, month: 600 },
  business: { day: null, month: 2400 },
  enterprise: { day: null, month: null },
};

export function planLimits(plan: string) {
  return LIMITS[plan] || LIMITS.free;
}

const toMin = (sec: number) => Math.floor((sec || 0) / 60);
const remain = (limit: number | null, usedSec: number) =>
  limit == null ? null : Math.max(0, limit - toMin(usedSec));

// Builds the usage payload returned to the client.
export function usagePayload(plan: string, secToday: number, secMonth: number) {
  const lim = planLimits(plan);
  return {
    plan,
    unlimited: lim.month == null,
    day: { used: toMin(secToday), limit: lim.day, remain: remain(lim.day, secToday) },
    month: { used: toMin(secMonth), limit: lim.month, remain: remain(lim.month, secMonth) },
  };
}

// true if the user still has quota left (both day and month).
export function hasQuota(plan: string, secToday: number, secMonth: number) {
  const lim = planLimits(plan);
  if (lim.month != null && toMin(secMonth) >= lim.month) return false;
  if (lim.day != null && toMin(secToday) >= lim.day) return false;
  return true;
}
