import POST_LIST_FIELDS from "./postListFields";

const MOST_RECENT_POST_QUERY = `
  query GetMostRecentPost {
    posts(first: 1) {
      nodes {
        ${POST_LIST_FIELDS}
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
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

export default MOST_RECENT_POST_QUERY;
