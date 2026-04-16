const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

htmlFiles.forEach(filename => {
    let content = fs.readFileSync(filename, 'utf8');
    let originalContent = content;

    // Fix backslashes in all images folder paths (src or href)
    content = content.replace(/(src|href)="images\\/gi, '$1="images/');

    // Replace specific missing favicon
    content = content.replace(/href="images\/favicon\.jpg"/gi, 'href="images/toy (1).jpg"');
    
    // Pattern for src="images/img (X).jpg" (handles any remaining ones)
    const pattern = /src="images\/img\s*\((\d+)\)\.jpg"/gi;
    content = content.replace(pattern, (match, p1) => {
        const imgNum = parseInt(p1);
        const newNum = ((imgNum - 37) % 13) + 1;
        return `src="images/toy (${newNum}).jpg"`;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filename, content, 'utf8');
        console.log(`Updated ${filename}`);
    } else {
        console.log(`No changes for ${filename}`);
    }
});
