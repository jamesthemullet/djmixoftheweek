import { describe, expect, it } from 'vitest';
import { DEFAULT_PAGE_SIZE, FEATURED_IMAGE_SIZE } from '../constants';

describe('FEATURED_IMAGE_SIZE', () => {
  it('is the medium_large WordPress image size', () => {
    expect(FEATURED_IMAGE_SIZE).toBe('medium_large');
  });

  it('is a non-empty string', () => {
    expect(typeof FEATURED_IMAGE_SIZE).toBe('string');
    expect(FEATURED_IMAGE_SIZE.trim().length).toBeGreaterThan(0);
  });
});

describe('DEFAULT_PAGE_SIZE', () => {
  it('is 100', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(100);
  });

  it('is a positive integer', () => {
    expect(typeof DEFAULT_PAGE_SIZE).toBe('number');
    expect(Number.isInteger(DEFAULT_PAGE_SIZE)).toBe(true);
    expect(DEFAULT_PAGE_SIZE).toBeGreaterThan(0);
  });
});
