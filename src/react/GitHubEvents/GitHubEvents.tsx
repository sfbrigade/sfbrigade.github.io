import { Suspense, useState } from "react";
import GitHubEventsList from "./GitHubEventsList";
import ErrorBoundary from "./ErrorBoundary";
import { GitHubIcon } from "./icons";
import { getRecentEvents } from "./getRecentEvents";

const Loader = () => (
	<div className="w-full aspect-[3/1] flex justify-center items-center text-gray-200 dark:text-gray-700">
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
	const [eventsPromise] = useState(() => getRecentEvents(org));

	const handleError = () => {
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
