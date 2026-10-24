import { DEFAULT_PAGE_SIZE } from '../constants';

const GET_DJ_NAMES = `
  query GetDJNames($after: String) {
    dJs(first: ${DEFAULT_PAGE_SIZE}, after: $after) {
      nodes {
        id
        name
        count
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default GET_DJ_NAMES;
