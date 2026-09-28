import os
import re

DIR = "src/content/blog"
files = os.listdir(DIR)

for f in files:
    if not f.endswith(".md"): continue
    path = os.path.join(DIR, f)
    with open(path, "r") as file:
        content = file.read()
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        continue
        
    frontmatter = parts[1]
    body = parts[2]
    
    # Extract title
    title_match = re.search(r'title:\s*"?([^"\n]+)"?', frontmatter)
    title = title_match.group(1).lower() if title_match else ""
    
    # Remove existing category lines
    lines = frontmatter.split('\n')
    new_lines = []
    skip = False
    for line in lines:
        if line.startswith("category:"):
            skip = True
            continue
        if skip and line.startswith("  -"):
            continue
        if skip and not line.startswith("  -") and line.strip() != "":
            skip = False
        if not skip:
            new_lines.append(line)
            
    # Calculate categories
    categories = []
    
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

    cat_str = "category:\n" + "\n".join(f"  - \"{c}\"" for c in categories)
    
    final_frontmatter = "\n".join(new_lines).strip() + "\n" + cat_str + "\n"
    new_content = "---\n" + final_frontmatter + "---" + body
    
    with open(path, "w") as file:
        file.write(new_content)

print("Done updating categories")
