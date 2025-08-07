export async function GET() {
  const siteUrl = 'https://djmixoftheweek.com';

  // Fetch all posts from your WordPress API
  const response = await fetch('https://blog.djmixoftheweek.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  const posts = data?.posts?.nodes || [];

  // Static pages
  const staticPages = [
    { url: '', lastmod: new Date().toISOString().split('T')[0] },
    { url: 'about', lastmod: new Date().toISOString().split('T')[0] },
    { url: 'genres', lastmod: new Date().toISOString().split('T')[0] },
    { url: 'league-of-mixes', lastmod: new Date().toISOString().split('T')[0] },
  ];

  // Dynamic post pages
  const postPages = posts.map((post) => {
    let lastmod;
    try {
      lastmod = new Date(post.modified).toISOString().split('T')[0];
    } catch (error) {
      lastmod = new Date().toISOString().split('T')[0];
    }

    return {
      url: post.slug,
      lastmod: lastmod,
    };
  });

  const allPages = [...staticPages, ...postPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}/${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.url === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
