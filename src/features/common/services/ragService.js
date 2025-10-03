const { LocalIndex } = require('vectra');
const path = require('path');
const fs = require('fs').promises;
const { app } = require('electron');
const OpenAI = require('openai');

/**
 * RAG Service for document retrieval using vector embeddings
 * Uses Vectra for local vector storage and OpenAI for embeddings
 */
class RAGService {
    constructor() {
        this.index = null;
        this.initialized = false;
        this.indexPath = null;
        this.openai = null;
        this.embeddingModel = 'text-embedding-3-small'; // Cheaper, faster
        console.log('[RAGService] Service created');
    }

    /**
     * Initialize the vector store
     */
    async initialize(apiKey = null) {
        if (this.initialized) {
            console.log('[RAGService] Already initialized');
            return;
        }

        try {
            // Set up vector index path
            const userDataPath = app.getPath('userData');
            this.indexPath = path.join(userDataPath, 'vector-index');

            // Ensure directory exists
            await fs.mkdir(this.indexPath, { recursive: true });

            // Initialize Vectra local index
            this.index = new LocalIndex(this.indexPath);

            // Check if index exists, if not create it
            if (!await this.index.isIndexCreated()) {
                console.log('[RAGService] Creating new vector index...');
                await this.index.createIndex();
            } else {
                console.log('[RAGService] Loading existing vector index...');
            }

            // Initialize OpenAI client for embeddings (if key provided)
            if (apiKey) {
                this.openai = new OpenAI({ apiKey });
                console.log('[RAGService] OpenAI client initialized');
            }

            this.initialized = true;
            console.log('[RAGService] Initialized successfully');
        } catch (error) {
            console.error('[RAGService] Initialization failed:', error);
            throw error;
        }
    }

    /**
     * Set or update OpenAI API key for embeddings
     */
    setApiKey(apiKey) {
        if (apiKey) {
            this.openai = new OpenAI({ apiKey });
            console.log('[RAGService] OpenAI API key updated');
        }
    }

    /**
     * Generate embeddings for text using OpenAI
     */
    async generateEmbedding(text) {
        if (!this.openai) {
            throw new Error('OpenAI client not initialized. Please provide API key.');
        }

        try {
            const response = await this.openai.embeddings.create({
                model: this.embeddingModel,
                input: text.substring(0, 8000), // Limit to avoid token limits
            });

            return response.data[0].embedding;
        } catch (error) {
            console.error('[RAGService] Embedding generation failed:', error);
            throw error;
        }
    }

    /**
     * Generate simple TF-IDF based embedding (fallback when no API key)
     * This is a lightweight alternative that doesn't require external API
     */
    generateSimpleEmbedding(text) {
        // Simple bag-of-words with TF-IDF-like weighting
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2);

        // Create a fixed-size vector (384 dimensions to match common embedding models)
        const vector = new Array(384).fill(0);

        // Hash words into vector positions
        words.forEach(word => {
            let hash = 0;
            for (let i = 0; i < word.length; i++) {
                hash = ((hash << 5) - hash) + word.charCodeAt(i);
                hash = hash & hash; // Convert to 32bit integer
            }
            const index = Math.abs(hash) % 384;
            vector[index] += 1 / Math.sqrt(words.length); // TF-IDF-like normalization
        });

