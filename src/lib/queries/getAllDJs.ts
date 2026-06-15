const GET_ALL_DJS = `
  query GetAllDJs($postsFirst: Int = 100, $postsAfter: String, $djsAfter: String) {
    dJs(first: 100, after: $djsAfter) {
      nodes {
        id
        name
        count
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default GET_ALL_DJS;
