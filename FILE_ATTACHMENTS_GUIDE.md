# 📎 File Attachments Guide

## Overview

Glass now supports **intelligent document extraction** for PDF and DOCX files, allowing AI to properly read and understand your resume, documents, and other files.

## ✨ What's New

### Before (v0.2.4)
- ❌ Only plain text files worked
- ❌ PDF/DOCX files failed silently
- ❌ Poor text extraction
- ❌ No error feedback

### After (Latest)
- ✅ Full PDF support with metadata extraction
- ✅ DOCX/Word document support
- ✅ Smart text extraction
- ✅ Clear error messages
- ✅ Multiple file format support

## 📄 Supported File Types

| Format | Extension | Notes |
|--------|-----------|-------|
| PDF | `.pdf` | Full support including metadata |
| Word (Modern) | `.docx` | Full support |
| Plain Text | `.txt` | Full support |
| Markdown | `.md` | Full support |
| CSV | `.csv` | Full support |
| JSON | `.json` | Full support |
| XML | `.xml` | Full support |
| HTML | `.html`, `.htm` | Full support |
| Word (Legacy) | `.doc` | ⚠️ Limited - convert to .docx or PDF |

## 🚀 How to Use

### 1. Open Settings
- Press `Ctrl/Cmd + \` to show the Glass window
- Click the Settings icon

### 2. Add File Attachment
- Scroll to "File Attachments" section
- Click "+ Add File" button
- Select your resume or document (PDF, DOCX, etc.)
- Wait for extraction to complete

### 3. Manage Attachments
- **Toggle Active/Inactive**: Click the `✓` or `○` button
  - `✓` = Active (AI will see this file)
  - `○` = Inactive (AI won't see this file)
- **Delete**: Click the `🗑️` button

### 4. Use with AI
- Active files are automatically included in all AI requests
- AI can read and reference your resume/documents
- Perfect for job applications, document analysis, etc.

## 💡 Best Practices

### Resume/CV Upload
```
✅ DO:
- Use PDF or DOCX format
- Ensure text is selectable (not scanned image)
- Keep file size reasonable (<10MB)
- Use clear formatting

❌ DON'T:
- Upload scanned images (OCR not supported yet)
- Use password-protected PDFs
- Upload corrupted files
```

### Document Quality
- **Good**: Text-based PDFs from Word, LaTeX, Google Docs
- **Okay**: Simple scanned documents with clean text
- **Bad**: Low-quality scans, handwritten documents, image-only PDFs

### Performance Tips
- Only keep active files you're currently using
- Deactivate files when not needed
- Delete old attachments to keep database clean
- Limit to 5-10 active files for best performance

## 🔧 Technical Details

### Text Extraction
- **PDF**: Uses `pdf-parse` library
  - Extracts all pages
  - Includes metadata (title, author, pages)
  - Works with most PDF versions

- **DOCX**: Uses `mammoth` library
  - Extracts raw text content
  - Preserves paragraph structure
  - Handles complex formatting

### Storage
- Extracted text is stored in SQLite database
- Located at: `AppData/Roaming/Glass/pickleglass.db`
- Original files are NOT stored, only extracted text
- File path is saved for reference

### Processing
```javascript
File Upload → Extract Text → Save to DB → Include in AI Context
```

## ⚠️ Troubleshooting

### "Failed to extract text"
**Causes:**
- File is corrupted
- PDF is password-protected
- File is image-only (no text layer)

**Solutions:**
- Try re-saving the file
- Remove password protection
- Convert to text-based PDF

### "Document appears to be empty"
**Causes:**
- PDF is scanned image without OCR
- Document truly has no text
- Unsupported encoding

**Solutions:**
- Use OCR software to convert image to text
- Try different file format
- Check if file opens correctly in other apps

### "File type not supported"
**Causes:**
- Unsupported file extension
- Incorrect file type detection

**Solutions:**
- Convert to supported format (PDF, DOCX, TXT)
- Check file extension is correct
- Try renaming file

## 📊 Examples

### Resume Upload Example
```
1. Open Settings → File Attachments
2. Click "+ Add File"
3. Select "John_Doe_Resume.pdf"
4. ✅ Status shows "Active"
5. Ask AI: "What is my work experience?"
   → AI reads and summarizes your resume!
```

### Job Description Analysis
```
1. Upload your resume (resume.pdf) - Active ✓
2. Upload job description (job.txt) - Active ✓
3. Ask: "How well does my resume match this job?"
   → AI compares both documents!
```

### Document Comparison
```
1. Upload "contract_v1.docx" - Active ✓
2. Upload "contract_v2.docx" - Active ✓
3. Ask: "What are the differences between these contracts?"
   → AI analyzes both versions!
```

## 🔒 Privacy & Security

- Files are processed **locally** on your machine
- Only extracted text is stored, not the original file
- Text is sent to AI provider when you ask questions
- You can delete attachments anytime
- Database is stored locally in your AppData folder

## 🆕 Future Enhancements

Planned features:
- [ ] OCR support for scanned documents
- [ ] Excel/spreadsheet support (.xlsx)
- [ ] PowerPoint support (.pptx)
- [ ] Image file support with vision models
- [ ] File preview in UI
- [ ] Drag & drop file upload
- [ ] Batch file upload
- [ ] File size indicators
- [ ] Search through attachments

## 📝 Changelog

### v0.2.5 (Latest)
- ✅ Added PDF text extraction with metadata
- ✅ Added DOCX/Word document support
- ✅ Improved error handling and user feedback
- ✅ Added file type validation
- ✅ Better text extraction quality

### v0.2.4 (Previous)
- Basic file attachment support
- Text files only

## 🐛 Known Issues

1. **Large PDFs (>50MB)** may take longer to process
2. **.doc (old Word format)** not fully supported - use .docx instead
3. **Scanned PDFs** without text layer won't extract (OCR coming soon)
4. **Complex tables** in PDF may not preserve formatting
5. **Non-English text** may have encoding issues in some cases

## 💬 Support

If you encounter issues:
1. Check console logs (DevTools → Console)
2. Verify file is not corrupted
3. Try converting to different format
4. Report issue on GitHub with:
   - File type/extension
   - File size
   - Error message from console
   - Steps to reproduce

## 🎯 Tips for Best Results

1. **Resume/CV**: Use PDF or DOCX from Word/Google Docs
2. **Job Descriptions**: Plain text (.txt) or copy-paste works best
3. **Contracts**: DOCX preferred for best formatting preservation
4. **Reports**: PDF works well for final documents
5. **Data**: Use CSV for structured data

---

**Happy document uploading! 🚀**
