// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fetchGraphQLMock = vi.fn();
vi.mock('../../lib/api.ts', () => ({
  fetchGraphQL: (...args: unknown[]) => fetchGraphQLMock(...args),
}));

function makePost(overrides: Record<string, unknown> = {}) {
  return {
    slug: 'my-mix',
    title: 'My Mix',
    genres: {
      nodes: [
        { name: 'House', slug: 'house' },
        { name: 'Techno', slug: 'techno' },
      ],
    },
    featuredImage: {
      node: {
        mediaDetails: {
          sizes: [{ name: 'medium_large', sourceUrl: 'https://example.com/img.jpg' }],
        },
      },
    },
    ...overrides,
  };
}

function setupDom(cursor: string | null) {
  document.body.innerHTML = `
    <button id="load-more" data-cursor="${cursor ?? ''}"></button>
    <ul id="post-list"></ul>
  `;
  return {
    button: document.getElementById('load-more') as HTMLButtonElement,
    postList: document.getElementById('post-list') as HTMLUListElement,
  };
}

function loadDom(cursor: string | null) {
  const elements = setupDom(cursor);
  document.dispatchEvent(new Event('DOMContentLoaded'));
  return elements;
}

// Importing once registers a single DOMContentLoaded listener; each test re-dispatches
// that event against a freshly-built DOM to get an isolated cursor/button/postList closure.
await import('../load-more.ts');

describe('load-more', () => {
  beforeEach(() => {
    fetchGraphQLMock.mockReset();
  });

  it('hides the button and does not fetch when there is no initial cursor', () => {
    const { button } = loadDom(null);

    button.click();

    expect(button.style.display).toBe('none');
    expect(fetchGraphQLMock).not.toHaveBeenCalled();
  });

  it('fetches more posts, appends them to the list, and stores the new cursor', async () => {
    const { button, postList } = loadDom('cursor-1');
    fetchGraphQLMock.mockResolvedValue({
      posts: { nodes: [makePost()], pageInfo: { endCursor: 'cursor-2' } },
    });

    button.click();
    await vi.waitFor(() => expect(button.textContent).toBe('Load More'));

    expect(fetchGraphQLMock).toHaveBeenCalledWith(expect.anything(), {
      first: 12,
      after: 'cursor-1',
    });
    expect(button.dataset.cursor).toBe('cursor-2');
    expect(button.style.display).not.toBe('none');
    expect(button.disabled).toBe(false);
    expect(button.hasAttribute('aria-busy')).toBe(false);

    expect(postList.children.length).toBe(1);
    const li = postList.children[0];
    expect(li.querySelector('h2 a')?.textContent).toBe('My Mix');
    expect(li.querySelector('img')?.getAttribute('src')).toBe('https://example.com/img.jpg');
    expect(li.querySelectorAll('.genres a').length).toBe(2);
  });

  it('uses the updated cursor for the next fetch', async () => {
    const { button } = loadDom('cursor-1');
    fetchGraphQLMock.mockResolvedValue({
      posts: { nodes: [makePost()], pageInfo: { endCursor: 'cursor-2' } },
    });

    button.click();
    await vi.waitFor(() => expect(button.textContent).toBe('Load More'));

    fetchGraphQLMock.mockResolvedValue({
      posts: { nodes: [makePost({ slug: 'second-mix' })], pageInfo: { endCursor: 'cursor-3' } },
    });
    button.click();
    await vi.waitFor(() =>
      expect(fetchGraphQLMock).toHaveBeenLastCalledWith(expect.anything(), {
        first: 12,
        after: 'cursor-2',
      }),
    );
    expect(button.dataset.cursor).toBe('cursor-3');
  });

  it('hides the button once the response has no further cursor', async () => {
    const { button, postList } = loadDom('cursor-1');
    fetchGraphQLMock.mockResolvedValue({
      posts: { nodes: [], pageInfo: { endCursor: null } },
    });

    button.click();
    await vi.waitFor(() => expect(button.style.display).toBe('none'));

    expect(button.dataset.cursor).toBe('');
    expect(postList.children.length).toBe(0);
  });

  it('recovers from a fetch error by resetting the button', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { button } = loadDom('cursor-1');
    fetchGraphQLMock.mockRejectedValue(new Error('network down'));

    button.click();
    await vi.waitFor(() => expect(button.disabled).toBe(false));

    expect(button.textContent).toBe('Load More');
    expect(button.hasAttribute('aria-busy')).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading more posts:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
