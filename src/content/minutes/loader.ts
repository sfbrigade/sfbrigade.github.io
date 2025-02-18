import type { Loader } from "astro/loaders";
import type { drive_v3 } from "googleapis";
import { GoogleDriveAPI } from "./GoogleDriveAPI.ts";

export function createLoader(
	name: string,
	credentials: object,
	driveID: string,
	folders: string[],
	preprocess?: (files: drive_v3.Schema$File[]) => Promise<drive_v3.Schema$File[]>): Loader
{
	const drive = new GoogleDriveAPI({ driveID, credentials });

	return {
		name,
		async load({
			meta,
			store,
			parseData,
			logger })
		{
			try {
				const pageToken = meta.get("pageToken");
				const { changed, newPageToken } = await drive.foldersHaveChanged(folders, pageToken);

				// store the new page token in the build cache so that the next time the
				// content collection loader is called, we can use the token to check if
				// anything actually changed
				meta.set("pageToken", newPageToken);

				if (changed) {
					// clear the store if there are any changes, since getPDFsInFolder()
					// returns all the PDFs currently in the folder, and it's easier to
					// just replace everything in order to handle deletions
					store.clear();

					let files = await drive.getFiles({ folders });

					if (typeof preprocess === "function") {
						// this may throw and stop the build, but it's not really clear how
						// errors should be handled here, so leave it for now
						files = await preprocess(files);
					}

					logger.info(`Stored ${files.length} files`);

					for (const file of files) {
						// for some reason, the id property in Schema$File is typed as being
						// possibly null, even though that never seems to happen.  so default
						// to an empty string to keep TS happy.
						const id = file.id || "";
						// parseData() uses the schema defined in the collection to validate
						// the data, and requires that all of the property keys are strings,
						// so cast the file, since Schema$File isn't typed the right way
						const data = await parseData(
							{ id, data: file as Record<string, unknown> });

						store.set({ id, data });
					}
				}
			} catch (err) {
				logger.error(String(err));
				logger.error(`Content collection will be empty.`);
			}
		}
	};
}
