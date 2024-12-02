import { intlFormatDistance } from "date-fns/intlFormatDistance";
import type { GitHubEvent } from "@/components/react/ghEventsAPI.ts";
import styles from "@/components/react/GitHubEvents.module.css";

interface GitHubEventProps {
	event: GitHubEvent;
	now?: Date;
}

export default function GitHubEventCard({
	event,
	now = new Date() }: GitHubEventProps)
{
	const { link, avatar, handle, message, timestamp } = event;

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
				<h4>{handle}</h4>
				<p>{message}</p>
			</div>
			<time
				dateTime={timestamp}
				title={new Date(timestamp).toLocaleString()}
			>
				{intlFormatDistance(timestamp, now)}
			</time>
		</a>
	);
}
