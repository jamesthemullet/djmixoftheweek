import { describe, expect, it } from 'vitest';
import type { Post } from '../../types';
import { getRelatedMixes } from '../relatedMixes';

const makePost = (slug: string): Post => ({
  slug,
  title: slug,
  seo: { opengraphDescription: '', opengraphImage: { sourceUrl: '' } },
  content: '',
  genres: { nodes: [] },
});

describe('getRelatedMixes', () => {
  it('excludes the current mix from the results', () => {
    const result = getRelatedMixes('current-mix', {
      djPosts: [makePost('current-mix'), makePost('other-mix')],
    });

    expect(result.map((post) => post?.slug)).toEqual(['other-mix']);
  });

  it('ranks mixes that appear in more than one taxonomy above single matches', () => {
    const result = getRelatedMixes('current-mix', {
      djPosts: [makePost('dj-only'), makePost('shared')],
      genrePosts: [makePost('genre-only'), makePost('shared')],
    });

    expect(result.map((post) => post?.slug)).toEqual(['shared', 'dj-only', 'genre-only']);
  });

  it('deduplicates a mix that appears in all three taxonomy lists', () => {
    const result = getRelatedMixes('current-mix', {
      djPosts: [makePost('triple-match')],
      genrePosts: [makePost('triple-match')],
      nationalityPosts: [makePost('triple-match')],
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe('triple-match');
  });

  it('respects the limit', () => {
    const result = getRelatedMixes(
      'current-mix',
      { genrePosts: [makePost('a'), makePost('b'), makePost('c')] },
      2
    );

    expect(result).toHaveLength(2);
  });

  it('ignores null entries and missing source lists', () => {
    const result = getRelatedMixes('current-mix', {
      djPosts: [null, makePost('ok')],
      genrePosts: undefined,
    });

    expect(result.map((post) => post?.slug)).toEqual(['ok']);
  });

  it('returns an empty array when no sources are provided', () => {
    expect(getRelatedMixes('current-mix', {})).toEqual([]);
  });
});
