import { fetchGraphQL } from "../lib/api";
import GET_DJ_NAMES from "../lib/queries/getDJNames";
import GET_GENRE_NAMES from "../lib/queries/getGenreNames";
import GET_NATIONALITY_NAMES from "../lib/queries/getNationalityNames";

export async function GET() {
  const siteUrl = "https://djmixoftheweek.com";
  const today = new Date().toISOString().split("T")[0];

  let posts = [];

  try {
    const response = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query AllPostsForSitemap {
            posts(first: 1000) {
              nodes {
                slug
                modified
              }
            }
          }
        `,
      }),
    });

    const { data } = await response.json();
    posts = data?.posts?.nodes || [];
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
  }

  let djs = [];
  try {
    let after;
    while (true) {
      const data = await fetchGraphQL(GET_DJ_NAMES, { after });
      const page = data?.dJs;
      if (page?.nodes) djs = djs.concat(page.nodes);
      if (page?.pageInfo?.hasNextPage) {
        after = page.pageInfo.endCursor ?? undefined;
      } else {
        break;
      }
    }
  } catch (error) {
    console.error("Error fetching DJs for sitemap:", error);
  }

  let genres = [];
  try {
    const data = await fetchGraphQL(GET_GENRE_NAMES);
    genres = data?.genres?.nodes || [];
  } catch (error) {
    console.error("Error fetching genres for sitemap:", error);
  }

  let nationalities = [];
  try {
    const data = await fetchGraphQL(GET_NATIONALITY_NAMES);
    nationalities = data?.nationalities?.nodes || [];
  } catch (error) {
    console.error("Error fetching nationalities for sitemap:", error);
  }

  // Static pages
  const staticPages = [
    { url: "", lastmod: today },
    { url: "about", lastmod: today },
    { url: "genres", lastmod: today },
    { url: "league-of-mixes", lastmod: today },
    { url: "djs", lastmod: today },
    { url: "nationalities", lastmod: today },
    { url: "your-djs", lastmod: today },
    { url: "dj-leaderboard", lastmod: today },
  ];

  // Dynamic post pages
  const postPages = posts.map((post) => {
    let lastmod;
    try {
      lastmod = new Date(post.modified).toISOString().split("T")[0];
    } catch {
      lastmod = today;
    }

    return {
      url: post.slug,
      lastmod: lastmod,
    };
  });

  // Dynamic taxonomy pages
  const djPages = djs.filter((dj) => dj?.slug).map((dj) => ({ url: `dj/${dj.slug}`, lastmod: today }));
  const genrePages = genres
    .filter((genre) => genre?.slug)
    .map((genre) => ({ url: `genre/${genre.slug}`, lastmod: today }));
  const nationalityPages = nationalities
    .filter((nationality) => nationality?.slug)
    .map((nationality) => ({ url: `nationality/${nationality.slug}`, lastmod: today }));

  const allPages = [...staticPages, ...postPages, ...djPages, ...genrePages, ...nationalityPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}/${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.url === "" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
