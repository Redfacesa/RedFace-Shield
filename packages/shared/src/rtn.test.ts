import { describe, expect, it } from 'vitest';
import { buildRtnUri, isRtnUri, parseRtnUri } from './rtn.js';

describe('RTN URI', () => {
  it('builds canonical URIs', () => {
    expect(buildRtnUri('organization', 'adt')).toBe('rtn://organization/adt');
    expect(buildRtnUri('guard', '284729')).toBe('rtn://guard/284729');
    expect(buildRtnUri('mission', 'CPT-2026-000001')).toBe('rtn://mission/CPT-2026-000001');
  });

  it('parses URIs', () => {
    const parsed = parseRtnUri('rtn://camera/HIK-00492');
    expect(parsed.kind).toBe('camera');
    expect(parsed.localId).toBe('HIK-00492');
  });

  it('validates format', () => {
    expect(isRtnUri('rtn://vehicle/CPT-TRK-001')).toBe(true);
    expect(isRtnUri('RF-ORG-001')).toBe(false);
  });
});
