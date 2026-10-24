import { DEFAULT_PAGE_SIZE } from '../constants';

const GET_GENRE_BY_SLUG = `
  query GetGenreBySlug($slug: ID!, $postsFirst: Int = ${DEFAULT_PAGE_SIZE}, $postsAfter: String) {
    genre(id: $slug, idType: SLUG) {
      id
      name
      slug
      posts(first: $postsFirst, after: $postsAfter) {
        nodes {
          slug
          featuredImage {
            node {
              caption
              id
              sourceUrl
              altText
              srcSet
              mediaDetails {
                height
                width
              }
            }
          }
          title
          date
          ratings {
            nodes {
              name
            }
          }
          genres {
            nodes {
              name
              slug
            }
          }
          seo {
            opengraphImage {
              sourceUrl
            }
          }
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
