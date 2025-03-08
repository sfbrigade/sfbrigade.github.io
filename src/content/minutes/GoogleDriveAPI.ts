import { google, type drive_v3 } from "googleapis";

const DefaultScopes = ["https://www.googleapis.com/auth/drive.readonly"];
const DefaultFileFields = ["id", "name", "mimeType", "webViewLink", "createdTime", "parents"];

type GoogleDriveAPIOptions = {
	driveID: string;
	credentials: object;
	scopes?: string[];
}

export class GoogleDriveAPI {
	private drive: drive_v3.Drive;
	private driveID: string;
	private folderIDsByPath: Map<string, string> = new Map();

	constructor({
		driveID,
		credentials,
		scopes = DefaultScopes,	}: GoogleDriveAPIOptions)
	{
		const auth = new google.auth.GoogleAuth({	credentials, scopes });

		this.drive = google.drive({ version: "v3", auth });
		this.driveID = driveID;
	}

	private createQuery(options: {
		folderIDs?: string[];
		mimeTypes?: string[]; })
	{
		const { folderIDs = [], mimeTypes = [] } = options;
		const andClauses = [
			"mimeType!='application/vnd.google-apps.folder'",
			"trashed=false"
		];

		if (folderIDs.length) {
			andClauses.push("(" + folderIDs.map((id) => `'${id}' in parents`).join(" or ") + ")");
		}

		if (mimeTypes.length) {
			andClauses.push("(" + mimeTypes.map((type) => `mimeType='${type}'`).join(" or ") + ")");
		}

		return andClauses.join(" and ");
	}

	private createFieldsString(
		fields: string[])
	{
		return `files(${fields.join(", ")})`;
	}

	async getFolderID(
		folderPath: string)
	{
		if (!folderPath.startsWith("/")) {
			// paths need to be absolute, so assume this is an ID that points directly
			// to a folder
			return folderPath;
		}

		if (this.folderIDsByPath.has(folderPath)) {
			return this.folderIDsByPath.get(folderPath)!;
		}

		const folders = folderPath.split("/").filter(Boolean);
		// we have to start at the shared drive root
		let folderID = this.driveID;

		for (const folderName of folders) {
			const res = await this.drive.files.list({
				q: `name='${folderName}' and '${folderID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
				fields: "files(id, name)",
				spaces: "drive",
				includeItemsFromAllDrives: true,
				supportsAllDrives: true,
			});
			const folder = res.data.files?.[0];

			if (!folder) {
				throw new Error(`Google Drive folder '${folderName}' not found.`);
			}

			folderID = folder.id ?? "";
		}

		this.folderIDsByPath.set(folderPath, folderID);

		return folderID;
	}

	async getFiles(options: {
		folders?: string[];
		mimeTypes?: string[];
		fields?: string[]; })
	{
		const {
			folders = [],
			mimeTypes = [],
			fields = DefaultFileFields
		} = options;
		const folderIDs = await Promise.all(folders.map((folder) => this.getFolderID(folder)));
		const res = await this.drive.files.list({
			q: this.createQuery({ folderIDs, mimeTypes }),
			fields: this.createFieldsString(fields),
			orderBy: "name_natural",
			spaces: "drive",
			includeItemsFromAllDrives: true,
			supportsAllDrives: true,
			// for some reason, we have to include drive and the drive ID here to
			// get all the files if more than one folder is specified.  otherwise,
			// the result is empty.
			driveId: this.driveID,
			corpora: "drive",
		});

		return res.data.files ?? [];
	}

	async getPageToken()
	{
		const res = await this.drive.changes.getStartPageToken({
			driveId: this.driveID,
			supportsAllDrives: true,
		});

		return res.data.startPageToken ?? "";
	}

	async foldersHaveChanged(
		folders: string[],
		pageToken: string = "")
	{
		if (!pageToken) {
			return {
				changed: true,
				newPageToken: await this.getPageToken()
			};
		}

		const folderIDs = await Promise.all(folders.map((folder) => this.getFolderID(folder)));
		const folderIDSet = new Set(folderIDs);
		const { data: { changes = [], newStartPageToken }} = await this.drive.changes.list({
			pageToken: pageToken,
			supportsAllDrives: true,
			driveId: this.driveID,
			includeItemsFromAllDrives: true,
			fields: "newStartPageToken, changes(file(id, name, mimeType, parents))",
		});
		const changed = changes.some((change) => {
			const parents = change.file?.parents;

			return folderIDSet.intersection(new Set(parents)).size > 0;
		});

		return {
			changed,
			newPageToken: newStartPageToken ?? "",
		};
	}
}
