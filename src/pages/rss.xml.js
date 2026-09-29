import rss from "@astrojs/rss";
import { fetchGraphQL } from "../lib/api";
import GET_RECENT_POSTS from "../lib/queries/getRecentPosts";

const SITE_TITLE = "DJ Mix Of The Week";
const SITE_DESCRIPTION =
	"One house/techno/minimal mix every week (ish), personally recommended for your listening joy.";
const RECENT_POSTS_COUNT = 20;

export async function GET(context) {
	let data;
	try {
		data = await fetchGraphQL(GET_RECENT_POSTS, { first: RECENT_POSTS_COUNT });
	} catch (error) {
		console.error('Error fetching recent posts for RSS feed:', error);
	}
	const posts = data?.posts?.nodes ?? [];

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.title,
			pubDate: new Date(post.date),
			description: post.content,
			link: `/${post.slug}/`,
		})),
	});
}
