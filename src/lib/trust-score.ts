export type TrustScoreConfig = {
  text: string;
  bg: string;
  status: string;
};

export function getTrustScoreConfig(score: number): TrustScoreConfig {
  const clamped = Math.max(0, Math.min(100, Number(score)));

  if (Number.isNaN(clamped) || Number.isNaN(score)) {
    return { text: 'text-gray-500', bg: 'bg-gray-100', status: 'unknown' };
  }

  if (clamped >= 80) {
    return { text: 'text-emerald-700', bg: 'bg-emerald-100', status: 'healthy' };
  }

  if (clamped >= 50) {
    return { text: 'text-amber-700', bg: 'bg-amber-100', status: 'needs-attention' };
  }

  return { text: 'text-rose-700', bg: 'bg-rose-100', status: 'at-risk' };
}
