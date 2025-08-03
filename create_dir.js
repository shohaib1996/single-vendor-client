const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src', 'app', '(mainLayout)', '[id]');

fs.mkdirSync(dirPath, { recursive: true });
console.log(`Directory created at: ${dirPath}`);