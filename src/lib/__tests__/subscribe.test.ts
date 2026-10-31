import { beforeEach, describe, expect, it, vi } from 'vitest';
import { subscribeToNewsletter } from '../subscribe';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe('subscribeToNewsletter', () => {
  it('returns the success message on a successful response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Subscribed!' }),
    });

    const result = await subscribeToNewsletter('Jane', 'jane@example.com');

    expect(result).toBe('Subscribed!');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/wp-json/custom/v1/subscribe'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'jane@example.com', name: 'Jane' }),
      }),
    );
  });

  it('returns an error message prefixed with "Error:" when the response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Already subscribed' }),
    });

    const result = await subscribeToNewsletter('Jane', 'jane@example.com');

    expect(result).toBe('Error: Already subscribed');
  });

  it('falls back to a generic error message when the response has no message', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    const result = await subscribeToNewsletter('Jane', 'jane@example.com');

    expect(result).toBe('Error: Something went wrong');
  });
});
