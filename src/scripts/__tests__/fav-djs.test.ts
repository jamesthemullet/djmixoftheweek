// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';

type FavDJ = { slug: string; name: string };
type FavDJsStore = {
  items: FavDJ[];
  toggle: (slug: string, name: string) => void;
  has: (slug: string) => boolean;
};

function initStore(): FavDJsStore {
  let store: FavDJsStore | undefined;
  Object.assign(globalThis, {
    Alpine: {
      store: (name: string, value: Record<string, unknown>) => {
        if (name === 'favDJs') {
          store = value as FavDJsStore;
        }
      },
    },
  });
  document.dispatchEvent(new Event('alpine:init'));
  if (!store) throw new Error('favDJs store was not registered');
  return store;
}

// Importing once registers a single alpine:init listener; each test re-dispatches
// that event to get a fresh store built from the current localStorage contents.
await import('../fav-djs.ts');

describe('fav-djs', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes items from localStorage', () => {
    localStorage.setItem('favDJs', JSON.stringify([{ slug: 'al-wootton', name: 'Al Wootton' }]));

    const store = initStore();

    expect(store.items).toEqual([{ slug: 'al-wootton', name: 'Al Wootton' }]);
  });

  it('initializes to an empty array when localStorage has no favDJs entry', () => {
    const store = initStore();

    expect(store.items).toEqual([]);
  });

  it('adds a DJ via toggle and persists the change to localStorage', () => {
    const store = initStore();

    store.toggle('al-wootton', 'Al Wootton');

    expect(store.items).toEqual([{ slug: 'al-wootton', name: 'Al Wootton' }]);
    expect(JSON.parse(localStorage.getItem('favDJs') || '[]')).toEqual([
      { slug: 'al-wootton', name: 'Al Wootton' },
    ]);
  });

  it('removes a DJ via toggle when it is already favourited', () => {
    const store = initStore();
    store.toggle('al-wootton', 'Al Wootton');

    store.toggle('al-wootton', 'Al Wootton');

    expect(store.items).toEqual([]);
    expect(JSON.parse(localStorage.getItem('favDJs') || '[]')).toEqual([]);
  });

  it('only removes the matching DJ when multiple are favourited', () => {
    const store = initStore();
    store.toggle('al-wootton', 'Al Wootton');
    store.toggle('four-tet', 'Four Tet');

    store.toggle('al-wootton', 'Al Wootton');

    expect(store.items).toEqual([{ slug: 'four-tet', name: 'Four Tet' }]);
  });

  it('has() reports whether a DJ is currently favourited', () => {
    const store = initStore();

    expect(store.has('al-wootton')).toBe(false);

    store.toggle('al-wootton', 'Al Wootton');

    expect(store.has('al-wootton')).toBe(true);
  });
});
