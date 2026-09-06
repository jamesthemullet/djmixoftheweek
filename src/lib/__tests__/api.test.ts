import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchGraphQL } from '../api';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe('fetchGraphQL', () => {
  it('returns json.data on a successful response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { posts: { nodes: [] } } }),
    });

    const result = await fetchGraphQL('{ posts { nodes { id } } }');
    expect(result).toEqual({ posts: { nodes: [] } });
  });

  it('throws when response.ok is false', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ errors: [{ message: 'Unauthorized' }] }),
    });

    await expect(fetchGraphQL('{ posts { nodes { id } } }')).rejects.toThrow('GraphQL Error');
  });

  it('throws when the response contains GraphQL errors', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ errors: [{ message: 'Field not found' }], data: null }),
    });

    await expect(fetchGraphQL('{ badField }')).rejects.toThrow('GraphQL Error');
  });

  it('rejects when fetch itself rejects (network failure)', async () => {
    mockFetch.mockRejectedValue(new Error('Network request failed'));

    await expect(fetchGraphQL('{ posts { nodes { id } } }')).rejects.toThrow(
      'Network request failed',
    );
  });

  it('rejects when response.json() throws on malformed JSON', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => {
        throw new SyntaxError('Unexpected token in JSON');
      },
    });

    await expect(fetchGraphQL('{ posts { nodes { id } } }')).rejects.toThrow(
      'Unexpected token in JSON',
    );
  });
});
