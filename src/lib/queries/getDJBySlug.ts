import POST_FIELDS from "./postFields";

const GET_DJ_BY_SLUG = `
  query GetDJBySlug($slug: ID!, $postsFirst: Int = 100, $postsAfter: String) {
    dJ(id: $slug, idType: SLUG) {
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

export default GET_DJ_BY_SLUG;
