import { intlFormatDistance } from "date-fns/intlFormatDistance";
import type { GitHubEvent } from "@/components/react/ghEventsAPI.ts";
import styles from "@/components/react/GitHubEventCard.module.css";

interface GitHubEventProps {
	event: GitHubEvent;
	now?: Date;
}

export default function GitHubEventCard({
	event,
	now = new Date() }: GitHubEventProps)
{
	const { repoName, link, avatar, handle, message, timestamp } = event;

	return (
		<a
			className={styles.eventCard}
			key={link}
			href={link}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div className={styles.eventInfo}>
				<img src={avatar} alt={`${handle}'s avatar`} />
				<h3>{handle}</h3>
				<p title={message}>{message}</p>
			</div>
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
