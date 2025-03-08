const ALL_POSTS_QUERY = `
  query AllPosts {
    posts {
      nodes {
        slug
        title
        customfields {
          rating
          currency
          price
          meat
          country
          yearVisited
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

export default ALL_POSTS_QUERY;
