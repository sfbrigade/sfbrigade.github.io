import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = process.argv[2] || "projects.md";
const outputDir = path.join(__dirname, "output");

try {
	// Ensure output directory exists
	await fs.mkdir(outputDir, { recursive: true });

	// Read the projects.md file
	const projectsContent = await fs.readFile(inputFile, "utf8");

	// Split the content into sections (Active, Inactive, Completed)
	const sections = projectsContent.split(/^# /m).filter(Boolean);

	for (const section of sections) {
		const [sectionTitle, ...projects] = section.split("---\n");
		const status = sectionTitle.trim().toLowerCase().replace(" projects", "");

		for (const project of projects) {
			const frontmatter = { status };

			// Extract project name
			const nameMatch = project.match(/^## (.+)/m);
			if (nameMatch) {
				frontmatter.name = nameMatch[1].trim();
			}

			// Extract thumbnail
			const thumbnailMatch = project.match(/!\[.+\]\((.+)\)/);
			if (thumbnailMatch) {
				frontmatter.thumbnail = thumbnailMatch[1];
			}

			// Extract description
			const descriptionMatch = project.match(/^## .+\n([\s\S]+?)(?=\n###|\n\*)/m);
			if (descriptionMatch) {
				frontmatter.description = descriptionMatch[1].trim();
			}

			// Extract technologies
			const techMatch = project.match(/### Tech Stack\n([\s\S]+?)(?=\n###|\n→|\n$)/m);
			if (techMatch) {
				frontmatter.technologies = techMatch[1].trim().split(/,|\n/).map(tech => `"${tech.trim()}"`);
			}

			// Extract GitHub link
			const githubMatch = project.match(/→ \[Contribute on GitHub?\]\((https:\/\/github\.com\/[^\)]+)\)/);
			if (githubMatch) {
				frontmatter.repos = [githubMatch[1].split("/").pop()];
			}

			// Extract Slack link
			const slackMatch = project.match(
				/→ \[Join on Slack\]\((https:\/\/sfbrigade\.slack\.com\/archives\/[^\)]+)\) \*\(([^)]+)\)\*/);
			if (slackMatch) {
				frontmatter.slack = {
					name: `"${slackMatch[2]}"`,
					url: slackMatch[1],
				};
			}

			// Extract website link
			const websiteMatch = project.match(/→ \[View Website\]\((https?:\/\/[^\)]+)\)/);
			if (websiteMatch) {
				frontmatter.website = websiteMatch[1];
			}

			// Generate frontmatter string
			const frontmatterString = "---\n" + Object.entries(frontmatter)
				.map(([key, value]) => {
					if (Array.isArray(value)) {
						return `${key}:\n  - ${value.join("\n  - ")}`;
					} else if (typeof value === "object") {
						return `${key}:\n  ${Object.entries(value).map(([k, v]) => `${k}: ${v}`).join("\n  ")}`;
					} else if (key === "description") {
						return `${key}: |-\n  ${value.replace(/\n/g, "\n  ")}`;
					} else {
						return `${key}: ${value}`;
					}
				})
				.join("\n") + "\n---\n";

			// Generate file name
			const fileName = frontmatter.name.toLowerCase().replace(/\s+/g, "-") + ".md";
			const filePath = path.join(outputDir, fileName);

			// Write to file
			await fs.writeFile(filePath, frontmatterString);

			console.log(`Created ${filePath}`);
		}
	}

	console.log("Finished processing projects.md");
} catch (error) {
	console.error("An error occurred:", error);
}

// the initial version of this script was created by Claude Sonnet from the following prompt
/*
create an ESM node script that reads in a markdown file whose path is passed in as an argument, or defaults to a local file called `projects.md`.  it should output one markdown file for each project listed in the file.  the name of each output markdown file should be the project name in lower kebab case, and should be stored in an `output` sub-directory.

each project in the list is separated by 3 hyphens, and the list is also split by h1 tags into Active, Inactive, and Completed.  that section title should be stored as the `status` key in the frontmatter.

each output markdown file should contain frontmatter that lists important details extracted from the projects.md file.

the list of frontmatter keys can include the following, but only if the associated value can be found in the project description:

- name
- status
- repos
- slack
- thumbnail
- website
- technologies
- description

===============================================================================
SAMPLE INPUT: below are a couple examples of how projects are listed in the projects.md file:

# Active Projects

---

![Screen Shot 2022-08-21 at 8.17.08 PM.png](https://media4.giphy.com/media/j71v7BdS9LLOtp3dzh/giphy.gif?cid=7941fdc6brw5f6c1rvmujl2c4vizdlhfoj235kxdc0t1yhyw&ep=v1_gifs_search&rid=giphy.gif&ct=g)

## Intentional Walk

Intentional Walk is a community program based on the baseball strategy of deliberately walking an opposing player to first base. In partnership with the SF Department of Public Health, we released the proof of concept application, welcoming over 500 users into the 2020 pilot and exceeding DPH’s goal for the initial test. Plans for the future include a 2021 release to support a production number of users.

### **Tech Stack**

Android, iOS, SQL, React Native, Python, Figma

→ [Join on Slack](https://sfbrigade.slack.com/archives/CSH8FFBHU) *(#proj-intentional-walk)*

→ [Contribute on Github](https://github.com/sfbrigade/intentional-walk)

---

![Untitled](Untitled%201.png)

## Routed

Everyday, paramedics make life and death decisions when choosing where to take patients. And they have to rely on their own experience to make the right choices.

The current $2m/year application used by the city is inadequate, so TeamBATS is piloting an app that helps paramedics know which ERs have available beds, and ERs can learn about patients who are en route.

### Tech Stack

React, Node, Express, Postgres, Gatsby

→ [Join on Slack](https://sfbrigade.slack.com/archives/CTLPPDJH2) *(#proj-routed)*

→ [Contribute on GitHub](https://github.com/sfbrigade/bats-server)

→ [View Website](https://routedapp.org/)

---

===============================================================================
EXPECTED OUTPUT:

output/intentional-walk.md:

---
status: active
name: Intentional Walk
repos:
  - intentional-walk
slack:
  name: "#proj-intentional-walk"
  url: https://sfbrigade.slack.com/archives/CSH8FFBHU
thumbnail: https://media4.giphy.com/media/j71v7BdS9LLOtp3dzh/giphy.gif?cid=7941fdc6brw5f6c1rvmujl2c4vizdlhfoj235kxdc0t1yhyw&ep=v1_gifs_search&rid=giphy.gif&ct=g
technologies:
  - Android
  - iOS
  - SQL
  - React Native
  - Python
  - Figma
description: >
  Intentional Walk is a community program based on the baseball strategy of deliberately walking an opposing player to first base. In partnership with the SF Department of Public Health, we released the proof of concept application, welcoming over 500 users into the 2020 pilot and exceeding DPH’s goal for the initial test. Plans for the future include a 2021 release to support a production number of users.
---


output/routed.md:

---
status: active
name: Routed
repos:
  - bats-server
slack:
  name: "#proj-routed"
  url: https://sfbrigade.slack.com/archives/CTLPPDJH2
thumbnail: Untitled%201.png
website: https://routedapp.org
technologies:
  - React
  - Node
  - Express
  - Postgres
  - Gatsby
description: >
  Every day, paramedics make life and death decisions when choosing where to take patients. And they have to rely on their own experience to make the right choices.

  The current $2M/year application used by the city is inadequate, so the Routed team is piloting an app that helps paramedics know which ERs have available beds, and ERs can learn about patients who are en route.
---
*/
