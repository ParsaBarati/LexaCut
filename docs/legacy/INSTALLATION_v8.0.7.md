# LexaCut v8.0.7 - Installation Guide

**Date:** November 17, 2025  
**File:** `lexacut-v8.0.7.rbz` (2.8 MB)  
**Status:** ✅ Ready to Install

---

## What's New in v8.0.7

### ✅ Changes in This Version

**Removed Blue Gradient Header:**
- Completely removed the blue gradient banner that was at the top of the UI
- Removed extra padding that was added for the banner
- Cleaner, more minimal interface
- All buttons and UI elements are now fully visible and accessible

---

## Installation Instructions (IMPORTANT - Please Read!)

### ⚠️ Step 1: Remove Previous Versions (CRITICAL!)

**Before installing this version, you MUST:**

1. **Close SketchUp** (completely quit, not just close window)

2. **Delete old plugin files:**
   ```
   Path: ~/Library/Application Support/SketchUp 2025/SketchUp/Plugins/
   
   Files to delete:
   ✗ lexacut.rb
   ✗ ladb_lexacut/ (entire folder)
   ```

3. **Check for OpenCutList (if you want LexaCut to be independent):**
   ```
   Path: ~/Library/Application Support/SketchUp 2025/SketchUp/Plugins/
   
   OpenCutList files (optional to delete):
   - ladb_opencutlist.rb
   - ladb_opencutlist/ (folder)
   ```

4. **To show Library in Finder:**
   - In Finder, menu **Go** → hold **Option** key → select **Library**
   - Or `Command + Shift + G` and enter: `~/Library/Application Support/SketchUp 2025/SketchUp/Plugins/`

### ✅ Step 2: Install New Version

1. **Open SketchUp**

2. **Go to Extensions menu:**
   - Top menu: **Window** → **Extension Manager**

3. **Click Install Extension:**
   - Click **Install Extension** button (bottom left)
   - Select `lexacut-v8.0.7.rbz` file
   - Click **Yes** if security warning appears

4. **Gatekeeper Issue on macOS (if installation fails):**
   ```bash
   sudo xattr -rd com.apple.quarantine ~/Library/Application\ Support/SketchUp\ 2025/SketchUp/Plugins/lexacut.rb
   sudo xattr -rd com.apple.quarantine ~/Library/Application\ Support/SketchUp\ 2025/SketchUp/Plugins/ladb_lexacut/
   ```

5. **Restart SketchUp** (completely quit and reopen)

### ✅ Step 3: Launch

1. **After opening SketchUp:**
   - Click **Extensions** → **LexaCut**

2. **If OpenCutList is also installed:**
   - Both will appear independently in the menu
   - Each has its own separate interface
   - No conflicts between them

---

## Verify Correct Installation

### What You Should See: ✅

1. In **Extension Manager**:
   - Extension name: **LexaCut**
   - Version: **8.0.7**
   - Creator: **LexaPlus (Modern UI edition based on OpenCutList)**

2. In **Extensions menu**:
   - **LexaCut** option exists (with new icon)
   - When clicked, modern UI opens

3. In **User Interface**:
   - Tab title: **LexaCut - Modern Cutting List**
   - Modern, clean design with blue and purple colors
   - **NO blue banner at the top** ✅
   - All buttons display correctly
   - Footer: `LexaCut v8.0.7 | Modern Edition by LexaPlus`

### Possible Issues and Solutions:

#### ❌ Issue: "I'm currently resting" message
**Solution:** Completely quit SketchUp and reopen

#### ❌ Issue: Won't install / Shows error
**Solution:**
1. Delete old files as per Step 1
2. Run Gatekeeper command (above)
3. Restart SketchUp

#### ❌ Issue: OpenCutList and LexaCut conflict
**Solution:**
1. This issue is completely fixed in v8.0.7
2. If still having issues, open Ruby Console:
   - **Window** → **Ruby Console**
   - Take screenshot of errors and send

#### ❌ Issue: Buttons hidden behind blue banner
**Solution:**
- This issue is fixed in v8.0.7 (blue banner completely removed)
- If still seeing it, clear browser cache and restart SketchUp

---

## Technical Information

### Installed Files:
```
~/Library/Application Support/SketchUp 2025/SketchUp/Plugins/
├── lexacut.rb (main entry point)
└── ladb_lexacut/ (plugin folder)
    ├── css/      (modern styles)
    ├── html/     (UI templates)
    ├── js/       (application logic)
    ├── ruby/     (plugin core - 364 files)
    └── ...
```

### Namespace:
- LexaCut: `module Ladb::LexaCut`
- OpenCutList: `module Ladb::OpenCutList`
- **No conflicts** ✅

---

## Support

If you encounter issues, please provide:

1. **SketchUp version:**
   - **Help** → **About SketchUp**

2. **macOS version:**
   - **Apple Menu** → **About This Mac**

3. **Ruby Console errors:**
   - **Window** → **Ruby Console**
   - Screenshot of errors

4. **Screenshot of issue**

---

**Delivered:** November 17, 2025  
**Version:** 8.0.7  
**File Size:** 2.8 MB  
**Status:** ✅ Tested and ready to use

---

## Changes from Previous Version (8.0.6):

✅ Completely removed blue gradient banner from top  
✅ Cleaner, more minimal interface  
✅ Easier access to all buttons  
✅ Overall UX improvement

---

**Good luck! 🎯**


