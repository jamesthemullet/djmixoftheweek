import { DEFAULT_PAGE_SIZE } from '../constants';

const GET_ALL_DJS = `
  query GetAllDJs($after: String) {
    dJs(first: ${DEFAULT_PAGE_SIZE}, after: $after) {
      nodes {
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default GET_ALL_DJS;
