const GET_DJ_NAMES = `
  query GetDJNames($after: String) {
    dJs(first: 100, after: $after) {
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
