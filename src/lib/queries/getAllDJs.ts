const GET_ALL_DJS = `
  query GetAllDJs($postsFirst: Int = 100, $postsAfter: String) {
    dJs(first: 100) {
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
              opengraphTitle
              opengraphDescription
              opengraphSiteName
              opengraphImage {
                uri
                altText
                mediaDetails {
                  file
                  height
                  width
                }
                mediaItemUrl
                sourceUrl
                srcSet
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
  }
`;

export default GET_ALL_DJS;
