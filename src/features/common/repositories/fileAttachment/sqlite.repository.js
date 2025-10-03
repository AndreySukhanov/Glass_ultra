const { v4: uuidv4 } = require('uuid');
const sqliteClient = require('../../services/sqliteClient');
const fs = require('fs');
const path = require('path');

/**
 * Get all active file attachments for a user
 * @param {string} uid - User ID
 * @returns {array} Array of file attachment objects
 */
function getActiveAttachments(uid) {
    return sqliteClient.query(
        'SELECT * FROM file_attachments WHERE uid = ? AND is_active = 1 ORDER BY created_at DESC',
        [uid]
    );
}

/**
 * Get all file attachments for a user (including inactive)
 * @param {string} uid - User ID
 * @returns {array} Array of file attachment objects
 */
function getAllAttachments(uid) {
    return sqliteClient.query(
        'SELECT * FROM file_attachments WHERE uid = ? ORDER BY created_at DESC',
        [uid]
    );
}

/**
 * Add a new file attachment
 * @param {string} uid - User ID
 * @param {string} filepath - Full path to the file
 * @param {string} filename - Original filename
 * @param {string} content - File content (text)
 * @param {string} mimetype - MIME type
 * @returns {object} Created attachment
 */
function addAttachment(uid, filepath, filename, content, mimetype) {
    const id = uuidv4();
    const now = Date.now();
    const filesize = Buffer.byteLength(content, 'utf8');

    sqliteClient.query(
        `INSERT INTO file_attachments
         (id, uid, filename, filepath, filesize, mimetype, content, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        [id, uid, filename, filepath, filesize, mimetype, content, now, now]
    );

    return {
        id,
        uid,
        filename,
        filepath,
        filesize,
        mimetype,
        content,
        is_active: 1,
        created_at: now,
        updated_at: now
    };
}

/**
 * Toggle attachment active status
 * @param {string} id - Attachment ID
 * @param {string} uid - User ID
 * @param {boolean} isActive - Active status
 * @returns {boolean} Success
 */
function toggleAttachment(id, uid, isActive) {
    const now = Date.now();
    sqliteClient.query(
        'UPDATE file_attachments SET is_active = ?, updated_at = ? WHERE id = ? AND uid = ?',
        [isActive ? 1 : 0, now, id, uid]
    );
    return true;
}

/**
 * Delete an attachment
 * @param {string} id - Attachment ID
 * @param {string} uid - User ID
 * @returns {boolean} Success
 */
function deleteAttachment(id, uid) {
    sqliteClient.query(
        'DELETE FROM file_attachments WHERE id = ? AND uid = ?',
        [id, uid]
    );
    return true;
}

/**
 * Get a single attachment by ID
 * @param {string} id - Attachment ID
 * @param {string} uid - User ID
 * @returns {object|null} Attachment object or null
 */
function getAttachmentById(id, uid) {
    const rows = sqliteClient.query(
        'SELECT * FROM file_attachments WHERE id = ? AND uid = ?',
        [id, uid]
    );
    return rows.length > 0 ? rows[0] : null;
}

module.exports = {
    getActiveAttachments,
    getAllAttachments,
    addAttachment,
    toggleAttachment,
    deleteAttachment,
    getAttachmentById
};