import os
import re

DIR = "src/content/blog-v2"
files = os.listdir(DIR)

for f in files:
    if not f.endswith(".md"): continue
    path = os.path.join(DIR, f)
    with open(path, "r") as file:
        content = file.read()
    
    if "category:" in content:
        continue

    # Extract title
    title_match = re.search(r'title:\s*"?([^"\n]+)"?', content)
    title = title_match.group(1).lower() if title_match else ""

    categories = []
    
    # Simple logic
    if any(k in title or k in f for k in ["event", "summit", "night", "day", "hackathon", "recap", "forum", "congress", "camp", "codeacross", "odsc"]):
        categories.append("Event recap")
    if any(k in title or k in f for k in ["fellowship", "program", "fund", "group"]):
        categories.append("Program description")
    if any(k in title or k in f for k in ["member", "friend", "noob", "classroom", "walking", "review"]):
        categories.append("Member feature")
    if any(k in title or k in f for k in ["sponsor", "partner", "microsoft", "segment", "uber"]):
        categories.append("Partner feature")
    if any(k in title or k in f for k in ["case study", "project", "app", "tool", "referral", "guide", "visualization", "website", "platform", "civic tech"]):
        categories.append("Project case study")

    if not categories:
        categories.append("Program description") # fallback

    cat_str = "category:\n" + "\n".join(f"  - {c}" for c in categories)
    
    # insert before --- closing frontmatter
    parts = content.split("---", 2)
    if len(parts) >= 3:
        frontmatter = parts[1]
        frontmatter = frontmatter.rstrip() + "\n" + cat_str + "\n"
        new_content = "---" + frontmatter + "---" + parts[2]
        with open(path, "w") as file:
            file.write(new_content)

print("Done")
