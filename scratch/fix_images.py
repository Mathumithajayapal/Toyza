import os
import re

# Define the mapping logic or explicit map
# Available: toy (1).jpg to toy (13).jpg

def get_replacement(match):
    img_num_str = match.group(1)
    try:
        img_num = int(img_num_str)
        # Simple mapping: (num % 13) + 1
        new_num = ((img_num - 37) % 13) + 1
        return f'src="images/toy ({new_num}).jpg"'
    except ValueError:
        return f'src="images/toy (1).jpg"'

# Regex to match src="images/img (X).jpg" or src="images\img (X).jpg"
pattern = re.compile(r'src="images[/\\]img\s*\((\d+)\)\.jpg"', re.IGNORECASE)

# Also handle cases like src="${p.img}" or other dynamic stuff if they reference img (X)
# But those are usually defined in the JS data, which is inside the HTML.

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = pattern.sub(get_replacement, content)
    
    # Also fix backslashes in image paths generally
    new_content = re.sub(r'src="images\\', 'src="images/', new_content)
    
    # Fix favicon if it doesn't exist? (assuming toy (1).jpg as fallback)
    # new_content = new_content.replace('src="images/favicon.jpg"', 'src="images/toy (1).jpg"')
    
    if new_content != content:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    else:
        print(f"No changes for {filename}")
