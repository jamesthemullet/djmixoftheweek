const SINGLE_POST_QUERY = `
  query SinglePost($id: ID!) {
    page(idType: DATABASE_ID, id: $id) {
      title
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      seo {
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
      }
      genres {
        nodes {
          name
        }
      }
    }
  }
`;

export default SINGLE_POST_QUERY;
