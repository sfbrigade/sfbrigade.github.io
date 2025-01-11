import { use, useCallback, useEffect, useRef, useState } from "react";
import GitHubEventCard from "./GitHubEventCard";
import { type GitHubEvent } from "./getRecentEvents.tsx";
import styles from "./GitHubEventsList.module.css";

const LeftArrow = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
		<path fill="currentColor" d="M512 256a256 256 0 1 0-512 0a256 256 0 1 0 512 0M271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87l87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9z" />
	</svg>
);
const RightArrow = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
		<path fill="currentColor" d="M0 256a256 256 0 1 0 512 0a256 256 0 1 0-512 0m241 121c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87l-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9z" />
	</svg>
);

type ScrollDirection = "left" | "right";

interface ScrollButtonProps {
	direction: ScrollDirection;
	onClick: (direction: ScrollDirection) => void;
}

function ScrollButton({
	direction,
	onClick }: ScrollButtonProps)
{
	const Label = direction === "left"
		? LeftArrow
		: RightArrow;

	return (
		<button
			className={`${styles.scrollButton} ${styles[direction]}`}
			onClick={() => onClick(direction)}
		>
			<Label />
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
