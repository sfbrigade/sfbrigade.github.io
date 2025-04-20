import { use, useCallback, useEffect, useRef, useState } from "react";
import GitHubEventCard from "./GitHubEventCard";
import { LeftArrow, RightArrow } from "./icons";
import { type GitHubEvent } from "./getRecentEvents";

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

	const positionClass = direction === "left"
		? "-left-10 xl:-left-12"
		: "-right-10 xl:-right-12";

	return (
		<button
			type="button"
			className={`
				absolute w-8 h-8 p-0
				text-gray-300 dark:text-gray-600
				opacity-25 hover:opacity-50 active:opacity-75
				transition-opacity duration-300 ease-in-out
				bg-none border-none rounded-full cursor-pointer
				flex justify-center items-center shadow-none
				hidden lg:flex ${positionClass}
			`}
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
		<div className="@container relative w-full flex items-center">
			{canScrollLeft &&
				<ScrollButton
					direction="left"
					onClick={scrollByPage}
				/>
			}
			<div
				ref={containerRef}
				className="
					flex-1 flex gap-10
					overflow-x-auto scroll-smooth
					snap-x snap-mandatory
					scrollbar-hide"
			>
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
