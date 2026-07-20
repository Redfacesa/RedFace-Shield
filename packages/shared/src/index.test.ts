import { describe, expect, it } from 'vitest';
import { generateId } from './index.js';

describe('generateId', () => {
  it('uses canonical prefix format', () => {
    const id = generateId('RF-INT');
    expect(id).toMatch(/^RF-INT-\d{4}-[A-F0-9]{12}$/);
  });
});
