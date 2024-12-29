import { intlFormatDistance } from "date-fns/intlFormatDistance";
import type { GitHubEvent } from "@/components/GitHubEvents/getRecentEvents.ts";
import styles from "@/components/GitHubEvents/GitHubEventCard.module.css";

const MaxTooltipLength = 350;

interface GitHubEventProps {
	event: GitHubEvent;
	now?: Date;
}

export default function GitHubEventCard({
	event,
	now = new Date() }: GitHubEventProps)
{
	const { repoName, link, avatar, handle, message, timestamp } = event;
	const tooltip = message.length > MaxTooltipLength
		? message.slice(0, MaxTooltipLength) + "..."
		: message;

	return (
		<a
			className={styles.eventCard}
			key={link}
			href={link}
			target="_blank"
			rel="noopener noreferrer"
		>
			<header>
				<img src={avatar} alt={`${handle}'s avatar`} />
				<h3>{handle}</h3>
			</header>
			<p title={tooltip}>{message}</p>
			<footer>
 				<h4>{repoName}</h4>
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