        // Normalize vector
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
    }

    /**
     * Chunk text into smaller pieces for better retrieval
     * Uses semantic chunking (by paragraphs) with overlap
     */
    chunkText(text, options = {}) {
        const {
            chunkSize = 500,      // Target chunk size in words
            overlap = 100,         // Overlap between chunks in words
            minChunkSize = 50      // Minimum chunk size
        } = options;

        // Split by paragraphs first (better semantic boundaries)
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

        const chunks = [];
        let currentChunk = '';
        let currentWordCount = 0;

        for (const paragraph of paragraphs) {
            const paragraphWords = paragraph.split(/\s+/).length;

            if (currentWordCount + paragraphWords > chunkSize && currentChunk.length > 0) {
                // Save current chunk
                chunks.push(currentChunk.trim());

                // Create overlap by taking last N words
                const words = currentChunk.split(/\s+/);
                const overlapWords = words.slice(-overlap).join(' ');
                currentChunk = overlapWords + '\n\n' + paragraph;
                currentWordCount = overlap + paragraphWords;
            } else {
                currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
                currentWordCount += paragraphWords;
            }
        }

        // Add final chunk
        if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
        }

        // Filter out chunks that are too small
        return chunks.filter(chunk => chunk.split(/\s+/).length >= minChunkSize);
    }

    /**
     * Add document to vector store
     */
    async addDocument(documentId, filename, text, metadata = {}) {
        if (!this.initialized) {
            throw new Error('RAGService not initialized');
        }

        try {
            console.log(`[RAGService] Adding document: ${filename} (ID: ${documentId})`);

            // Chunk the document
            const chunks = this.chunkText(text, {
                chunkSize: 400,
                overlap: 80,
                minChunkSize: 30
            });

            console.log(`[RAGService] Created ${chunks.length} chunks from document`);

            // Generate embeddings and add to index
            let addedCount = 0;
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];

                try {
                    // Try OpenAI embeddings first, fallback to simple
                    let embedding;
                    if (this.openai) {
                        embedding = await this.generateEmbedding(chunk);
                    } else {
                        console.log('[RAGService] Using simple embeddings (no OpenAI key)');
                        embedding = this.generateSimpleEmbedding(chunk);
                    }

                    // Create unique ID for chunk
                    const chunkId = `${documentId}_chunk_${i}`;

                    // Add to vector store
                    await this.index.insertItem({
                        id: chunkId,
                        vector: embedding,
                        metadata: {
                            documentId,
                            filename,
                            chunkIndex: i,
                            totalChunks: chunks.length,
                            text: chunk,
                            ...metadata
                        }
                    });

                    addedCount++;
                } catch (error) {
                    console.error(`[RAGService] Failed to add chunk ${i}:`, error.message);
                }
            }

            console.log(`[RAGService] Successfully added ${addedCount}/${chunks.length} chunks`);
            return { success: true, chunksAdded: addedCount, totalChunks: chunks.length };

        } catch (error) {
            console.error('[RAGService] Error adding document:', error);
            throw error;
        }
    }

    /**
     * Remove document from vector store
     */
    async removeDocument(documentId) {
        if (!this.initialized) {
            throw new Error('RAGService not initialized');
        }

        try {
            console.log(`[RAGService] Removing document: ${documentId}`);

            // Get all items
            const items = await this.index.listItems();

            // Filter items that belong to this document
            const itemsToDelete = items.filter(item =>
                item.metadata && item.metadata.documentId === documentId
            );

            // Delete each item
            for (const item of itemsToDelete) {
                await this.index.deleteItem(item.id);
            }

            console.log(`[RAGService] Removed ${itemsToDelete.length} chunks for document ${documentId}`);
            return { success: true, chunksRemoved: itemsToDelete.length };

        } catch (error) {
            console.error('[RAGService] Error removing document:', error);
            throw error;
        }
    }

    /**
     * Search for relevant chunks based on query
     */
    async search(query, options = {}) {
        if (!this.initialized) {
            throw new Error('RAGService not initialized');
        }

        const {
            topK = 5,              // Number of results to return
            minScore = 0.3,        // Minimum similarity score
            documentIds = null     // Filter by specific document IDs
        } = options;

        try {
            console.log(`[RAGService] Searching for: "${query.substring(0, 50)}..."`);

            // Generate embedding for query
            let queryEmbedding;
            if (this.openai) {
                queryEmbedding = await this.generateEmbedding(query);
            } else {
                queryEmbedding = this.generateSimpleEmbedding(query);
            }

            // Search vector index
            const results = await this.index.queryItems(queryEmbedding, topK * 2); // Get more for filtering

            // Filter results
            let filteredResults = results.filter(result => result.score >= minScore);

            // Filter by document IDs if specified
            if (documentIds && documentIds.length > 0) {
                filteredResults = filteredResults.filter(result =>
                    result.item.metadata && documentIds.includes(result.item.metadata.documentId)
                );
            }

            // Take top K
            const topResults = filteredResults.slice(0, topK);

            console.log(`[RAGService] Found ${topResults.length} relevant chunks (min score: ${minScore})`);

            return topResults.map(result => ({
                text: result.item.metadata.text,
                score: result.score,
                filename: result.item.metadata.filename,
                documentId: result.item.metadata.documentId,
                chunkIndex: result.item.metadata.chunkIndex,
                totalChunks: result.item.metadata.totalChunks
            }));

        } catch (error) {
            console.error('[RAGService] Search failed:', error);
            throw error;
        }
    }

    /**
     * Get statistics about the vector store
     */
    async getStats() {
        if (!this.initialized) {
            return { initialized: false };
        }

        try {
            const items = await this.index.listItems();
            const documents = new Set(items.map(item => item.metadata?.documentId).filter(Boolean));

            return {
                initialized: true,
                totalChunks: items.length,
                totalDocuments: documents.size,
                indexPath: this.indexPath,
                embeddingModel: this.openai ? this.embeddingModel : 'simple-tfidf'
            };
        } catch (error) {
            console.error('[RAGService] Error getting stats:', error);
            return { initialized: true, error: error.message };
        }
    }

    /**
     * Clear entire vector store
     */
    async clear() {
        if (!this.initialized) {
            throw new Error('RAGService not initialized');
        }

        try {
            console.log('[RAGService] Clearing vector store...');
            await this.index.deleteIndex();
            await this.index.createIndex();
            console.log('[RAGService] Vector store cleared');
            return { success: true };
        } catch (error) {
            console.error('[RAGService] Error clearing vector store:', error);
            throw error;
        }
    }
}

// Export singleton instance
const ragService = new RAGService();

module.exports = ragService;
