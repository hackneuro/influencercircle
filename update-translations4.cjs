const fs = require('fs');

let content = fs.readFileSync('lib/translations.js', 'utf8');

// I will extract the english object and use it to format the portuguese and spanish ones properly
// Wait, I already have the exact string replacement working on local testing but heredoc is messing up the long strings.
