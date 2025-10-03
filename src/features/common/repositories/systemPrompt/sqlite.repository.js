const { v4: uuidv4 } = require('uuid');
const sqliteClient = require('../../services/sqliteClient');

/**
 * Get the active system prompt for a user
 * @param {string} uid - User ID
 * @returns {object|null} System prompt object or null
 */
function getActivePrompt(uid) {
    const rows = sqliteClient.query(
        'SELECT * FROM system_prompts WHERE uid = ? AND is_active = 1 ORDER BY updated_at DESC LIMIT 1',
        [uid]
    );
    return rows.length > 0 ? rows[0] : null;
}

/**
 * Get all system prompts for a user
 * @param {string} uid - User ID
 * @returns {array} Array of system prompt objects
 */
function getAllPrompts(uid) {
    return sqliteClient.query(
        'SELECT * FROM system_prompts WHERE uid = ? ORDER BY updated_at DESC',
        [uid]
    );
}

/**
 * Save or update a system prompt
 * @param {string} uid - User ID
 * @param {string} prompt - System prompt text
 * @param {boolean} isActive - Whether this prompt is active
 * @returns {object} Created/updated prompt
 */
function savePrompt(uid, prompt, isActive = false) {
    const id = uuidv4();
    const now = Date.now();

    // If setting as active, deactivate all other prompts
    if (isActive) {
        sqliteClient.query(
            'UPDATE system_prompts SET is_active = 0 WHERE uid = ?',
            [uid]
        );
    }

    sqliteClient.query(
        `INSERT INTO system_prompts (id, uid, prompt, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, uid, prompt, isActive ? 1 : 0, now, now]
    );

    return { id, uid, prompt, is_active: isActive, created_at: now, updated_at: now };
}

/**
 * Update an existing system prompt
 * @param {string} id - Prompt ID
 * @param {string} uid - User ID
 * @param {string} prompt - Updated prompt text
 * @param {boolean} isActive - Whether this prompt is active
 * @returns {boolean} Success
 */
function updatePrompt(id, uid, prompt, isActive = false) {
    const now = Date.now();

    // If setting as active, deactivate all other prompts
    if (isActive) {
        sqliteClient.query(
            'UPDATE system_prompts SET is_active = 0 WHERE uid = ? AND id != ?',
            [uid, id]
        );
    }

    sqliteClient.query(
        'UPDATE system_prompts SET prompt = ?, is_active = ?, updated_at = ? WHERE id = ? AND uid = ?',
        [prompt, isActive ? 1 : 0, now, id, uid]
    );

    return true;
}

/**
 * Delete a system prompt
 * @param {string} id - Prompt ID
 * @param {string} uid - User ID
 * @returns {boolean} Success
 */
function deletePrompt(id, uid) {
    sqliteClient.query(
        'DELETE FROM system_prompts WHERE id = ? AND uid = ?',
        [id, uid]
    );
    return true;
}

/**
 * Set a prompt as active
 * @param {string} id - Prompt ID
 * @param {string} uid - User ID
 * @returns {boolean} Success
 */
function setActivePrompt(id, uid) {
    const now = Date.now();

    // Deactivate all prompts
    sqliteClient.query(
        'UPDATE system_prompts SET is_active = 0 WHERE uid = ?',
        [uid]
    );

    // Activate the selected prompt
    sqliteClient.query(
        'UPDATE system_prompts SET is_active = 1, updated_at = ? WHERE id = ? AND uid = ?',
        [now, id, uid]
    );

    return true;
}

module.exports = {
    getActivePrompt,
    getAllPrompts,
    savePrompt,
    updatePrompt,
    deletePrompt,
    setActivePrompt
};
