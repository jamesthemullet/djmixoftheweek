import { describe, expect, it } from 'vitest';
import { capitaliseAndRemoveHyphens } from '../utils';

describe('capitaliseAndRemoveHyphens', () => {
  it('capitalises the first letter of a single word', () => {
    expect(capitaliseAndRemoveHyphens('house')).toBe('House');
  });

  it('replaces hyphens with spaces and capitalises each word', () => {
    expect(capitaliseAndRemoveHyphens('drum-and-bass')).toBe('Drum And Bass');
  });

  it('returns the fallback when given undefined', () => {
    expect(capitaliseAndRemoveHyphens(undefined)).toBe('Unknown');
  });

  it('returns the fallback when given an empty string', () => {
    expect(capitaliseAndRemoveHyphens('')).toBe('Unknown');
  });

  it('accepts a custom fallback value', () => {
    expect(capitaliseAndRemoveHyphens(undefined, 'N/A')).toBe('N/A');
  });

  it('handles a string that is already capitalised', () => {
    expect(capitaliseAndRemoveHyphens('Techno')).toBe('Techno');
  });
});
