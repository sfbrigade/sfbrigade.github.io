# `minutes` content collection

This custom content collection gets a list of PDFs from a publicly viewable folder on the SF Civic Tech Google Drive.


## Environment variables

The `.env` file should contain the following environment variables:

* `BOARD_MINUTES_DRIVE_ID`: the ID of the shared drive containing the PDFs.
* `BOARD_MINUTES_DRIVE_FOLDER`: the ID of the folder containing the PDFs.
* `BOARD_MINUTES_DRIVE_KEYS_JSON`: the JSON from a [service account](https://cloud.google.com/iam/docs/service-account-overview) credentials file downloaded from the Google Developers Console.

To find the drive and folder IDs, navigate to the folder and extract the ID from its URL: `https://drive.google.com/drive/u/folders/<folderID>`.  The drive ID is just the root folder of the shared drive, and the minutes are currently stored in a folder called `PUBLIC` that's viewable by anyone with the URL.  The `PUBLIC` folder should also be shared with the service account.

The environment variables must also be added to the GitHub repo.  Navigate to *Settings > Secrets and variables > Actions* and make sure a repository secret is created for each of the variables.  Note that the `.env` file may include quotes around some of the values to handle special characters, but do not include the quotes when adding the secrets to the repo.


## File patterns

Only PDF files in the `PUBLIC` folder that have a year and quarter in their name, like `2025 Q1`, will be included in the collection.  The year and quarter must be separated by a space, hyphen, or underscore.

If the filename starts with `DRAFT`, then the minutes will be marked with `(Draft)` on the About page.  This allows us to post the most recent minutes on the site before they are approved and Docusigned at the next board meeting.


## Caching

A version number for the Google Drive is stored in the local Astro cache, so that the collection doesn't have to query the API on every build.  To force the collection to re-query the API, delete the `.astro` cache directory or run `astro dev --force`.

If you're running the local Astro dev server, you can also press <kbd>s</kbd> and then <kbd>enter</kbd> to force the content layer to rebuild the collections.  This can be useful if you modify the files in the Google Drive `PUBLIC` folder and want to see the changes in the site immediately.


## Background

* [A ChatGPT conversation](https://chatgpt.com/share/67b57962-7400-8001-af67-502bc82eaf6a) that was helpful in learning how to use the Google Drive API.
* [An article](https://astro.build/blog/content-layer-deep-dive/) about creating custom content collections in Astro.
