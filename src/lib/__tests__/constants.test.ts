import { describe, expect, it } from 'vitest';
import { FEATURED_IMAGE_SIZE } from '../constants';

describe('FEATURED_IMAGE_SIZE', () => {
  it('is the medium_large WordPress image size', () => {
    expect(FEATURED_IMAGE_SIZE).toBe('medium_large');
  });

  it('is a non-empty string', () => {
    expect(typeof FEATURED_IMAGE_SIZE).toBe('string');
    expect(FEATURED_IMAGE_SIZE.trim().length).toBeGreaterThan(0);
  });
});
