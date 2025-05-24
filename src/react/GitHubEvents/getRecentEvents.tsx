import { EventProcessors } from "./EventProcessors";

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
		.filter((event: GitHubEvent | null): event is GitHubEvent => {
			if (!event || eventKeys.has(event.id)) {
					// filter out nulls or events that we've already seen
				return false;
			}

			eventKeys.add(event.id);

			return true;
		});
}
