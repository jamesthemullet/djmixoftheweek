import { describe, expect, it } from 'vitest';
import ALL_POSTS_QUERY from '../allPosts';
import GET_ALL_DJS from '../getAllDJs';
import GET_ALL_NATIONALITIES from '../getAllNationalities';
import GET_DJ_NAMES from '../getDJNames';
import GET_GENRE_BY_SLUG from '../getGenreBySlug';
import GET_GENRE_NAMES from '../getGenreNames';
import GET_SINGLE_PAGE from '../getSinglePage';
import MORE_POSTS from '../morePosts';
import MOST_RECENT_POST_QUERY from '../mostRecentPost';
import OTHER_POSTS_AFTER_FIRST_QUERY from '../otherPostsAfterFirst';

describe('allPosts query', () => {
  it('is a non-empty string', () => {
    expect(typeof ALL_POSTS_QUERY).toBe('string');
    expect(ALL_POSTS_QUERY.trim().length).toBeGreaterThan(0);
  });
  it('contains the AllPosts operation name', () => {
    expect(ALL_POSTS_QUERY).toContain('AllPosts');
  });
  it('requests slug, title, genres, and pageInfo fields', () => {
    expect(ALL_POSTS_QUERY).toContain('slug');
    expect(ALL_POSTS_QUERY).toContain('title');
    expect(ALL_POSTS_QUERY).toContain('genres');
    expect(ALL_POSTS_QUERY).toContain('pageInfo');
  });
});

describe('getAllDJs query', () => {
  it('is a non-empty string', () => {
    expect(typeof GET_ALL_DJS).toBe('string');
    expect(GET_ALL_DJS.trim().length).toBeGreaterThan(0);
  });
  it('contains the GetAllDJs operation name', () => {
    expect(GET_ALL_DJS).toContain('GetAllDJs');
  });
  it('requests dJs, slug, and pageInfo fields', () => {
    expect(GET_ALL_DJS).toContain('dJs');
    expect(GET_ALL_DJS).toContain('slug');
    expect(GET_ALL_DJS).toContain('pageInfo');
  });
});

describe('getAllNationalities query', () => {
  it('is a non-empty string', () => {
    expect(typeof GET_ALL_NATIONALITIES).toBe('string');
    expect(GET_ALL_NATIONALITIES.trim().length).toBeGreaterThan(0);
  });
  it('contains the GetAllNationalities operation name', () => {
    expect(GET_ALL_NATIONALITIES).toContain('GetAllNationalities');
  });
  it('requests nationalities, slug, and posts fields', () => {
    expect(GET_ALL_NATIONALITIES).toContain('nationalities');
    expect(GET_ALL_NATIONALITIES).toContain('slug');
    expect(GET_ALL_NATIONALITIES).toContain('posts');
  });
});

describe('getDJNames query', () => {
  it('is a non-empty string', () => {
    expect(typeof GET_DJ_NAMES).toBe('string');
    expect(GET_DJ_NAMES.trim().length).toBeGreaterThan(0);
  });
  it('contains the GetDJNames operation name', () => {
    expect(GET_DJ_NAMES).toContain('GetDJNames');
  });
  it('requests id, name, count, and slug fields', () => {
    expect(GET_DJ_NAMES).toContain('id');
    expect(GET_DJ_NAMES).toContain('name');
    expect(GET_DJ_NAMES).toContain('count');
    expect(GET_DJ_NAMES).toContain('slug');
  });
});

describe('getGenreBySlug query', () => {
  it('is a non-empty string', () => {
    expect(typeof GET_GENRE_BY_SLUG).toBe('string');
    expect(GET_GENRE_BY_SLUG.trim().length).toBeGreaterThan(0);
  });
  it('contains the GetGenreBySlug operation name', () => {
    expect(GET_GENRE_BY_SLUG).toContain('GetGenreBySlug');
  });
  it('uses the $slug variable and requests genre and posts fields', () => {
    expect(GET_GENRE_BY_SLUG).toContain('$slug');
    expect(GET_GENRE_BY_SLUG).toContain('genre');
    expect(GET_GENRE_BY_SLUG).toContain('posts');
    expect(GET_GENRE_BY_SLUG).toContain('pageInfo');
  });
});

