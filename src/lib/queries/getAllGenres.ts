const GET_ALL_GENRES = `
  query GetAllGenres {
    genres(first: 100) {
      nodes {
        id
        name
        count
        slug
      }
    }
  }
`;

export default GET_ALL_GENRES;
