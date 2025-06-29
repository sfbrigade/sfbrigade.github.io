import { intlFormatDistance } from "date-fns/intlFormatDistance";
import type { GitHubEvent } from "./getRecentEvents";

const MaxTooltipLength = 350;

interface GitHubEventProps {
	event: GitHubEvent;
	now?: Date;
}

export default function GitHubEventCard({
	event,
	now = new Date() }: GitHubEventProps)
{
	const { repo, link, avatar, username, message, tooltip = message, timestamp } = event;
	const messageTooltip = tooltip.length > MaxTooltipLength
		? tooltip.slice(0, MaxTooltipLength) + "..."
		: tooltip;

	return (
		<a
			key={link}
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			className="
				w-[calc((100cqw-2*theme(spacing.1u))/3)]
				block aspect-square p-4
				text-center no-underline
				text-stone-600 dark:text-stone-400
				flex flex-col items-center justify-between flex-shrink-0
				bg-stone-50 dark:bg-stone-800
				border border-stone-300 dark:border-stone-700
				transition-colors duration-300 ease-in-out
				hover:bg-stone-200 dark:hover:bg-stone-700
				hover:text-stone-700 dark:hover:text-stone-400
				snap-start
				overflow-hidden break-words
			"
		>
			<header className="flex flex-col items-center">
				<img
					src={avatar}
					alt={`${username}'s avatar`}
					className="w-14 h-14 aspect-square rounded-full mb-1"
				/>
				<h3 className="m-0 mb-1 text-base text-muted font-semibold">{username}</h3>
			</header>
			<p
				title={messageTooltip}
				className="text-sm leading-[1.2] font-condensed m-0 overflow-hidden text-ellipsis break-words line-clamp-2 lg:line-clamp-3"
					// break-words doesn't actually add word-break: break-word, which is needed to handle the long lines
				style={{ wordBreak: "break-word" }}
			>
				{message}
			</p>
			<footer className="text-xs text-muted">
				<h4 className="mt-1 mb-0 font-bold">{repo}</h4>
				<time
					dateTime={timestamp}
					title={new Date(timestamp).toLocaleString()}
				>
					{intlFormatDistance(timestamp, now)}
				</time>
			</footer>
		</a>
	);
}
