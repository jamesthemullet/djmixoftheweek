const GET_ALL_DJS = `
  query GetAllDJs($after: String) {
    dJs(first: 100, after: $after) {
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
