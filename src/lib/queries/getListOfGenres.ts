const GET_LIST_OF_GENRES = `
query genres(first: 100) {
    nodes {
      slug
      name
      count
    }
  }
`;

export default GET_LIST_OF_GENRES;
