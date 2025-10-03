# Security Policy for Glass by Pickle

## Overview

This document outlines security best practices for Glass development and deployment. Following these guidelines helps protect user data and API credentials.

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it privately:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers or use GitHub's private vulnerability reporting
3. Include detailed steps to reproduce the issue
4. Allow reasonable time for a fix before public disclosure

## API Key Management

### ⚠️ Critical Security Rules

**NEVER commit API keys or credentials to git repositories!**

- ❌ Do not hardcode API keys in source code
- ❌ Do not commit `.env` files with real credentials
- ❌ Do not share API keys in screenshots or documentation
- ✅ Always use environment variables for sensitive data
- ✅ Use `.env.example` as a template (committed)
- ✅ Keep actual `.env` files local only (gitignored)

### Proper API Key Usage

**Bad Example:**
```javascript
const GEMINI_API_KEY = 'AIzaSyAyzE3NKgYu...'; // NEVER DO THIS!
```

**Good Example:**
```javascript
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required');
}
```

### Setting Up API Keys

1. Copy the template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual keys:
   ```bash
   GEMINI_API_KEY=your-actual-key-here
   OPENAI_API_KEY=your-actual-key-here
   ```

3. Verify `.env` is in `.gitignore` (it should be by default)

### If You Accidentally Commit a Key

If you accidentally commit an API key:

1. **Immediately revoke/regenerate** the key in the provider's dashboard
2. Remove the key from git history:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch path/to/file" \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push to overwrite history (coordinate with team first):
   ```bash
   git push --force --all
   ```
4. Consider the key compromised permanently

## Firebase Security

### Public Firebase Config

Firebase client-side configuration (apiKey, projectId, etc.) is **not secret** - it's designed to be public. Security is enforced through:

- Firestore Security Rules
- Firebase Authentication
- API restrictions in Google Cloud Console

### Securing Firebase

1. **Enable Firestore Security Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

2. **Restrict API keys in Google Cloud Console:**
   - Limit API keys to specific IPs or referrers
   - Enable only required APIs
   - Set quotas to prevent abuse

3. **Use Firebase App Check** to prevent unauthorized API usage

## Database Security

### Local SQLite Database

The app stores data in `AppData/Roaming/Glass/pickleglass.db`:

- Contains user preferences and cached data
- May contain API keys (encrypted when possible)
- Protected by OS-level file permissions
- Should be excluded from backups containing sensitive data

### Best Practices

- Do not commit database files to git
- Clear sensitive data when uninstalling
- Encrypt sensitive fields when possible
- Use prepared statements to prevent SQL injection

## Electron Security

### Current Security Measures

- Context isolation enabled via preload scripts
- Node integration disabled in renderer processes
- Remote module disabled
- CSP headers for web content

### Recommendations

1. **Keep Electron updated** to latest stable version
2. **Validate all IPC messages** between main and renderer
3. **Sanitize user input** before executing shell commands
4. **Review dependencies** regularly for vulnerabilities:
   ```bash
   npm audit
   npm audit fix
   ```

## Screen Capture & Privacy

Glass captures screen content and audio. Security considerations:

- **Informed Consent**: Users must understand what is being captured
- **Local Processing**: Process data locally when possible
- **Temporary Storage**: Delete captured data after processing
- **Transparency**: Never shows in screen recordings (by design)
- **User Control**: Easy on/off toggle for all capture features

## Data Transmission

When sending data to AI providers:

- Use HTTPS for all API calls
- Minimize data sent (only necessary context)
- Strip sensitive information (passwords, tokens, etc.)
- Respect user privacy settings
- Allow users to review before sending

## Dependencies

### Regular Audits

Run security audits regularly:

```bash
npm audit
npm audit fix
npm outdated
```

### High-Risk Dependencies

Monitor these carefully:
- `electron` - Core framework, security-critical
- `better-sqlite3` - Native database access
- `sharp` - Native image processing
- Any package with native bindings

## Development Best Practices

1. **Code Review**: All PRs should be reviewed for security issues
2. **Least Privilege**: Run with minimum required permissions
3. **Input Validation**: Sanitize all user input
4. **Error Handling**: Don't expose sensitive info in error messages
5. **Logging**: Don't log API keys or user data

## Production Deployment

### Before Release

- [ ] Remove all hardcoded credentials
- [ ] Verify `.gitignore` is comprehensive
- [ ] Run `npm audit` and fix high/critical issues
- [ ] Test with restrictive permissions
- [ ] Review all network requests
- [ ] Verify code signing (macOS/Windows)
- [ ] Test auto-update security

### Distribution

- Sign all releases (prevents tampering)
- Use HTTPS for download links
- Provide checksums (SHA256) for verification
- Keep update server secure

## User Education

Educate users about:

- API key management (they provide their own keys)
- Privacy implications of screen/audio capture
- Data storage locations
- How to revoke access/delete data
- Recognizing phishing attempts

## Checklist for Contributors

Before submitting a PR:

- [ ] No hardcoded credentials
- [ ] No new secrets in code
- [ ] API keys via environment variables
- [ ] Input validation for user data
- [ ] No sensitive data in logs
- [ ] Dependencies are up-to-date
- [ ] Security implications documented

## Resources

- [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

## Version History

- **2024-09-30**: Initial security policy created
- Removed hardcoded API keys from codebase
- Added `.env.example` template
- Enhanced `.gitignore` for credentials

---

**Remember: Security is everyone's responsibility. When in doubt, ask!**
