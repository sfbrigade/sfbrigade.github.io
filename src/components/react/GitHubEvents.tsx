import React, { useCallback, useEffect, useRef, useState } from "react";
import GitHubEventCard from "@/components/react/GitHubEventCard.tsx";
import { getRecentEvents, type GitHubEvent } from "@/components/react/ghEventsAPI.ts";
import styles from "./GitHubEvents.module.css";

type ScrollDirection = "left" | "right";

interface ScrollButtonProps {
	direction: ScrollDirection;
	onClick: (direction: ScrollDirection) => void;
}

function ScrollButton({
	direction,
	onClick }: ScrollButtonProps)
{
	const label = direction === "left" ? "<" : ">";

	return (
		<button
			className={`${styles.scrollButton} ${styles[direction]}`}
			onClick={() => onClick(direction)}
		>
			{label}
		</button>
	);
}

interface GitHubEventsProps {
	org: string;
}

export default function GitHubEvents({
	org
}: GitHubEventsProps) {
	const [events, setEvents] = useState<GitHubEvent[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const now = new Date();

	useEffect(() => {
		getRecentEvents(org)
			.then(setEvents)
			.catch((err) => setError(err.message));
	}, [org]);

	useEffect(() => {
		function updateScrollButtons()
		{
			const container = containerRef.current;

			if (container) {
				setCanScrollLeft(container.scrollLeft > 0);
				setCanScrollRight(
					container.scrollWidth > container.clientWidth + container.scrollLeft
				);
			}
		}

		const container = containerRef.current;

		if (container) {
			container.addEventListener("scroll", updateScrollButtons);
			updateScrollButtons();

			return () => container.removeEventListener("scroll", updateScrollButtons);
		}
	}, [events]);

	const scrollByPage = useCallback((direction: ScrollDirection) => {
		const container = containerRef.current;

		if (container) {
			const scrollAmount = container.clientWidth;

			container.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className={styles.githubEventsContainer}>
			{canScrollLeft &&
				<ScrollButton
					direction="left"
					onClick={scrollByPage}
				/>
			}

			<div className={styles.eventList} ref={containerRef}>
				{events.map((event) => <GitHubEventCard event={event} now={now} />)}
			</div>

			{canScrollRight &&
				<ScrollButton
					direction="right"
					onClick={scrollByPage}
				/>
			}
		</div>
	);
}
