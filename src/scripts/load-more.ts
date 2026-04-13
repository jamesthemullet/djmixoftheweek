import { fetchGraphQL } from "../lib/api.ts";
import MORE_POSTS from "../lib/queries/morePosts.ts";
import type { Post } from "../types.ts";

document.addEventListener("DOMContentLoaded", () => {
	const button = document.getElementById("load-more") as HTMLButtonElement;
	const postList = document.getElementById("post-list");

	const first = 12;
	let cursor = button.dataset.cursor || null;

	button.addEventListener("click", async () => {
		if (!cursor) {
			button.style.display = "none";
			return;
		}

		button.textContent = "Loading...";

		try {
			const response = await fetchGraphQL(MORE_POSTS, { first, after: cursor });

			const posts = response?.posts?.nodes || [];
			cursor = response?.posts?.pageInfo?.endCursor || null;

			// biome-ignore lint/complexity/noForEach: <explanation>
			posts.forEach((post: Post) => {
				const li = document.createElement("li");

				const imgLink = document.createElement("a");
				imgLink.href = post?.slug || "";
				imgLink.rel = "noopener noreferrer";
				const img = document.createElement("img");
				img.src =
					post?.featuredImage?.node?.mediaDetails?.sizes?.find(
						(size) => size.name === "medium_large",
					)?.sourceUrl || "";
				img.alt = "";
				img.width = 768;
				img.height = 576;
				img.loading = "lazy";
				imgLink.appendChild(img);

				const h2 = document.createElement("h2");
				const titleLink = document.createElement("a");
				titleLink.href = post?.slug || "";
				titleLink.rel = "noopener noreferrer";
				titleLink.textContent = post?.title || "";
				h2.appendChild(titleLink);

				const ul = document.createElement("ul");
				ul.className = "genres";
				const genreLi = document.createElement("li");
				genreLi.textContent =
					post?.genres.nodes.map((genre) => genre.name).join(", ") || "";
				ul.appendChild(genreLi);

				li.appendChild(imgLink);
				li.appendChild(h2);
				li.appendChild(ul);
				postList?.appendChild(li);
			});

			button.dataset.cursor = cursor || "";
			button.textContent = "Load More";

			if (!cursor) {
				button.style.display = "none";
			}
		} catch (error) {
			console.error("Error loading more posts:", error);
			button.textContent = "Load More";
		}
	});
});
