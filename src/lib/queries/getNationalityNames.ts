import { DEFAULT_PAGE_SIZE } from '../constants';

const GET_NATIONALITY_NAMES = `
  query GetNationalityNames {
    nationalities(first: ${DEFAULT_PAGE_SIZE}) {
      nodes {
        id
        name
        count
        slug
      }
    }
  }
`;

export default GET_NATIONALITY_NAMES;
