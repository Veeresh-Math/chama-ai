import { describe, it, expect } from 'vitest';
import { getTrustScoreConfig } from '../lib/trust-score';

describe('getTrustScoreConfig', () => {
  it('maps healthy score (>=80) to emerald', () => {
    expect(getTrustScoreConfig(86)).toEqual({
      text: 'text-emerald-700',
      bg: 'bg-emerald-100',
      status: 'healthy',
    });
  });

  it('maps boundary score 80 to healthy', () => {
    expect(getTrustScoreConfig(80).status).toBe('healthy');
  });

  it('maps needs-attention score (50-79) to amber', () => {
    expect(getTrustScoreConfig(65)).toEqual({
      text: 'text-amber-700',
      bg: 'bg-amber-100',
      status: 'needs-attention',
    });
  });

  it('maps boundary score 50 to needs-attention', () => {
    expect(getTrustScoreConfig(50).status).toBe('needs-attention');
  });

  it('maps at-risk score (<50) to rose', () => {
    expect(getTrustScoreConfig(32)).toEqual({
      text: 'text-rose-700',
      bg: 'bg-rose-100',
      status: 'at-risk',
    });
  });

  it('maps boundary score 49 to at-risk', () => {
    expect(getTrustScoreConfig(49).status).toBe('at-risk');
  });

  it('clamps negative score to 0 (at-risk)', () => {
    expect(getTrustScoreConfig(-10).status).toBe('at-risk');
  });

  it('clamps score above 100 to healthy', () => {
    expect(getTrustScoreConfig(150).status).toBe('healthy');
  });

  it('maps NaN to unknown gray', () => {
    expect(getTrustScoreConfig(NaN)).toEqual({
      text: 'text-gray-500',
      bg: 'bg-gray-100',
      status: 'unknown',
    });
  });
});
