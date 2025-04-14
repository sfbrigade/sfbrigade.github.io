import { intlFormatDistance } from "date-fns/intlFormatDistance";
import type { GitHubEvent } from "./getRecentEvents"; // Updated import path

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

	// Tailwind classes replacing GitHubEventCard.module.css
	// Note: Colors like text-muted, bg-form-element, border-card-border, bg-dropdown-hover need to be defined in your tailwind.config.js
	// Assuming default Tailwind colors for now, adjust as needed.
	// The width calculation is complex and relies on CSS vars and container queries in the original.
	// A fixed width or responsive grid approach might be better in Tailwind.
	// Using min-width and aspect ratio from original for now.
	return (
		<a
			href={link}
			key={link}
			target="_blank"
			rel="noopener noreferrer"
			className="
				w-[calc((100cqw-2*theme(spacing.10)-1px)/3)]
				block aspect-square p-4
				text-center no-underline text-gray-600 dark:text-gray-400
				flex flex-col items-center justify-between flex-shrink-0
				bg-gray-100 dark:bg-gray-800
				border border-gray-300 dark:border-gray-700
				transition-colors duration-300 ease-in-out
				hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-400
				snap-start
				overflow-hidden break-words
			"
		>
			<header className="flex flex-col items-center">
				{/* Adjusted image classes */}
				<img
					src={avatar}
					alt={`${username}'s avatar`}
					className="w-14 h-14 aspect-square rounded-full mb-1"
				/>
				<h3 className="m-0 mb-1 text-base font-semibold">{username}</h3>
			</header>
			{/* Paragraph with line clamping */}
			<p
				title={messageTooltip}
				className="text-sm leading-[1.2] m-0 overflow-hidden text-ellipsis break-words line-clamp-2 lg:line-clamp-3"
				// break-words doesn't actually add word-break: break-word, which is needed to handle the long lines
				style={{ wordBreak: "break-word" }}
			>
				{/* Apply opacity to strong tag if needed, e.g., <strong className="opacity-75"> */}
				{message}
			</p>
			<footer className="text-xs  opacity-75">
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
