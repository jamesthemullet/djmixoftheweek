const GET_RECENT_POSTS_QUERY = `
  query GetRecentPosts($first: Int!) {
    posts(first: $first) {
      nodes {
        slug
        title
        date
        content
      }
    }
  }
`;

export default GET_RECENT_POSTS_QUERY;
