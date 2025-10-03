const express = require('express');
const cors = require('cors');
const personalizationRepository = require('../settings/repositories/personalization.repository');

class DashboardApiServer {
    constructor() {
        this.app = null;
        this.server = null;
        this.port = 3002;
    }

    async start() {
        if (this.server) {
            console.log('[DashboardAPI] Server already running');
            return;
        }

        this.app = express();

        // Middleware
        this.app.use(cors({
            origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
            credentials: true
        }));
        this.app.use(express.json());

        // Health check
        this.app.get('/api/health', (req, res) => {
            res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });

        // Personalization endpoints
        this.app.get('/api/electron/personalization', async (req, res) => {
            try {
                console.log('[DashboardAPI] GET personalization');
                const data = await personalizationRepository.get();
                res.json({ success: true, data });
            } catch (error) {
                console.error('[DashboardAPI] Error getting personalization:', error);
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.post('/api/electron/personalization', async (req, res) => {
            try {
                console.log('[DashboardAPI] POST personalization:', req.body);
                const result = await personalizationRepository.save(req.body);
                res.json({ success: true, data: result });
            } catch (error) {
                console.error('[DashboardAPI] Error saving personalization:', error);
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Start server
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, () => {
                console.log(`[DashboardAPI] Server running on http://localhost:${this.port}`);
                resolve();
            }).on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`[DashboardAPI] Port ${this.port} already in use, server might already be running`);
                    resolve(); // Don't treat as error
                } else {
                    console.error('[DashboardAPI] Server error:', err);
                    reject(err);
                }
            });
        });
    }

    async stop() {
        if (this.server) {
            return new Promise((resolve) => {
                this.server.close(() => {
                    console.log('[DashboardAPI] Server stopped');
                    this.server = null;
                    resolve();
                });
            });
        }
    }

    isRunning() {
        return !!this.server;
    }
}

const dashboardApiServer = new DashboardApiServer();
module.exports = dashboardApiServer;
