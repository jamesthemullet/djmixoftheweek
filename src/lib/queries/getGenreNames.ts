import { DEFAULT_PAGE_SIZE } from '../constants';

const GET_GENRE_NAMES = `
  query GetGenreNames {
    genres(first: ${DEFAULT_PAGE_SIZE}) {
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
