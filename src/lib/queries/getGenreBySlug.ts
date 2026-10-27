import { DEFAULT_PAGE_SIZE } from "../constants";
import POST_FIELDS from "./postFields";

const GET_GENRE_BY_SLUG = `
  query GetGenreBySlug($slug: ID!, $postsFirst: Int = ${DEFAULT_PAGE_SIZE}, $postsAfter: String) {
    genre(id: $slug, idType: SLUG) {
      id
      name
      slug
      posts(first: $postsFirst, after: $postsAfter) {
        nodes {
          ${POST_FIELDS}
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export default GET_GENRE_BY_SLUG;
