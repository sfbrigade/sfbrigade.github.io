import { use, useCallback, useEffect, useRef, useState } from "react";
import GitHubEventCard from "./GitHubEventCard"; // Updated import path
import { LeftArrow, RightArrow } from "./icons"; // Updated import path
import { type GitHubEvent } from "./getRecentEvents"; // Updated import path

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

	// Tailwind classes replacing GitHubEventsList.module.css .scroll-button
	// Assuming theme colors like 'secondary-background' are mapped in tailwind.config.js
	const positionClass = direction === 'left' ? '-left-10 xl:-left-12' : '-right-10 xl:-right-12'; // Adjust positioning

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
				// Add a small tolerance (e.g., 1px) for scroll calculations
				setCanScrollLeft(container.scrollLeft > 1);
				setCanScrollRight(
					container.scrollWidth > container.clientWidth + container.scrollLeft + 1
				);
			}
		}

		const container = containerRef.current;

		if (container) {
			// Use ResizeObserver for more reliable updates on size changes
			const resizeObserver = new ResizeObserver(updateScrollButtons);
			resizeObserver.observe(container);

			container.addEventListener("scroll", updateScrollButtons, { passive: true });
			updateScrollButtons(); // Initial check

			return () => {
				container.removeEventListener("scroll", updateScrollButtons);
				resizeObserver.unobserve(container);
			};
		}
	}, [events]); // Re-run if events change

	const scrollByPage = useCallback((direction: ScrollDirection) => {
		const container = containerRef.current;

		if (container) {
			const scrollAmount = container.clientWidth; // Scroll by visible width

			container.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	}, []);

	// Tailwind classes replacing GitHubEventsList.module.css .github-events-container and .scroll-container
	return (
		<div className="@container relative w-full flex items-center">
			{canScrollLeft &&
				<ScrollButton
					direction="left"
					onClick={scrollByPage}
				/>
			}
			{/* Scroll container */}
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

// Add this to your tailwind.config.js or global CSS if you don't have it:
/*
@layer utilities {
  .scrollbar-hide {
    scrollbar-width: none; // Firefox
    -ms-overflow-style: none; // IE/Edge
    &::-webkit-scrollbar {
      display: none; // Chrome/Safari/Opera
    }
  }
}
*/
