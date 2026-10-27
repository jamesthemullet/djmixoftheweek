import { DEFAULT_PAGE_SIZE } from '../constants';

const GET_ALL_NATIONALITIES = `
  query GetAllNationalities($postsFirst: Int = ${DEFAULT_PAGE_SIZE}, $postsAfter: String) {
    nationalities(first: ${DEFAULT_PAGE_SIZE}) {
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

export default GET_ALL_NATIONALITIES;
