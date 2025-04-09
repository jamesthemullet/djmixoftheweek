export type Post = {
  slug: string;
  title: string;
  seo: { opengraphDescription: string };
  featuredImage?: { node: { sourceUrl: string } };
  content: string;
} | null;

export type PopularPost = {
  slug: string;
  title: string;
  visits: number;
  featuredImage?: { node: { sourceUrl: string } };
} | null;

export type Genre = {
  name: string;
  slug: string;
  posts: Post[];
  count: number;
} | null;
