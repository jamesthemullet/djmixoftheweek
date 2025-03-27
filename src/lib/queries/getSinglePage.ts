const GET_SINGLE_PAGE = `
  query SinglePage($id: ID!) {
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
    }
  }
`;

export default GET_SINGLE_PAGE;
