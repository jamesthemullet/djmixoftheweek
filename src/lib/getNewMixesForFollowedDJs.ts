import type { Post } from '../types';

export function getNewMixesForFollowedDJs(
  posts: Post[],
  followedDJSlugs: string[],
  sinceDate: string | null,
): Post[] {
  if (followedDJSlugs.length === 0) return [];

  const since = sinceDate ? new Date(sinceDate) : null;

  return posts
    .filter((post): post is NonNullable<Post> => post != null)
    .filter((post) => post.dJs?.nodes?.some((dj) => followedDJSlugs.includes(dj.slug)))
    .filter((post) => {
      if (!since || !post.date) return true;
      return new Date(post.date) > since;
    })
    .sort((a, b) => new Date(b?.date ?? 0).getTime() - new Date(a?.date ?? 0).getTime());
}
