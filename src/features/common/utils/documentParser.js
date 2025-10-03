const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract text from various document formats
 * @param {string} filePath - Path to the file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<{text: string, error?: string}>}
 */
async function extractTextFromDocument(filePath, mimeType) {
    try {
        const ext = path.extname(filePath).toLowerCase();

        // PDF files
        if (mimeType === 'application/pdf' || ext === '.pdf') {
            return await extractTextFromPDF(filePath);
        }

        // Word documents (.docx)
        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === '.docx') {
            return await extractTextFromDOCX(filePath);
        }

        // Older Word documents (.doc)
        if (mimeType === 'application/msword' || ext === '.doc') {
            return {
                text: '',
                error: '.doc format is not fully supported. Please convert to .docx or PDF for better results.'
            };
        }

        // Plain text files
        if (mimeType.startsWith('text/') || ['.txt', '.md', '.csv', '.json', '.xml', '.html'].includes(ext)) {
            return await extractTextFromPlainText(filePath);
        }

        // Fallback: try to read as plain text
        console.log(`[DocumentParser] Unknown file type: ${mimeType}, attempting to read as text`);
        return await extractTextFromPlainText(filePath);

    } catch (error) {
        console.error('[DocumentParser] Error extracting text:', error);
        return {
            text: '',
            error: `Failed to extract text: ${error.message}`
        };
    }
}

/**
 * Extract text from PDF file
 */
async function extractTextFromPDF(filePath) {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const pdfData = await pdfParse(dataBuffer, {
            // Optimize for text extraction
            max: 0, // Extract all pages
        });

        let text = pdfData.text.trim();

        // Add metadata if available
        const metadata = [];
        if (pdfData.info?.Title) metadata.push(`Title: ${pdfData.info.Title}`);
        if (pdfData.info?.Author) metadata.push(`Author: ${pdfData.info.Author}`);
        if (pdfData.info?.Subject) metadata.push(`Subject: ${pdfData.info.Subject}`);
        if (pdfData.numpages) metadata.push(`Pages: ${pdfData.numpages}`);

        if (metadata.length > 0) {
            text = `=== PDF Metadata ===\n${metadata.join('\n')}\n\n=== Content ===\n${text}`;
        }

        return {
            text: text || 'No text content could be extracted from this PDF.',
            error: text ? undefined : 'PDF appears to be empty or image-based (OCR not supported)'
        };
    } catch (error) {
        console.error('[DocumentParser] PDF parsing error:', error);
        return {
            text: '',
            error: `PDF parsing failed: ${error.message}. The PDF might be corrupted or password-protected.`
        };
    }
}

/**
 * Extract text from DOCX file
 */
async function extractTextFromDOCX(filePath) {
    try {
        const result = await mammoth.extractRawText({ path: filePath });

        let text = result.value.trim();

        // Log warnings if any
        if (result.messages && result.messages.length > 0) {
            const warnings = result.messages
                .filter(m => m.type === 'warning')
                .map(m => m.message);
            if (warnings.length > 0) {
                console.warn('[DocumentParser] DOCX parsing warnings:', warnings);
            }
        }

        return {
            text: text || 'No text content could be extracted from this DOCX file.',
            error: text ? undefined : 'Document appears to be empty'
        };
    } catch (error) {
        console.error('[DocumentParser] DOCX parsing error:', error);
        return {
            text: '',
            error: `DOCX parsing failed: ${error.message}. The file might be corrupted.`
        };
    }
}

/**
 * Extract text from plain text file
 */
async function extractTextFromPlainText(filePath) {
    try {
        const text = await fs.readFile(filePath, 'utf-8');
        return {
            text: text.trim() || 'File is empty.',
            error: undefined
        };
    } catch (error) {
        // Try with different encoding if UTF-8 fails
        try {
            const text = await fs.readFile(filePath, 'latin1');
            return {
                text: text.trim() || 'File is empty.',
                error: 'File encoding might not be UTF-8, text may contain errors.'
            };
        } catch (fallbackError) {
            console.error('[DocumentParser] Text file reading error:', error);
            return {
                text: '',
                error: `Failed to read file: ${error.message}`
            };
        }
    }
}

/**
 * Get supported file extensions
 */
function getSupportedExtensions() {
    return [
        '.pdf',
        '.docx',
        '.txt',
        '.md',
        '.csv',
        '.json',
        '.xml',
        '.html',
        '.htm'
    ];
}

/**
 * Get accept attribute for file input
 */
function getFileInputAccept() {
    return '.pdf,.docx,.txt,.md,.csv,.json,.xml,.html,.htm';
}

module.exports = {
    extractTextFromDocument,
    getSupportedExtensions,
    getFileInputAccept
};
