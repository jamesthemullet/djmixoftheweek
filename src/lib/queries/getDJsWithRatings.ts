import { DEFAULT_PAGE_SIZE } from '../constants';

const GET_DJS_WITH_RATINGS = `
  query GetDJsWithRatings($djsAfter: String) {
    dJs(first: ${DEFAULT_PAGE_SIZE}, after: $djsAfter) {
      nodes {
        id
        name
        count
        slug
        posts(first: ${DEFAULT_PAGE_SIZE}) {
          nodes {
            ratings {
              nodes {
                name
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default GET_DJS_WITH_RATINGS;
