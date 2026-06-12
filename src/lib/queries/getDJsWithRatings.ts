const GET_DJS_WITH_RATINGS = `
  query GetDJsWithRatings($djsAfter: String) {
    dJs(first: 100, after: $djsAfter) {
      nodes {
        id
        name
        count
        slug
        posts(first: 100) {
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
