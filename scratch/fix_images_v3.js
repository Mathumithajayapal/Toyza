const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

htmlFiles.forEach(filename => {
    let content = fs.readFileSync(filename, 'utf8');
    let originalContent = content;

    // Fix backslashes in all images folder paths (src, href, or property img: "...")
    content = content.replace(/(src|href|img|imgSrc|background|url|image)\s*[=:]\s*["']images\\/gi, (match) => {
        return match.replace('\\', '/');
    });

    // Replace specific missing favicon
    content = content.replace(/href="images\/favicon\.jpg"/gi, 'href="images/toy (1).jpg"');
    
    // Pattern for "images/img (X).jpg" (handles any remaining ones in src, href or JS objects)
    const pattern = /images[/\\]img\s*\((\d+)\)\.jpg/gi;
    content = content.replace(pattern, (match, p1) => {
        const imgNum = parseInt(p1);
        const newNum = ((imgNum - 37) % 13) + 1;
        return `images/toy (${newNum}).jpg`;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filename, content, 'utf8');
        console.log(`Updated ${filename}`);
    } else {
        console.log(`No changes for ${filename}`);
    }
});
