const GET_ALL_GENRES = `
  query GetAllGenres {
    genres(first: 100) {
      nodes {
        id
        name
        count
        slug
        posts(first: 100) {
          nodes {
            slug
            featuredImage {
              node {
                caption
                id
                sourceUrl
                altText
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
        }
      }
    }
  }
`;

export default GET_ALL_GENRES;
