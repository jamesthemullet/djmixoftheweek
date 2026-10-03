import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fetchGraphQLMock = vi.fn();
vi.mock('../../lib/api.ts', () => ({
  fetchGraphQL: (...args: unknown[]) => fetchGraphQLMock(...args),
}));

describe('GET /sitemap.xml', () => {
  beforeEach(() => {
    fetchGraphQLMock.mockReset();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({
          data: {
            posts: {
              nodes: [{ slug: 'a-mix', modified: '2026-01-01T00:00:00Z' }],
            },
          },
        }),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('includes all core static pages plus dynamic post/dj/genre/nationality routes', async () => {
    fetchGraphQLMock
      .mockResolvedValueOnce({
        dJs: { nodes: [{ slug: 'al-wootton' }], pageInfo: { hasNextPage: false, endCursor: null } },
      })
      .mockResolvedValueOnce({ genres: { nodes: [{ slug: 'house' }] } })
      .mockResolvedValueOnce({ nationalities: { nodes: [{ slug: 'uk' }] } });

    const { GET } = await import('../sitemap.xml.js');
    const response = await GET();
    const body = await response.text();

    for (const path of [
      '<loc>https://djmixoftheweek.com/</loc>',
      '<loc>https://djmixoftheweek.com/about</loc>',
      '<loc>https://djmixoftheweek.com/genres</loc>',
      '<loc>https://djmixoftheweek.com/league-of-mixes</loc>',
      '<loc>https://djmixoftheweek.com/djs</loc>',
      '<loc>https://djmixoftheweek.com/nationalities</loc>',
      '<loc>https://djmixoftheweek.com/your-djs</loc>',
      '<loc>https://djmixoftheweek.com/dj-leaderboard</loc>',
      '<loc>https://djmixoftheweek.com/a-mix</loc>',
      '<loc>https://djmixoftheweek.com/dj/al-wootton</loc>',
      '<loc>https://djmixoftheweek.com/genre/house</loc>',
      '<loc>https://djmixoftheweek.com/nationality/uk</loc>',
    ]) {
      expect(body).toContain(path);
    }
    expect(response.headers.get('Content-Type')).toBe('application/xml');
  });

  it('paginates through all DJ pages via endCursor', async () => {
    fetchGraphQLMock
      .mockResolvedValueOnce({
        dJs: { nodes: [{ slug: 'dj-one' }], pageInfo: { hasNextPage: true, endCursor: 'cursor-1' } },
      })
      .mockResolvedValueOnce({
        dJs: { nodes: [{ slug: 'dj-two' }], pageInfo: { hasNextPage: false, endCursor: null } },
      })
      .mockResolvedValueOnce({ genres: { nodes: [] } })
      .mockResolvedValueOnce({ nationalities: { nodes: [] } });

    const { GET } = await import('../sitemap.xml.js');
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('<loc>https://djmixoftheweek.com/dj/dj-one</loc>');
    expect(body).toContain('<loc>https://djmixoftheweek.com/dj/dj-two</loc>');
    expect(fetchGraphQLMock).toHaveBeenCalledTimes(4);
  });

  it('degrades gracefully when the taxonomy fetches fail', async () => {
    fetchGraphQLMock.mockRejectedValue(new Error('network error'));

    const { GET } = await import('../sitemap.xml.js');
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('<loc>https://djmixoftheweek.com/djs</loc>');
    expect(body).not.toContain('/dj/');
    expect(body).not.toContain('/genre/');
    expect(body).not.toContain('/nationality/');
  });
});
