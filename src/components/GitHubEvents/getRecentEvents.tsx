const EventProcessors = [
	{
		type: "PushEvent",
		process: (event: any, repo: string) => {
			const { actor, payload, created_at } = event;

			return payload.commits.map((commit: any) => ({
				id: commit.sha,
				repo,
				username: actor.display_login,
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
	},
	{
		type: "PullRequestEvent",
		process: (event: any, repo: string) => {
			const { id, actor, payload: { action, pull_request }, created_at } = event;

			return {
				id,
				repo,
				username: actor.login,
				avatar: actor.avatar_url,
				message: <><strong>PR {action}:</strong> {pull_request.title}</>,
				tooltip: `PR ${action}: ${pull_request.title}`,
				link: pull_request.html_url,
				timestamp: created_at,
			};
		}
	},
	{
		type: "IssuesEvent",
		process: (event: any, repo: string) => {
			const { id, actor, payload: { action, issue }, created_at } = event;

			return {
				id,
				repo,
				username: actor.login,
				avatar: actor.avatar_url,
				message: <><strong>Issue {action}:</strong> {issue.title}</>,
				tooltip: `Issue ${action}: ${issue.title}`,
				link: issue.html_url,
				timestamp: created_at,
			};
		}
	},
];

export type GitHubEvent = {
	id: string;
	repo: string;
	username: string;
	avatar: string;
	message: string;
	tooltip?: string;
	link: string;
	timestamp: string;
};

export async function getRecentEvents(
	org: string): Promise<GitHubEvent[]>
{
	const apiUrl = `https://api.github.com/orgs/${org}/events?per_page=100`;
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
		.map((event: any) => {
			if (!event.actor.login.includes("dependabot")) {
				const { type, repo: { name } } = event;
				const repo = name.replace(org + "/", "");

				for (const processor of EventProcessors) {
					if (processor.type === type) {
						const result = processor.process(event, repo);

						if (result) {
							return result;
						}
					}
				}
			}

			// this is an event we want to ignore
			return null;
		})
		.flat()
		.filter((event: GitHubEvent) => {
			const key = event?.id;

			if (!event || eventKeys.has(key)) {
				// filter out the events that didn't match any of the processors or that
				// we've already seen
				return false;
			}

			eventKeys.add(key);

			return true;
		});
}
