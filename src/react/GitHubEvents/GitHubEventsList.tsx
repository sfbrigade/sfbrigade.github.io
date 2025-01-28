import { use, useCallback, useEffect, useRef, useState } from "react";
import GitHubEventCard from "./GitHubEventCard.tsx";
import { LeftArrow, RightArrow } from "./icons.tsx";
import { type GitHubEvent } from "./getRecentEvents.tsx";
import styles from "./GitHubEventsList.module.css";

type ScrollDirection = "left" | "right";

interface ScrollButtonProps {
	direction: ScrollDirection;
	onClick: (direction: ScrollDirection) => void;
}

function ScrollButton({
	direction,
	onClick }: ScrollButtonProps)
{
	const ArrowIcon = direction === "left"
		? LeftArrow
		: RightArrow;

	return (
		<button
			className={`${styles.scrollButton} ${styles[direction]}`}
			onClick={() => onClick(direction)}
		>
			<ArrowIcon />
		</button>
	);
}

interface GitHubEventsListProps {
	eventsPromise: Promise<GitHubEvent[]>
}

export default function GitHubEventsList({
	eventsPromise }: GitHubEventsListProps)
{
	const events = use(eventsPromise);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const now = new Date();

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

	return (
		<div className={styles.githubEventsContainer}>
			{canScrollLeft &&
				<ScrollButton
					direction="left"
					onClick={scrollByPage}
				/>
			}
			<div className={styles.scrollContainer} ref={containerRef}>
				{events.map((event) =>
					<GitHubEventCard
						key={event.id}
						event={event}
						now={now}
					/>
				)}
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
