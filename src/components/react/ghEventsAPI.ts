export type GitHubEvent = {
	handle: string;
	avatar: string;
	message: string;
	link: string;
	timestamp: string;
};

export async function getRecentEvents(
	org: string): Promise<GitHubEvent[]>
{
	const apiUrl = `https://api.github.com/orgs/${org}/events`;
	const headers = {
		Accept: "application/vnd.github.v3+json",
		"User-Agent": "GitHub-Events-Collector",
	};
	const response = await fetch(apiUrl, { headers });

	if (!response.ok) {
		throw new Error(`Failed to fetch events: ${response.statusText}`);
	}

	const events = await response.json();
	const filteredEvents: GitHubEvent[] = events
		.filter((event: any) =>
			(event.type === "PushEvent" || event.type === "PullRequestEvent")
			&& !event.actor.login.includes("dependabot")
		)
		.map((event: any) => {
			const { actor, payload, type, created_at } = event;

			if (type === "PushEvent") {
				return payload.commits.map((commit: any) => ({
					handle: actor.login,
					avatar: actor.avatar_url,
					message: commit.message,
					link: commit.url.replace("api.", "").replace("/repos", ""),
					timestamp: created_at,
				}));
			}

			if (type === "PullRequestEvent") {
				return {
					handle: actor.login,
					avatar: actor.avatar_url,
					message: payload.pull_request.title,
					link: payload.pull_request.html_url,
					timestamp: created_at,
				};
			}
		})
		.flat();

	return filteredEvents;
}
