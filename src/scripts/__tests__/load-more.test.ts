// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFetchGraphQL = vi.fn();

vi.mock('../../lib/api', () => ({
  fetchGraphQL: (...args: unknown[]) => mockFetchGraphQL(...args),
}));

vi.mock('../../lib/queries/morePosts', () => ({
  default: 'MOCK_MORE_POSTS_QUERY',
}));

function buildDOM(cursor = 'cursor-abc') {
  document.body.innerHTML = `
    <button id="load-more" data-cursor="${cursor}">Load More</button>
    <ul id="post-list"></ul>
  `;
}

function makePost(index: number) {
  return {
    slug: `post-slug-${index}`,
    title: `Post Title ${index}`,
    featuredImage: {
      node: {
        mediaDetails: {
          sizes: [{ name: 'medium_large', sourceUrl: `https://img.example.com/${index}.jpg` }],
        },
      },
    },
    genres: { nodes: [{ name: 'House', slug: 'house' }] },
  };
}

async function loadAndInit(cursor = 'cursor-abc') {
  buildDOM(cursor);
  vi.resetModules();

  let listener: (() => void) | null = null;
  const spy = vi.spyOn(document, 'addEventListener').mockImplementation(
    (type: string, handler: EventListenerOrEventListenerObject) => {
      if (type === 'DOMContentLoaded') {
        listener = handler as () => void;
      }
    },
  );

  await import('../load-more');
  spy.mockRestore();
  listener?.();
}

describe('load-more', () => {
  beforeEach(async () => {
    mockFetchGraphQL.mockReset();
    await loadAndInit();
  });

  it('appends new post items to the list when the button is clicked', async () => {
    mockFetchGraphQL.mockResolvedValue({
      posts: {
        nodes: [makePost(0), makePost(1)],
        pageInfo: { endCursor: 'next-cursor', hasNextPage: true },
      },
    });

    document.getElementById('load-more')!.click();
    await vi.waitFor(() => {
      expect(document.querySelectorAll('#post-list li').length).toBe(2);
    });
  });

  it('hides the button when there are no more pages', async () => {
    mockFetchGraphQL.mockResolvedValue({
      posts: {
        nodes: [makePost(0)],
        pageInfo: { endCursor: null, hasNextPage: false },
      },
    });

    document.getElementById('load-more')!.click();
    await vi.waitFor(() => {
      const button = document.getElementById('load-more') as HTMLButtonElement;
      expect(button.style.display).toBe('none');
    });
  });

  it('disables the button and shows a loading label while fetching', async () => {
    let resolvePromise!: (v: unknown) => void;
    mockFetchGraphQL.mockReturnValue(new Promise((r) => { resolvePromise = r; }));

    const button = document.getElementById('load-more') as HTMLButtonElement;
    button.click();

    expect(button.textContent).toBe('Loading...');
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');

    resolvePromise({
      posts: { nodes: [], pageInfo: { endCursor: null, hasNextPage: false } },
    });
    await vi.waitFor(() => expect(button.disabled).toBe(false));
  });

  it('resets the button to its default state after a fetch error', async () => {
    mockFetchGraphQL.mockRejectedValue(new Error('Network error'));

    const button = document.getElementById('load-more') as HTMLButtonElement;
    button.click();
    await vi.waitFor(() => {
      expect(button.textContent).toBe('Load More');
      expect(button.disabled).toBe(false);
      expect(button.getAttribute('aria-busy')).toBeNull();
    });
  });

  it('hides the button immediately and skips the API call when the cursor is empty', async () => {
    await loadAndInit('');
    const button = document.getElementById('load-more') as HTMLButtonElement;
    button.click();

    expect(mockFetchGraphQL).not.toHaveBeenCalled();
    expect(button.style.display).toBe('none');
  });
});
