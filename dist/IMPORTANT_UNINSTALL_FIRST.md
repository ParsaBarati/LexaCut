# ⚠️ مهم: ابتدا نسخه قبلی را حذف کنید

## 🇮🇷 فارسی

### مشکل
اگر نسخه قبلی LexaCut (v7.1.0) را نصب کرده‌اید، باید **ابتدا آن را حذف کنید**.

### راه حل (مرحله به مرحله):

#### گام 1: حذف نسخه قبلی
1. باز کنید: **Window** → **Extension Manager**
2. در لیست، پیدا کنید: **LexaCut** یا **OpenCutList** (ممکن است نام قبلی داشته باشد)
3. کلیک راست → **Uninstall**
4. تایید کنید
5. **SketchUp را ببندید**

#### گام 2: پاک کردن فایل‌های باقیمانده (مهم!)
1. بروید به این مسیر:
   - **Windows:** `C:\Users\[YourName]\AppData\Roaming\SketchUp\SketchUp 20XX\SketchUp\Plugins\`
   - **Mac:** `~/Library/Application Support/SketchUp 20XX/SketchUp/Plugins/`

2. فایل‌های زیر را پاک کنید (اگر وجود داشت):
   - `ladb_opencutlist.rb`
   - پوشه `ladb_opencutlist/`
   - `lexacut.rb` (نسخه قدیمی)
   - پوشه `ladb_lexacut/` (نسخه قدیمی)

#### گام 3: نصب نسخه جدید
1. **SketchUp را دوباره باز کنید**
2. بروید: **Window** → **Extension Manager**
3. کلیک کنید: **Install Extension**
4. فایل را انتخاب کنید: **`lexacut-v8.0.1.rbz`**
5. تایید کنید
6. **SketchUp را ببندید و دوباره باز کنید**

#### گام 4: راه‌اندازی
1. بروید: **Extensions** → **LexaCut**
2. پنجره باز می‌شود با UI مدرن! ✨

---

## 🇬🇧 English

### Problem
If you installed the previous LexaCut version (v7.1.0), you must **uninstall it first**.

### Solution (Step by Step):

#### Step 1: Uninstall Old Version
1. Open: **Window** → **Extension Manager**
2. Find: **LexaCut** or **OpenCutList** in the list
3. Right-click → **Uninstall**
4. Confirm
5. **Close SketchUp**

#### Step 2: Delete Remaining Files (Important!)
1. Navigate to:
   - **Windows:** `C:\Users\[YourName]\AppData\Roaming\SketchUp\SketchUp 20XX\SketchUp\Plugins\`
   - **Mac:** `~/Library/Application Support/SketchUp 20XX/SketchUp/Plugins/`

2. Delete these files (if they exist):
   - `ladb_opencutlist.rb`
   - `ladb_opencutlist/` folder
   - `lexacut.rb` (old version)
   - `ladb_lexacut/` folder (old version)

#### Step 3: Install New Version
1. **Restart SketchUp**
2. Go to: **Window** → **Extension Manager**
3. Click: **Install Extension**
4. Select: **`lexacut-v8.0.0.rbz`**
5. Confirm
6. **Close and restart SketchUp**

#### Step 4: Launch
1. Go to: **Extensions** → **LexaCut**
2. Modern UI window opens! ✨

---

## ✅ How to Verify It's Working

You should see:
1. **Extensions menu** has "LexaCut" listed
2. **Window title** shows "LexaCut - Modern Cutting List"
3. **Header badge** shows "✨ LexaCut Modern UI" (top-right)
4. **Footer** shows "LexaCut v8.0.1 | Modern Edition"
5. **Buttons** have blue gradient with hover effects

If you don't see these, the old version is still interfering.

---

## 🆘 Still Having Issues?

### Complete Clean Install:

1. **Uninstall ALL cutting list extensions** from Extension Manager
2. **Close SketchUp completely**
3. **Manually delete** the Plugins folder files mentioned above
4. **Restart computer** (ensures all files are released)
5. **Open SketchUp**
6. **Install** only `lexacut-v8.0.0.rbz`
7. **Restart SketchUp**
8. **Try Extensions → LexaCut**

---

## 📧 If Still Not Working

Contact: parsa@lexaplus.com

Include:
- SketchUp version
- Operating system
- Screenshot of Extensions menu
- Any error messages in Ruby Console (Window → Ruby Console)

---

**Version:** 8.0.1  
**Build Date:** November 8, 2025 11:08 AM  
**Status:** Fixed - Separate extension with unique data storage

