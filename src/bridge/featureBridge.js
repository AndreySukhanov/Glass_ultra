// src/bridge/featureBridge.js
const { ipcMain, app, BrowserWindow } = require('electron');
const settingsService = require('../features/settings/settingsService');
const authService = require('../features/common/services/authService');
const whisperService = require('../features/common/services/whisperService');
const ollamaService = require('../features/common/services/ollamaService');
const modelStateService = require('../features/common/services/modelStateService');
const shortcutsService = require('../features/shortcuts/shortcutsService');
const presetRepository = require('../features/common/repositories/preset');
const localAIManager = require('../features/common/services/localAIManager');
const askService = require('../features/ask/askService');
const listenService = require('../features/listen/listenService');
const permissionService = require('../features/common/services/permissionService');
const encryptionService = require('../features/common/services/encryptionService');
const systemPromptRepository = require('../features/common/repositories/systemPrompt/sqlite.repository');
const fileAttachmentRepository = require('../features/common/repositories/fileAttachment/sqlite.repository');
const ragService = require('../features/common/services/ragService');

module.exports = {
  // Renderer로부터의 요청을 수신하고 서비스로 전달
  initialize() {
    // Settings Service
    ipcMain.handle('settings:getPresets', async () => await settingsService.getPresets());
    ipcMain.handle('settings:get-auto-update', async () => await settingsService.getAutoUpdateSetting());
    ipcMain.handle('settings:set-auto-update', async (event, isEnabled) => await settingsService.setAutoUpdateSetting(isEnabled));  
    ipcMain.handle('settings:get-model-settings', async () => await settingsService.getModelSettings());
    ipcMain.handle('settings:clear-api-key', async (e, { provider }) => await settingsService.clearApiKey(provider));
    ipcMain.handle('settings:set-selected-model', async (e, { type, modelId }) => await settingsService.setSelectedModel(type, modelId));    

    ipcMain.handle('settings:get-ollama-status', async () => await settingsService.getOllamaStatus());
    ipcMain.handle('settings:ensure-ollama-ready', async () => await settingsService.ensureOllamaReady());
    ipcMain.handle('settings:shutdown-ollama', async () => await settingsService.shutdownOllama());

    // Shortcuts
    ipcMain.handle('settings:getCurrentShortcuts', async () => await shortcutsService.loadKeybinds());
    ipcMain.handle('shortcut:getDefaultShortcuts', async () => await shortcutsService.handleRestoreDefaults());
    ipcMain.handle('shortcut:closeShortcutSettingsWindow', async () => await shortcutsService.closeShortcutSettingsWindow());
    ipcMain.handle('shortcut:openShortcutSettingsWindow', async () => await shortcutsService.openShortcutSettingsWindow());
    ipcMain.handle('shortcut:saveShortcuts', async (event, newKeybinds) => await shortcutsService.handleSaveShortcuts(newKeybinds));
    ipcMain.handle('shortcut:toggleAllWindowsVisibility', async () => await shortcutsService.toggleAllWindowsVisibility());

    // Permissions
    ipcMain.handle('check-system-permissions', async () => await permissionService.checkSystemPermissions());
    ipcMain.handle('request-microphone-permission', async () => await permissionService.requestMicrophonePermission());
    ipcMain.handle('open-system-preferences', async (event, section) => await permissionService.openSystemPreferences(section));
    ipcMain.handle('mark-keychain-completed', async () => await permissionService.markKeychainCompleted());
    ipcMain.handle('check-keychain-completed', async () => await permissionService.checkKeychainCompleted());
    ipcMain.handle('initialize-encryption-key', async () => {
        const userId = authService.getCurrentUserId();
        await encryptionService.initializeKey(userId);
        return { success: true };
    });

    // User/Auth
    ipcMain.handle('get-current-user', () => authService.getCurrentUser());
    ipcMain.handle('start-firebase-auth', async () => await authService.startFirebaseAuthFlow());
    ipcMain.handle('firebase-logout', async () => await authService.signOut());

    // App
    ipcMain.handle('quit-application', () => app.quit());
    ipcMain.handle('open-devtools', () => {
      const settingsWindow = BrowserWindow.getAllWindows().find(win => win.webContents.getURL().includes('settings'));
      if (settingsWindow) {
        settingsWindow.webContents.openDevTools({ mode: 'detach' });
        console.log('[FeatureBridge] DevTools opened for settings window');
      } else {
        // If no settings window, open for first available window
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
          focusedWindow.webContents.openDevTools({ mode: 'detach' });
          console.log('[FeatureBridge] DevTools opened for focused window');
        }
      }
    });

    // Whisper
    ipcMain.handle('whisper:download-model', async (event, modelId) => await whisperService.handleDownloadModel(modelId));
    ipcMain.handle('whisper:get-installed-models', async () => await whisperService.handleGetInstalledModels());
       
    // General
    ipcMain.handle('get-preset-templates', () => presetRepository.getPresetTemplates());
    ipcMain.handle('get-web-url', () => process.env.pickleglass_WEB_URL || 'http://localhost:3000');

    // Ollama
    ipcMain.handle('ollama:get-status', async () => await ollamaService.handleGetStatus());
    ipcMain.handle('ollama:install', async () => await ollamaService.handleInstall());
    ipcMain.handle('ollama:start-service', async () => await ollamaService.handleStartService());
    ipcMain.handle('ollama:ensure-ready', async () => await ollamaService.handleEnsureReady());
    ipcMain.handle('ollama:get-models', async () => await ollamaService.handleGetModels());
    ipcMain.handle('ollama:get-model-suggestions', async () => await ollamaService.handleGetModelSuggestions());
    ipcMain.handle('ollama:pull-model', async (event, modelName) => await ollamaService.handlePullModel(modelName));
    ipcMain.handle('ollama:is-model-installed', async (event, modelName) => await ollamaService.handleIsModelInstalled(modelName));
    ipcMain.handle('ollama:warm-up-model', async (event, modelName) => await ollamaService.handleWarmUpModel(modelName));
    ipcMain.handle('ollama:auto-warm-up', async () => await ollamaService.handleAutoWarmUp());
    ipcMain.handle('ollama:get-warm-up-status', async () => await ollamaService.handleGetWarmUpStatus());
    ipcMain.handle('ollama:shutdown', async (event, force = false) => await ollamaService.handleShutdown(force));

    // Ask
    ipcMain.handle('ask:sendQuestionFromAsk', async (event, userPrompt) => await askService.sendMessage(userPrompt));
    ipcMain.handle('ask:sendQuestionFromSummary', async (event, userPrompt) => await askService.sendMessage(userPrompt));
    ipcMain.handle('ask:toggleAskButton', async () => await askService.toggleAskButton());
    ipcMain.handle('ask:closeAskWindow',  async () => await askService.closeAskWindow());
    
    // Listen
    ipcMain.handle('listen:sendMicAudio', async (event, { data, mimeType }) => await listenService.handleSendMicAudioContent(data, mimeType));
    ipcMain.handle('listen:sendSystemAudio', async (event, { data, mimeType }) => await listenService.sttService.handleSendSystemAudioContent(data, mimeType));
    ipcMain.handle('listen:startMacosSystemAudio', async () => await listenService.handleStartMacosAudio());
    ipcMain.handle('listen:stopMacosSystemAudio', async () => await listenService.handleStopMacosAudio());
    ipcMain.handle('update-google-search-setting', async (event, enabled) => await listenService.handleUpdateGoogleSearchSetting(enabled));
    ipcMain.handle('listen:isSessionActive', async () => await listenService.isSessionActive());
    ipcMain.handle('listen:changeSession', async (event, listenButtonText) => {
      console.log('[FeatureBridge] listen:changeSession from mainheader', listenButtonText);
      try {
        await listenService.handleListenRequest(listenButtonText);
        return { success: true };
      } catch (error) {
        console.error('[FeatureBridge] listen:changeSession failed', error.message);
        return { success: false, error: error.message };
      }
    });

    // ModelStateService
    ipcMain.handle('model:validate-key', async (e, { provider, key }) => await modelStateService.handleValidateKey(provider, key));
    ipcMain.handle('model:get-all-keys', async () => await modelStateService.getAllApiKeys());
    ipcMain.handle('model:set-api-key', async (e, { provider, key }) => await modelStateService.setApiKey(provider, key));
    ipcMain.handle('model:remove-api-key', async (e, provider) => await modelStateService.handleRemoveApiKey(provider));
    ipcMain.handle('model:get-selected-models', async () => await modelStateService.getSelectedModels());
    ipcMain.handle('model:set-selected-model', async (e, { type, modelId }) => await modelStateService.handleSetSelectedModel(type, modelId));
    ipcMain.handle('model:get-available-models', async (e, { type }) => await modelStateService.getAvailableModels(type));
    ipcMain.handle('model:are-providers-configured', async () => await modelStateService.areProvidersConfigured());
    ipcMain.handle('model:get-provider-config', () => modelStateService.getProviderConfig());
    ipcMain.handle('model:re-initialize-state', async () => await modelStateService.initialize());

    // LocalAIManager 이벤트를 모든 윈도우에 브로드캐스트
    localAIManager.on('install-progress', (service, data) => {
      const event = { service, ...data };
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:install-progress', event);
        }
      });
    });
    localAIManager.on('installation-complete', (service) => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:installation-complete', { service });
        }
      });
    });
    localAIManager.on('error', (error) => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:error-occurred', error);
        }
      });
    });
    // Handle error-occurred events from LocalAIManager's error handling
    localAIManager.on('error-occurred', (error) => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:error-occurred', error);
        }
      });
    });
    localAIManager.on('model-ready', (data) => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:model-ready', data);
        }
      });
    });
    localAIManager.on('state-changed', (service, state) => {
      const event = { service, ...state };
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('localai:service-status-changed', event);
        }
      });
    });

    // 주기적 상태 동기화 시작
    localAIManager.startPeriodicSync();

    // ModelStateService 이벤트를 모든 윈도우에 브로드캐스트
    modelStateService.on('state-updated', (state) => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('model-state:updated', state);
        }
      });
    });
    modelStateService.on('settings-updated', () => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('settings-updated');
        }
      });
    });
    modelStateService.on('force-show-apikey-header', () => {
      BrowserWindow.getAllWindows().forEach(win => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('force-show-apikey-header');
        }
      });
    });

    // LocalAI 통합 핸들러 추가
    ipcMain.handle('localai:install', async (event, { service, options }) => {
      return await localAIManager.installService(service, options);
    });
    ipcMain.handle('localai:get-status', async (event, service) => {
      return await localAIManager.getServiceStatus(service);
    });
    ipcMain.handle('localai:start-service', async (event, service) => {
      return await localAIManager.startService(service);
    });
    ipcMain.handle('localai:stop-service', async (event, service) => {
      return await localAIManager.stopService(service);
    });
    ipcMain.handle('localai:install-model', async (event, { service, modelId, options }) => {
      return await localAIManager.installModel(service, modelId, options);
    });
    ipcMain.handle('localai:get-installed-models', async (event, service) => {
      return await localAIManager.getInstalledModels(service);
    });
    ipcMain.handle('localai:run-diagnostics', async (event, service) => {
      return await localAIManager.runDiagnostics(service);
    });
    ipcMain.handle('localai:repair-service', async (event, service) => {
      return await localAIManager.repairService(service);
    });
    
    // 에러 처리 핸들러
    ipcMain.handle('localai:handle-error', async (event, { service, errorType, details }) => {
      return await localAIManager.handleError(service, errorType, details);
    });
    
    // 전체 상태 조회
    ipcMain.handle('localai:get-all-states', async (event) => {
      return await localAIManager.getAllServiceStates();
    });

    // System Prompts
    ipcMain.handle('systemPrompt:getActive', async () => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return systemPromptRepository.getActivePrompt(user.uid);
    });

    ipcMain.handle('systemPrompt:getAll', async () => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return systemPromptRepository.getAllPrompts(user.uid);
    });

    ipcMain.handle('systemPrompt:save', async (event, { prompt, isActive }) => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return systemPromptRepository.savePrompt(user.uid, prompt, isActive);
    });

    ipcMain.handle('systemPrompt:update', async (event, { id, prompt, isActive }) => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return systemPromptRepository.updatePrompt(id, user.uid, prompt, isActive);
    });

    ipcMain.handle('systemPrompt:delete', async (event, { id }) => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return systemPromptRepository.deletePrompt(id, user.uid);
    });

    ipcMain.handle('systemPrompt:setActive', async (event, { id }) => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return systemPromptRepository.setActivePrompt(id, user.uid);
    });

    // File Attachments
    ipcMain.handle('fileAttachment:getActive', async () => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return fileAttachmentRepository.getActiveAttachments(user.uid);
    });

    ipcMain.handle('fileAttachment:getAll', async () => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return fileAttachmentRepository.getAllAttachments(user.uid);
    });

    ipcMain.handle('fileAttachment:add', async (event, { filepath, filename, content, mimetype }) => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return fileAttachmentRepository.addAttachment(user.uid, filepath, filename, content, mimetype);
    });

    // File dialog for selecting files to attach
    ipcMain.handle('fileAttachment:showOpenDialog', async () => {
      const { dialog } = require('electron');
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'Documents', extensions: ['pdf', 'docx', 'txt', 'md', 'csv', 'json', 'xml', 'html', 'htm'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result.canceled) {
        return { canceled: true };
      }

      return {
        canceled: false,
        filePath: result.filePaths[0]
      };
    });

    ipcMain.handle('fileAttachment:extractAndAdd', async (event, { filepath, filename, mimetype }) => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      try {
        const { extractTextFromDocument } = require('../features/common/utils/documentParser');
        const result = await extractTextFromDocument(filepath, mimetype);

        if (!result.text) {
          return { success: false, error: result.error || 'Failed to extract text from document' };
        }

        // Add to database
        const attachment = await fileAttachmentRepository.addAttachment(user.uid, filepath, filename, result.text, mimetype);

        // Initialize RAG service if needed
        if (!ragService.initialized) {
          const currentApiKey = await modelStateService.getApiKey('openai');
          await ragService.initialize(currentApiKey);
        }

        // Add document to RAG vector store
        try {
          await ragService.addDocument(
            attachment.id,
            filename,
            result.text,
            { userId: user.uid, filepath, mimetype }
          );
          console.log('[FeatureBridge] Document added to RAG vector store');
        } catch (ragError) {
          console.warn('[FeatureBridge] Failed to add to RAG (continuing anyway):', ragError.message);
          // Don't fail the whole operation if RAG fails
        }

        return { success: true, error: result.error };
      } catch (error) {
        console.error('[FeatureBridge] Error extracting and adding file:', error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('fileAttachment:toggle', async (event, { id, isActive }) => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return fileAttachmentRepository.toggleAttachment(id, user.uid, isActive);
    });

    ipcMain.handle('fileAttachment:delete', async (event, { id }) => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      // Remove from RAG vector store
      try {
        if (ragService.initialized) {
          await ragService.removeDocument(id);
          console.log('[FeatureBridge] Document removed from RAG vector store');
        }
      } catch (ragError) {
        console.warn('[FeatureBridge] Failed to remove from RAG:', ragError.message);
      }

      return fileAttachmentRepository.deleteAttachment(id, user.uid);
    });

    ipcMain.handle('fileAttachment:getById', async (event, { id }) => {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      return fileAttachmentRepository.getAttachmentById(id, user.uid);
    });

    console.log('[FeatureBridge] Initialized with all feature handlers.');
  },

  // Renderer로 상태를 전송
  sendAskProgress(win, progress) {
    win.webContents.send('feature:ask:progress', progress);
  },
};