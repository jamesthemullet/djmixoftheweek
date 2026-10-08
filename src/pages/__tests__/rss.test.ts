import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fetchGraphQLMock = vi.fn();
vi.mock('../../lib/api', () => ({
  fetchGraphQL: (...args: unknown[]) => fetchGraphQLMock(...args),
}));

beforeEach(() => {
  fetchGraphQLMock.mockReset();
});

function parseXml(xml: string) {
  const parser = new new JSDOM().window.DOMParser();
  return parser.parseFromString(xml, 'application/xml');
}

describe('GET /rss.xml', () => {
  it('renders real posts fetched over GraphQL as feed items', async () => {
    fetchGraphQLMock.mockResolvedValue({
      posts: {
        nodes: [
          {
            slug: 'al-wootton-crack-mix-607',
            title: 'Al Wootton - Crack Mix 607',
            date: '2026-09-20T10:00:00',
            content: '<p>A great mix.</p>',
          },
        ],
      },
    });

    const { GET } = await import('../rss.xml.js');
    const response = await GET({ site: new URL('https://djmixoftheweek.com/') });
    const body = await response.text();

    expect(fetchGraphQLMock).toHaveBeenCalledWith(expect.stringContaining('GetRecentPosts'), {
      first: 20,
    });
    expect(body).toContain('Al Wootton - Crack Mix 607');
    expect(body).toContain('/al-wootton-crack-mix-607/');
    expect(body).not.toContain('Welcome to my website!');
  });

  it('renders an empty feed when there are no posts', async () => {
    fetchGraphQLMock.mockResolvedValue({ posts: { nodes: [] } });

    const { GET } = await import('../rss.xml.js');
    const response = await GET({ site: new URL('https://djmixoftheweek.com/') });
    const body = await response.text();

    expect(body).toContain('<rss');
    expect(body).not.toContain('<item>');
  });

  it('renders an empty feed instead of throwing when fetchGraphQL rejects', async () => {
    fetchGraphQLMock.mockRejectedValue(new Error('Failed to parse URL from undefined/graphql'));

    const { GET } = await import('../rss.xml.js');
    const response = await GET({ site: new URL('https://djmixoftheweek.com/') });
    const body = await response.text();

    expect(body).toContain('<rss');
    expect(body).not.toContain('<item>');
  });

  it('produces well-formed XML with one <item> per post, in order', async () => {
    fetchGraphQLMock.mockResolvedValue({
      posts: {
        nodes: [
          {
            slug: 'al-wootton-crack-mix-607',
            title: 'Al Wootton - Crack Mix 607',
            date: '2026-09-20T10:00:00',
            content: '<p>A great mix.</p>',
          },
          {
            slug: 'some-other-mix-608',
            title: 'Some Other - Mix 608',
            date: '2026-09-27T10:00:00',
            content: '<p>Another great mix.</p>',
          },
        ],
      },
    });

    const { GET } = await import('../rss.xml.js');
    const response = await GET({ site: new URL('https://djmixoftheweek.com/') });
    const body = await response.text();

    const doc = parseXml(body);
    expect(doc.getElementsByTagName('parsererror')).toHaveLength(0);

    const items = doc.getElementsByTagName('item');
    expect(items).toHaveLength(2);
    expect(items[0]?.getElementsByTagName('title')[0]?.textContent).toBe(
      'Al Wootton - Crack Mix 607'
    );
    expect(items[0]?.getElementsByTagName('link')[0]?.textContent).toBe(
      'https://djmixoftheweek.com/al-wootton-crack-mix-607/'
    );
    expect(items[1]?.getElementsByTagName('title')[0]?.textContent).toBe('Some Other - Mix 608');
    expect(items[1]?.getElementsByTagName('link')[0]?.textContent).toBe(
      'https://djmixoftheweek.com/some-other-mix-608/'
    );
  });
});
