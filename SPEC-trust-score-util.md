# Spec — getTrustScore Utility

## Goal
Pure function that maps a trust score (0–100) to a color config (text color, bg color, status label) for use in badges across Cham.ai.

## Requirements
1. `getTrustScoreConfig(score: number): { text: string; bg: string; status: string }`
2. Score ≥ 80 → `{ text: 'text-emerald-700', bg: 'bg-emerald-100', status: 'healthy' }`
3. Score 50–79 → `{ text: 'text-amber-700', bg: 'bg-amber-100', status: 'needs-attention' }`
4. Score < 50 → `{ text: 'text-rose-700', bg: 'bg-rose-100', status: 'at-risk' }`
5. Score < 0 → clamps to 0 (at-risk)
6. Score > 100 → clamps to 100 (healthy)
7. Non-numeric (NaN) → `{ text: 'text-gray-500', bg: 'bg-gray-100', status: 'unknown' }`

## Acceptance
- `npm run typecheck` clean
- `npm test` passes all utility tests
- No DOM dependencies (pure function)
