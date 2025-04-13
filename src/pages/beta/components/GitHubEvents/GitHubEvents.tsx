import { Suspense, useState } from "react";
import GitHubEventsList from "./GitHubEventsList"; // Updated import path
import ErrorBoundary from "./ErrorBoundary"; // Updated import path
import { GitHubIcon } from "./icons"; // Updated import path
import { getRecentEvents } from "./getRecentEvents"; // Updated import path

// Tailwind classes replacing GitHubEvents.module.css .loader
const Loader = () => (
	<div className="w-full aspect-[3/1] flex justify-center items-center text-gray-200 dark:text-gray-700">
		{/* Pulse animation using Tailwind */}
		<div className="h-[40%] animate-pulse">
			<GitHubIcon />
		</div>
	</div>
);

interface GitHubEventsProps {
	org: string;
	sectionID?: string;
}

export default function GitHubEvents({
	org,
	sectionID = "" }: GitHubEventsProps)
{
	// NOTE: getRecentEvents must be adapted if it uses browser-specific APIs not available during SSR
	// For Astro, consider fetching data within an Astro component and passing it as props,
	// or using techniques like useEffect for client-side fetching if SSR isn't strictly needed for this data.
	// Assuming getRecentEvents works or is adapted.
	const [eventsPromise] = useState(() => getRecentEvents(org));

	const handleError = () => {
		// This relies on DOM manipulation, which might be less ideal in Astro/React.
		// Consider passing a callback prop or using state management to hide the section.
		const section = sectionID ? document.getElementById(sectionID) : null;

		if (section) {
			section.style.display = "none";
		}
	};

	return (
		<ErrorBoundary onError={handleError}>
			<Suspense fallback={<Loader />}>
				<GitHubEventsList eventsPromise={eventsPromise} />
			</Suspense>
		</ErrorBoundary>
	);
}
