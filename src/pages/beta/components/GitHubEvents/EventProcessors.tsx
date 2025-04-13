export const EventProcessors = [
	{
		type: "PushEvent",
		process(
			event: any,
			repo: string)
		{
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
		process(
			event: any,
			repo: string)
		{
			const {
				id,
				actor,
				payload: { action, pull_request },
				created_at
			} = event;

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
		process(
			event: any,
			repo: string)
		{
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
