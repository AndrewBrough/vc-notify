const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function initializeDataFile(filename, defaultContent) {
    const filePath = path.join(__dirname, '..', 'data', filename);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, '\t'));
    }
}

function initializeDataDirectory() {
    const dataDir = path.join(__dirname, '..', 'data');
    ensureDirectoryExists(dataDir);

    // Initialize guild.json
    initializeDataFile('guild.json', {});
}

module.exports = {
    initializeDataDirectory
}; 