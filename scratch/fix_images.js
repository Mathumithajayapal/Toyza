const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

htmlFiles.forEach(filename => {
    let content = fs.readFileSync(filename, 'utf8');
    let originalContent = content;

    // Pattern for src="images/img (X).jpg" or src="images\img (X).jpg"
    const pattern = /src="images[/\\]img\s*\((\d+)\)\.jpg"/gi;
    
    content = content.replace(pattern, (match, p1) => {
        const imgNum = parseInt(p1);
        const newNum = ((imgNum - 37) % 13) + 1;
        return `src="images/toy (${newNum}).jpg"`;
    });

    // Also fix backslashes in image paths generally
    content = content.replace(/src="images\\/g, 'src="images/');

    // Fix favicon if it exists as images/favicon.jpg but is missing
    // We'll leave it for now unless we find a better replacement.

    if (content !== originalContent) {
        fs.writeFileSync(filename, content, 'utf8');
        console.log(`Updated ${filename}`);
    } else {
        console.log(`No changes for ${filename}`);
    }
});