describe('getGenreNames query', () => {
  it('is a non-empty string', () => {
    expect(typeof GET_GENRE_NAMES).toBe('string');
    expect(GET_GENRE_NAMES.trim().length).toBeGreaterThan(0);
  });
  it('contains the GetGenreNames operation name', () => {
    expect(GET_GENRE_NAMES).toContain('GetGenreNames');
  });
  it('requests genres with id, name, count, and slug', () => {
    expect(GET_GENRE_NAMES).toContain('genres');
    expect(GET_GENRE_NAMES).toContain('id');
    expect(GET_GENRE_NAMES).toContain('name');
    expect(GET_GENRE_NAMES).toContain('count');
    expect(GET_GENRE_NAMES).toContain('slug');
  });
});

describe('getSinglePage query', () => {
  it('is a non-empty string', () => {
    expect(typeof GET_SINGLE_PAGE).toBe('string');
    expect(GET_SINGLE_PAGE.trim().length).toBeGreaterThan(0);
  });
  it('contains the SinglePage operation name', () => {
    expect(GET_SINGLE_PAGE).toContain('SinglePage');
  });
  it('requests title, content, featuredImage, and seo fields', () => {
    expect(GET_SINGLE_PAGE).toContain('title');
    expect(GET_SINGLE_PAGE).toContain('content');
    expect(GET_SINGLE_PAGE).toContain('featuredImage');
    expect(GET_SINGLE_PAGE).toContain('seo');
  });
});

describe('morePosts query', () => {
  it('is a non-empty string', () => {
    expect(typeof MORE_POSTS).toBe('string');
    expect(MORE_POSTS.trim().length).toBeGreaterThan(0);
  });
  it('contains the GetOtherPosts operation name', () => {
    expect(MORE_POSTS).toContain('GetOtherPosts');
  });
  it('requests posts with $first and $after variables and pageInfo', () => {
    expect(MORE_POSTS).toContain('$first');
    expect(MORE_POSTS).toContain('$after');
    expect(MORE_POSTS).toContain('pageInfo');
    expect(MORE_POSTS).toContain('endCursor');
  });
});

describe('mostRecentPost query', () => {
  it('is a non-empty string', () => {
    expect(typeof MOST_RECENT_POST_QUERY).toBe('string');
    expect(MOST_RECENT_POST_QUERY.trim().length).toBeGreaterThan(0);
  });
  it('contains the GetMostRecentPost operation name', () => {
    expect(MOST_RECENT_POST_QUERY).toContain('GetMostRecentPost');
  });
  it('requests id, slug, title, featuredImage, and genres', () => {
    expect(MOST_RECENT_POST_QUERY).toContain('id');
    expect(MOST_RECENT_POST_QUERY).toContain('slug');
    expect(MOST_RECENT_POST_QUERY).toContain('title');
    expect(MOST_RECENT_POST_QUERY).toContain('featuredImage');
    expect(MOST_RECENT_POST_QUERY).toContain('genres');
  });
});

describe('otherPostsAfterFirst query', () => {
  it('is a non-empty string', () => {
    expect(typeof OTHER_POSTS_AFTER_FIRST_QUERY).toBe('string');
    expect(OTHER_POSTS_AFTER_FIRST_QUERY.trim().length).toBeGreaterThan(0);
  });
  it('contains the GetOtherPosts operation name', () => {
    expect(OTHER_POSTS_AFTER_FIRST_QUERY).toContain('GetOtherPosts');
  });
  it('uses the $after variable and requests 11 posts with pageInfo', () => {
    expect(OTHER_POSTS_AFTER_FIRST_QUERY).toContain('$after');
    expect(OTHER_POSTS_AFTER_FIRST_QUERY).toContain('first: 11');
    expect(OTHER_POSTS_AFTER_FIRST_QUERY).toContain('endCursor');
  });
});
