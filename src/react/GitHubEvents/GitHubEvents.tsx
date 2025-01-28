import { Suspense, useState } from "react";
import GitHubEventsList from "./GitHubEventsList.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";
import { GitHubIcon } from "./icons.tsx";
import { getRecentEvents } from "./getRecentEvents.tsx";
import styles from "./GitHubEvents.module.css";

const Loader = () => (
	<div className={styles.loader}>
		<GitHubIcon />
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
		const section = document.getElementById(sectionID);

		if (section) {
			// if there's some sort of error when fetching GitHub events, then just
			// hide the Astro section that contains this component, since it's not
			// critical to the site, and it's better than showing a broken component
			section.style.display = "none";
		}
	};

	// the Suspense component will show the Loader fallback until the eventsPromise
	// resolves and the GitHubEventsList component renders
	return (
		<ErrorBoundary onError={handleError}>
			<Suspense fallback={<Loader />}>
				<GitHubEventsList eventsPromise={eventsPromise} />
			</Suspense>
		</ErrorBoundary>
	);
}
