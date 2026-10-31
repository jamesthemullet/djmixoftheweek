export async function subscribeToNewsletter(name: string, email: string): Promise<string> {
	const res = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/wp-json/custom/v1/subscribe`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, name }),
	});

	const data = await res.json();

	if (res.ok) {
		return data.message;
	}

	return `Error: ${data.message || "Something went wrong"}`;
}
