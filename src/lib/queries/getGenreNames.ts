const GET_GENRE_NAMES = `
  query GetGenreNames {
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

export default GET_GENRE_NAMES;
