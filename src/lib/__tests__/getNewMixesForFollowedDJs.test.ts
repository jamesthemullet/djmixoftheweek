import { describe, expect, it } from 'vitest';
import type { Post } from '../../types';
import { getNewMixesForFollowedDJs } from '../getNewMixesForFollowedDJs';

const makePost = (overrides: Partial<NonNullable<Post>>): Post =>
  ({
    slug: 'mix',
    title: 'Mix',
    date: '2026-01-01',
    content: '',
    seo: { opengraphDescription: '', opengraphImage: { sourceUrl: '' } },
    genres: { nodes: [] },
    dJs: { nodes: [{ name: 'DJ One', slug: 'dj-one' }] },
    ...overrides,
  }) as Post;

describe('getNewMixesForFollowedDJs', () => {
  it('returns an empty array when no DJs are followed', () => {
    const posts = [makePost({ slug: 'a' })];
    expect(getNewMixesForFollowedDJs(posts, [], null)).toEqual([]);
  });

  it('excludes mixes from DJs the user does not follow', () => {
    const posts = [
      makePost({ slug: 'a', dJs: { nodes: [{ name: 'DJ One', slug: 'dj-one' }] } }),
      makePost({ slug: 'b', dJs: { nodes: [{ name: 'DJ Two', slug: 'dj-two' }] } }),
    ];
    const result = getNewMixesForFollowedDJs(posts, ['dj-one'], null);
    expect(result.map((p) => p?.slug)).toEqual(['a']);
  });

  it('includes a mix with multiple DJs if any of them is followed', () => {
    const posts = [
      makePost({
        slug: 'a',
        dJs: {
          nodes: [
            { name: 'DJ One', slug: 'dj-one' },
            { name: 'DJ Two', slug: 'dj-two' },
          ],
        },
      }),
    ];
    expect(getNewMixesForFollowedDJs(posts, ['dj-two'], null).map((p) => p?.slug)).toEqual(['a']);
  });

  it('excludes mixes published on or before the since date', () => {
    const posts = [
      makePost({ slug: 'old', date: '2026-01-01T00:00:00.000Z' }),
      makePost({ slug: 'new', date: '2026-02-01T00:00:00.000Z' }),
    ];
    const result = getNewMixesForFollowedDJs(posts, ['dj-one'], '2026-01-15T00:00:00.000Z');
    expect(result.map((p) => p?.slug)).toEqual(['new']);
  });

  it('returns all matching mixes when sinceDate is null', () => {
    const posts = [
      makePost({ slug: 'old', date: '2020-01-01T00:00:00.000Z' }),
      makePost({ slug: 'new', date: '2026-02-01T00:00:00.000Z' }),
    ];
    const result = getNewMixesForFollowedDJs(posts, ['dj-one'], null);
    expect(result.map((p) => p?.slug)).toEqual(['new', 'old']);
  });

  it('sorts matching mixes newest first', () => {
    const posts = [
      makePost({ slug: 'middle', date: '2026-02-01T00:00:00.000Z' }),
      makePost({ slug: 'newest', date: '2026-03-01T00:00:00.000Z' }),
      makePost({ slug: 'oldest', date: '2026-01-01T00:00:00.000Z' }),
    ];
    const result = getNewMixesForFollowedDJs(posts, ['dj-one'], null);
    expect(result.map((p) => p?.slug)).toEqual(['newest', 'middle', 'oldest']);
  });

  it('ignores null entries in the posts array', () => {
    const posts = [null, makePost({ slug: 'a' })];
    expect(getNewMixesForFollowedDJs(posts, ['dj-one'], null).map((p) => p?.slug)).toEqual(['a']);
  });
});
