const GET_GENRE_BY_SLUG = `
  query GetGenreBySlug($slug: ID!, $postsFirst: Int = 100, $postsAfter: String) {
    genre(id: $slug, idType: SLUG) {
      id
      name
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
  }
`;

export default GET_GENRE_BY_SLUG;
