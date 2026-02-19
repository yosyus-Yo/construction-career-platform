import { describe, it, expect } from 'vitest';
import { resumeDigestAndKeywords } from '../../src/lib/crypto.js';

describe('crypto utils', () => {
  it('creates digest and keywords', () => {
    const data = resumeDigestAndKeywords('건설 안전관리 기사 보유, 타워크레인 실무 10년 경력');
    expect(data.digest).toHaveLength(64);
    expect(data.keywords.length).toBeGreaterThan(0);
  });
});
