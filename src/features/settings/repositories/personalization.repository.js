const databaseClient = require('../../common/services/databaseClient');
const authService = require('../../common/services/authService');

class PersonalizationRepository {
    constructor() {
        this.tableName = 'personalization';
    }

    /**
     * Initialize personalization table in SQLite
     */
    async initializeTable() {
        const db = databaseClient.getDb();
        if (!db) {
            throw new Error('Database not initialized');
        }

        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                name TEXT,
                role TEXT,
                company TEXT,
                goals TEXT,
                interests TEXT,
                work_style TEXT,
                preferred_tone TEXT DEFAULT 'professional',
                language TEXT DEFAULT 'ru',
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now')),
                UNIQUE(user_id)
            )
        `;

        try {
            db.prepare(createTableSQL).run();
            console.log(`[PersonalizationRepo] Table ${this.tableName} initialized`);
        } catch (error) {
            console.error('[PersonalizationRepo] Error creating table:', error);
            throw error;
        }
    }

    /**
     * Get personalization data for current user
     */
    async get() {
        const db = databaseClient.getDb();
        if (!db) {
            throw new Error('Database not initialized');
        }

        const user = authService.getCurrentUser();
        const userId = user?.uid || 'default_user';

        try {
            const stmt = db.prepare(`
                SELECT * FROM ${this.tableName}
                WHERE user_id = ?
            `);

            const row = stmt.get(userId);

            if (!row) {
                // Return default values if no personalization exists
                return {
                    name: '',
                    role: '',
                    company: '',
                    goals: '',
                    interests: '',
                    work_style: '',
                    preferred_tone: 'professional',
                    language: 'ru'
                };
            }

            return {
                id: row.id,
                name: row.name || '',
                role: row.role || '',
                company: row.company || '',
                goals: row.goals || '',
                interests: row.interests || '',
                work_style: row.work_style || '',
                preferred_tone: row.preferred_tone || 'professional',
                language: row.language || 'ru',
                created_at: row.created_at,
                updated_at: row.updated_at
            };
        } catch (error) {
            console.error('[PersonalizationRepo] Error getting personalization:', error);
            throw error;
        }
    }

    /**
     * Save personalization data for current user
     */
    async save(data) {
        const db = databaseClient.getDb();
        if (!db) {
            throw new Error('Database not initialized');
        }

        const user = authService.getCurrentUser();
        const userId = user?.uid || 'default_user';

        const {
            name = '',
            role = '',
            company = '',
            goals = '',
            interests = '',
            work_style = '',
            preferred_tone = 'professional',
            language = 'ru'
        } = data;

        try {
            // Use INSERT OR REPLACE to update if exists
            const stmt = db.prepare(`
                INSERT INTO ${this.tableName}
                (user_id, name, role, company, goals, interests, work_style, preferred_tone, language, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                ON CONFLICT(user_id) DO UPDATE SET
                    name = excluded.name,
                    role = excluded.role,
                    company = excluded.company,
                    goals = excluded.goals,
                    interests = excluded.interests,
                    work_style = excluded.work_style,
                    preferred_tone = excluded.preferred_tone,
                    language = excluded.language,
                    updated_at = datetime('now')
            `);

            stmt.run(userId, name, role, company, goals, interests, work_style, preferred_tone, language);

            console.log(`[PersonalizationRepo] Saved personalization for user: ${userId}`);

            // Return the saved data
            return await this.get();
        } catch (error) {
            console.error('[PersonalizationRepo] Error saving personalization:', error);
            throw error;
        }
    }

    /**
     * Delete personalization data for current user
     */
    async delete() {
        const db = databaseClient.getDb();
        if (!db) {
            throw new Error('Database not initialized');
        }

        const user = authService.getCurrentUser();
        const userId = user?.uid || 'default_user';

        try {
            const stmt = db.prepare(`
                DELETE FROM ${this.tableName}
                WHERE user_id = ?
            `);

            stmt.run(userId);

            console.log(`[PersonalizationRepo] Deleted personalization for user: ${userId}`);
            return { success: true };
        } catch (error) {
            console.error('[PersonalizationRepo] Error deleting personalization:', error);
            throw error;
        }
    }

    /**
     * Get personalization as system prompt for AI
     */
    async getAsSystemPrompt() {
        const data = await this.get();

        if (!data.name && !data.role && !data.goals) {
            return null; // No personalization set
        }

        const parts = [];

        if (data.name) {
            parts.push(`The user's name is ${data.name}.`);
        }

        if (data.role && data.company) {
            parts.push(`They work as a ${data.role} at ${data.company}.`);
        } else if (data.role) {
            parts.push(`They work as a ${data.role}.`);
        } else if (data.company) {
            parts.push(`They work at ${data.company}.`);
        }

        if (data.goals) {
            parts.push(`Their goals: ${data.goals}`);
        }

        if (data.interests) {
            parts.push(`Their interests: ${data.interests}`);
        }

        if (data.work_style) {
            parts.push(`Work style: ${data.work_style}`);
        }

        const toneMap = {
            professional: 'Use a professional and formal tone.',
            casual: 'Use a casual and relaxed tone.',
            friendly: 'Use a friendly and warm tone.',
            concise: 'Be concise and to the point.'
        };

        if (data.preferred_tone && toneMap[data.preferred_tone]) {
            parts.push(toneMap[data.preferred_tone]);
        }

        if (data.language && data.language !== 'en') {
            const languageMap = {
                ru: 'Russian',
                es: 'Spanish',
                fr: 'French',
                de: 'German'
            };
            const langName = languageMap[data.language] || data.language;
            parts.push(`Respond in ${langName} when appropriate.`);
        }

        return parts.join(' ');
    }
}

const personalizationRepository = new PersonalizationRepository();
module.exports = personalizationRepository;
