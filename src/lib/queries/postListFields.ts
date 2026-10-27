const POST_LIST_FIELDS = `
  id
  slug
  title
  date
  genres {
    nodes {
      name
      slug
    }
  }
  dJs {
    nodes {
      name
      slug
    }
  }
`;

export default POST_LIST_FIELDS;
