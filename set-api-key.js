const { app } = require('electron');
const path = require('path');
const fs = require('fs');

// Set up the app path
const userDataPath = app.getPath('userData') || path.join(require('os').homedir(), 'AppData', 'Roaming', 'Glass');

// Your Gemini API key - NEVER commit actual keys to git
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY environment variable is not set');
    console.log('Usage: set GEMINI_API_KEY=your-key-here && node set-api-key.js');
    process.exit(1);
}

// Path to config file
const configPath = path.join(userDataPath, 'config.json');

console.log('Setting Gemini API key...');
console.log('Config path:', configPath);

// Read existing config or create new one
let config = {};
if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// Set the API key
if (!config.apiKeys) {
    config.apiKeys = {};
}
config.apiKeys.gemini = GEMINI_API_KEY;

// Save config
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✅ Gemini API key has been set!');
console.log('Please restart the application.');

process.exit(0);