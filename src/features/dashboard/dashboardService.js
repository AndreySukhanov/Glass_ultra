const { spawn } = require('child_process');
const path = require('path');
const { app, shell } = require('electron');
const dashboardApiServer = require('./dashboardApiServer');

class DashboardService {
    constructor() {
        this.dashboardProcess = null;
        this.dashboardPort = 3001;
        this.dashboardUrl = `http://localhost:${this.dashboardPort}`;
    }

    async startDashboard() {
        console.log('[DashboardService] Starting web dashboard...');

        // Start the API server for dashboard-electron communication
        try {
            await dashboardApiServer.start();
            console.log('[DashboardService] API server started successfully');
        } catch (error) {
            console.error('[DashboardService] Failed to start API server:', error);
            // Continue even if API server fails - dashboard might still be useful
        }

        // Check if dashboard is already running
        if (this.dashboardProcess) {
            console.log('[DashboardService] Dashboard already running, opening in browser');
            this.openDashboardInBrowser();
            return { success: true, url: this.dashboardUrl };
        }

        try {
            const dashboardPath = app.isPackaged
                ? path.join(process.resourcesPath, 'dashboard')
                : path.join(app.getAppPath(), 'dashboard');

            console.log('[DashboardService] Dashboard path:', dashboardPath);

            // Check if dashboard dependencies are installed
            const fs = require('fs');
            const dashboardPackageJson = path.join(dashboardPath, 'package.json');
            const nodeModulesExist = fs.existsSync(path.join(dashboardPath, 'node_modules'));

            if (!nodeModulesExist) {
                console.log('[DashboardService] Installing dashboard dependencies...');

                // Install dependencies first
                await new Promise((resolve, reject) => {
                    const installProcess = spawn('npm', ['install'], {
                        cwd: dashboardPath,
                        shell: true,
                        stdio: 'pipe'
                    });

                    installProcess.on('close', (code) => {
                        if (code === 0) {
                            console.log('[DashboardService] Dependencies installed successfully');
                            resolve();
                        } else {
                            reject(new Error(`npm install failed with code ${code}`));
                        }
                    });

                    installProcess.on('error', (err) => {
                        reject(new Error(`Failed to start npm install: ${err.message}`));
                    });
                });
            }

            // Start the Next.js dev server
            this.dashboardProcess = spawn('npm', ['run', 'dev'], {
                cwd: dashboardPath,
                shell: true,
                stdio: 'pipe',
                env: { ...process.env, PORT: this.dashboardPort.toString() }
            });

            // Handle process output
            this.dashboardProcess.stdout.on('data', (data) => {
                console.log(`[Dashboard stdout]: ${data.toString().trim()}`);
            });

            this.dashboardProcess.stderr.on('data', (data) => {
                console.log(`[Dashboard stderr]: ${data.toString().trim()}`);
            });

            this.dashboardProcess.on('close', (code) => {
                console.log(`[DashboardService] Dashboard process exited with code ${code}`);
                this.dashboardProcess = null;
            });

            this.dashboardProcess.on('error', (err) => {
                console.error('[DashboardService] Failed to start dashboard:', err);
                this.dashboardProcess = null;
            });

            // Wait for the server to start (check for "Ready" message or port availability)
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds for Next.js to start

            console.log('[DashboardService] Opening dashboard in browser...');
            this.openDashboardInBrowser();

            return { success: true, url: this.dashboardUrl };
        } catch (error) {
            console.error('[DashboardService] Error starting dashboard:', error);
            this.dashboardProcess = null;
            return { success: false, error: error.message };
        }
    }

    openDashboardInBrowser() {
        // Open the dashboard URL in the default browser
        shell.openExternal(this.dashboardUrl);
    }

    async stopDashboard() {
        if (this.dashboardProcess) {
            console.log('[DashboardService] Stopping dashboard process...');
            this.dashboardProcess.kill();
            this.dashboardProcess = null;
        }

        // Also stop the API server
        try {
            await dashboardApiServer.stop();
            console.log('[DashboardService] API server stopped');
        } catch (error) {
            console.error('[DashboardService] Error stopping API server:', error);
        }

        return { success: true };
    }

    isDashboardRunning() {
        return !!this.dashboardProcess;
    }

    getDashboardUrl() {
        return this.dashboardUrl;
    }
}

const dashboardService = new DashboardService();
module.exports = dashboardService;
