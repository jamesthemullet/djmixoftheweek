const POST_FIELDS = `
  slug
  featuredImage {
    node {
      caption
      id
      sourceUrl
      altText
      srcSet
      mediaDetails {
        height
        width
      }
    }
  }
  title
  date
  ratings {
    nodes {
      name
    }
  }
  genres {
    nodes {
      name
      slug
    }
  }
  seo {
    opengraphImage {
      sourceUrl
    }
  }
`;

export default POST_FIELDS;
