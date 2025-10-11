export type Post = {
  slug: string;
  title: {
    rendered: string;
  };
  seo: {
    opengraphDescription: string;
    opengraphImage: {
      sourceUrl: string;
    };
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
      srcSet: string;
      caption: string;
      mediaDetails: {
        width: number;
        height: number;
        sizes: {
          sourceUrl: string;
          name: string;
          width: number;
          height: number;
        }[];
      };
    };
  };
  featured_image?: string;
  content: string;
  genres: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
} | null;

export type PopularPost = {
  slug: string;
  title: {
    rendered: string;
  };
  visits: number;
  featuredImage?: { node: { sourceUrl: string } };
} | null;

export type Genres = {
  genres: {
    nodes: Genre[];
  };
} | null;

export type Genre = {
  name: string;
  slug: string;
  posts: Post[];
  count: number;
} | null;

export type DJ = {
  id: string;
  name: string;
  slug: string;
  count: number;
  posts: {
    nodes: Post[];
  };
} | null;

export type Comment = {
  id: string;
  author: {
    node: {
      name: string;
      avatar: {
        url: string;
      };
    };
  };
  date: string;
  content: {
    rendered: string;
  };
  replies?: Comment[];
  parentId?: string;
};

export type Comments = Comment[] | null;
