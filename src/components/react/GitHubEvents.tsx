import React, { useEffect, useState, useRef } from "react";
import styles from "./GitHubEvents.module.css";

type GitHubEvent = {
	handle: string;
	avatar: string;
	message: string;
	link: string;
	timestamp: string;
};

async function getRecentGitHubEvents(org: string): Promise<GitHubEvent[]>
{
	const apiUrl = `https://api.github.com/orgs/${org}/events`;
	const headers = {
		Accept: "application/vnd.github.v3+json",
		"User-Agent": "GitHub-Events-Collector",
	};
	const response = await fetch(apiUrl, { headers });

	if (!response.ok) {
		throw new Error(`Failed to fetch events: ${response.statusText}`);
	}

	const events = await response.json();
	const filteredEvents: GitHubEvent[] = events
		.filter((event: any) =>
			(event.type === "PushEvent" || event.type === "PullRequestEvent")
				&& !event.actor.login.includes("dependabot")
		)
		.map((event: any) => {
			const { actor, payload, type, created_at } = event;

			if (type === "PushEvent") {
				return payload.commits.map((commit: any) => ({
					handle: actor.login,
					avatar: actor.avatar_url,
					message: commit.message,
					link: commit.url.replace("api.", "").replace("/repos", ""),
					timestamp: created_at,
				}));
			}

			if (type === "PullRequestEvent") {
				return {
					handle: actor.login,
					avatar: actor.avatar_url,
					message: payload.pull_request.title,
					link: payload.pull_request.html_url,
					timestamp: created_at,
				};
			}
		})
		.flat();

	return filteredEvents;
}

function formatRelativeTime(dateString: string): string
{
	const date = new Date(dateString);
	const now = new Date();
	const diff = now.getTime() - date.getTime();

	if (diff < 60 * 1000) {
		return "just now";
	}

	if (diff < 60 * 60 * 1000) {
		return `${Math.floor(
			diff / (60 * 1000))} minutes ago`;
	}

	if (diff < 24 * 60 * 60 * 1000) {
		return `${Math.floor(
			diff / (60 * 60 * 1000))} hours ago`;
	}

	return `${Math.floor(diff / (24 * 60 * 60 * 1000))} days ago`;
}

interface GitHubEventsProps {
	org: string;
}

export default function GitHubEvents({ org }: GitHubEventsProps) {
	const [events, setEvents] = useState<GitHubEvent[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		getRecentGitHubEvents(org)
			.then(setEvents)
			.catch((err) => setError(err.message));
	}, [org]);

	useEffect(() => {
		const updateScrollButtons = () => {
			const container = containerRef.current;

			if (container) {
				setCanScrollLeft(container.scrollLeft > 0);
				setCanScrollRight(
					container.scrollWidth > container.clientWidth + container.scrollLeft
				);
			}
		};

		const container = containerRef.current;

		if (container) {
			container.addEventListener("scroll", updateScrollButtons);
			updateScrollButtons();
			return () => container.removeEventListener("scroll", updateScrollButtons);
		}
	}, [events]);

	const scrollByPage = (direction: "left" | "right") => {
		const container = containerRef.current;

		if (container) {
			const scrollAmount = container.clientWidth;

			container.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className={styles.githubEventsContainer}>
			{canScrollLeft && (
				<button
					className={`${styles.scrollButton} ${styles.left}`}
					onClick={() => scrollByPage("left")}
				>
					{"<"}
				</button>
			)}
			<div className={styles.eventList} ref={containerRef}>
				{events.map((event, index) => {
					const { link, avatar, handle, message, timestamp } = event;

					return (
						<a
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							className={styles.eventCard}
							key={index}
						>
							<div className={styles.eventInfo}>
								<img src={avatar} alt={`${handle}'s avatar`} />
								<h4>{handle}</h4>
								<p>{message}</p>
							</div>
							<span className={styles.timestamp}
								title={new Date(timestamp).toLocaleString()}
							>
								{formatRelativeTime(timestamp)}
							</span>
						</a>
					);
				})}
			</div>
			{canScrollRight && (
				<button
					className={`${styles.scrollButton} ${styles.right}`}
					onClick={() => scrollByPage("right")}
				>
					{">"}
				</button>
			)}
		</div>
	);
}
