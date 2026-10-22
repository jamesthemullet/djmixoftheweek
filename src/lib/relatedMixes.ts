import type { Post } from '../types';

export type RelatedMixSources = {
  djPosts?: Post[];
  genrePosts?: Post[];
  nationalityPosts?: Post[];
};

/**
 * Ranks mixes related to `currentSlug` by how many of the supplied taxonomy
 * post lists (already fetched for the dj/genre/nationality pages) they
 * appear in, highest overlap first.
 */
export function getRelatedMixes(currentSlug: string, sources: RelatedMixSources, limit = 4): Post[] {
  const scored = new Map<string, { post: Post; score: number }>();

  const addPosts = (posts: Post[] | undefined) => {
    posts?.forEach((post) => {
      if (!post || post.slug === currentSlug) return;

      const existing = scored.get(post.slug);
      if (existing) {
        existing.score += 1;
      } else {
        scored.set(post.slug, { post, score: 1 });
      }
    });
  };

  addPosts(sources.djPosts);
  addPosts(sources.genrePosts);
  addPosts(sources.nationalityPosts);

  return Array.from(scored.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}
