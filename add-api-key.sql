-- Add Gemini API key to the database
-- NEVER commit actual API keys to git! Replace 'YOUR_API_KEY_HERE' with your actual key.
INSERT OR REPLACE INTO provider_settings (user_id, provider, api_key, is_active_llm, is_active_stt, updated_at)
VALUES ('default_user', 'gemini', 'YOUR_API_KEY_HERE', 1, 1, datetime('now'));

-- Verify the key was added
SELECT provider, api_key, is_active_llm, is_active_stt FROM provider_settings WHERE user_id = 'default_user';