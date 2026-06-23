const GET_NATIONALITY_NAMES = `
  query GetNationalityNames {
    nationalities(first: 100) {
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
