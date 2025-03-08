const MOST_RECENT_POST_QUERY = `
  query GetMostRecentPost {
    posts(first: 1) {
      nodes {
        id
        slug
        title
        featuredImage {
          node {
            mediaDetails {
              sizes {
                sourceUrl
                name
              }
            }
          }
        }
        genres {
          nodes {
            name
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

export default MOST_RECENT_POST_QUERY;
