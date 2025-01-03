export type GitHubEvent = {
	repoName: string;
	handle: string;
	avatar: string;
	message: string;
	link: string;
	timestamp: string;
};

async function fetchRecentEvents(
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

	const eventKeys = new Set<string>();
	const events = await response.json();

	return events
		.filter((event: any) =>
			(event.type === "PushEvent" || event.type === "PullRequestEvent")
			&& !event.actor.login.includes("dependabot")
		)
		.map((event: any) => {
			const { actor, payload, type, created_at, repo: { name } } = event;
			const repoName = name.replace(org + "/", "");

			if (type === "PushEvent") {
				return payload.commits.map((commit: any) => ({
					repoName,
					handle: actor.display_login,
					avatar: actor.avatar_url,
					message: commit.message,
					// you can get to the html_url value if you call another API, but to
					// make things easier, just create that URL manually
					link: commit.url
						.replace("api.", "")
						.replace("/repos", "")
						.replace("/commits/", "/commit/"),
					timestamp: created_at,
				}));
			}

			if (type === "PullRequestEvent") {
				return {
					repoName,
					handle: actor.login,
					avatar: actor.avatar_url,
					message: payload.pull_request.title,
					link: payload.pull_request.html_url,
					timestamp: created_at,
				};
			}
		})
		.flat()
		.filter((event: GitHubEvent) => {
			const key = `${event.repoName}-${event.handle}-${event.message}`;

			if (eventKeys.has(key)) {
				// we've already seen a newer version of this event, so filter it out
				return false;
			}

			eventKeys.add(key);

			return true;
		});
}

function withCache<T>(
	func: (key: string) => Promise<T>): (key: string) => Promise<T>
{
  const cache = new Map<string, Promise<T>>();

  return (key) => {
    if (!cache.has(key)) {
			// in theory, we probably want to catch errors here, delete the key and
			// then re-throw the error, but the .catch() runs outside the rendering
			// flow, so the ErrorBoundary won't catch the error.  since we hide the
			// whole component on an error anyway, don't worry about it for now.
      cache.set(key, func(key));
    }

    return cache.get(key)!;
  };
}

export const getRecentEvents = withCache(fetchRecentEvents);
