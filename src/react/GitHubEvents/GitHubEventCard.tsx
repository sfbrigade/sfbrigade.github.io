import { intlFormatDistance } from "date-fns/intlFormatDistance";
import type { GitHubEvent } from "./getRecentEvents.tsx";
import styles from "./GitHubEventCard.module.css";

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
			className={styles.eventCard}
			key={link}
			href={link}
			target="_blank"
			rel="noopener noreferrer"
		>
			<header>
				<img src={avatar} alt={`${username}'s avatar`} />
				<h3>{username}</h3>
			</header>
			<p title={messageTooltip}>{message}</p>
			<footer>
 				<h4>{repo}</h4>
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
