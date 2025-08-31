// if we don't specify a font-weight: 700 for <strong>, it'll default to 900,
// which makes Barlow Condensed look too bold and crunchy
const Message = (props: { label: string, action: string, text: string }) => (
	<>
		<strong className="font-bold text-stone-800">{props.label} {props.action}:</strong> {props.text}
	</>
);

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
				message: <Message label="PR" action={action} text={pull_request.title} />,
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
				message: <Message label="Issue" action={action} text={issue.title} />,
				tooltip: `Issue ${action}: ${issue.title}`,
				link: issue.html_url,
				timestamp: created_at,
			};
		}
	},
];
