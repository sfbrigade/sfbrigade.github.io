export const projectsURL = "https://sfbrigade.notion.site/Current-Projects-4fefa377e1424ff0b59230b9c160e6a4";
export const wikiURL = "https://sfbrigade.notion.site/Code-for-San-Francisco-Wiki-3ae6aaf3ad3f4b7a9caab1c291c60081";
export const proposeTalkURL = "https://docs.google.com/forms/d/e/1FAIpQLScHe7aWQ-2n3lSTU1WfcK8rhBZp8pkDGH9EcJdbQb5lqMbbzA/viewform";
export const pitchProjectURL = "https://docs.google.com/forms/d/e/1FAIpQLSexe5qvmJ6LTiU1HcR-XAzlrgPLBudVBPK_ouHeBkFz2JVUHw/viewform";
export const newsletterURL = "https://eepurl.com/bfFkF9";
export const memberFormURL = "https://c4sf.me/member";
export const slackURL = "https://c4sf.me/slack";
export const blogURL = "https://c4sf.me/blog";
export const meetupURL = "https://www.meetup.com/sfcivictech/";
export const twitterURL = "https://twitter.com/sfcivictech";
export const githubURL = "https://github.com/sfbrigade";
export const facebookURL = "https://www.facebook.com/sfcivictech";
export const linkedinURL = "https://www.linkedin.com/company/sfbrigade/";

export const base = (url: string) => url.startsWith("/") ? (import.meta.env.BASE_URL + url).replace("//", "/") : url;
