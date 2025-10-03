const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');

// Path to database
const dbPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Glass', 'pickleglass.db');
console.log('Database path:', dbPath);

// Open database
const db = new Database(dbPath);

// Your Gemini API key - NEVER commit actual keys to git
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY environment variable is not set');
    console.log('Usage: set GEMINI_API_KEY=your-key-here && node add-gemini-key.js');
    process.exit(1);
}

try {
    // Insert or replace API key
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO provider_settings
        (user_id, provider, api_key, is_active_llm, is_active_stt, updated_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
    `);

    stmt.run('default_user', 'gemini', GEMINI_API_KEY, 1, 1);

    console.log('✅ Gemini API key has been added successfully!');

    // Verify
    const verify = db.prepare('SELECT provider, is_active_llm, is_active_stt FROM provider_settings WHERE user_id = ? AND provider = ?');
    const result = verify.get('default_user', 'gemini');
    console.log('Verification:', result);

} catch (error) {
    console.error('Error:', error);
} finally {
    db.close();
}

console.log('\nYou can now restart the application.');