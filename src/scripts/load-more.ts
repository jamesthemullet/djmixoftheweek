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
				li.innerHTML = `
          <a href="${post?.slug}" rel="noopener noreferrer">
            <img src="${
							post?.featuredImage?.node?.mediaDetails?.sizes?.find(
								(size) => size.name === "medium_large",
							)?.sourceUrl || ""
						}" alt="" width="768" height="576" loading="lazy" />
          </a>
          <h2>
            <a href="${post?.slug}" rel="noopener noreferrer">${post?.title}</a>
          </h2>
          <ul class="genres">
            <li>${post?.genres.nodes.map((genre) => genre.name).join(", ")}</li>
          </ul>
        `;
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
