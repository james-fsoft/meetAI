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

// Builds the usage payload returned to the client. bonusMin = referral credit
// (added to the monthly allowance).
export function usagePayload(plan: string, secToday: number, secMonth: number, bonusMin = 0) {
  const lim = planLimits(plan);
  const monthLimit = lim.month == null ? null : lim.month + (bonusMin || 0);
  return {
    plan,
    unlimited: lim.month == null,
    bonus: bonusMin || 0,
    day: { used: toMin(secToday), limit: lim.day, remain: remain(lim.day, secToday) },
    month: {
      used: toMin(secMonth), limit: monthLimit,
      remain: monthLimit == null ? null : Math.max(0, monthLimit - toMin(secMonth)),
    },
  };
}

// true if the user still has quota left (both day and month).
export function hasQuota(plan: string, secToday: number, secMonth: number, bonusMin = 0) {
  const lim = planLimits(plan);
  const monthLimit = lim.month == null ? null : lim.month + (bonusMin || 0);
  if (monthLimit != null && toMin(secMonth) >= monthLimit) return false;
  if (lim.day != null && toMin(secToday) >= lim.day) return false;
  return true;
}
