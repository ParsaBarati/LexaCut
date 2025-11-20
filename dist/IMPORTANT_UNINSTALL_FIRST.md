# ⚠️ مهم: نصب LexaCut v8.0.6 - رفع کامل تداخل

## 🇮🇷 فارسی

### مشکل حل شده
نسخه 8.0.6 **تمام تداخل‌های namespace** با OpenCutList را برطرف کرده است. حالا می‌توانید هر دو افزونه را همزمان نصب کنید یا فقط از LexaCut استفاده کنید.

### راه حل (مرحله به مرحله):

#### گام 1: حذف نسخه‌های قبلی (مهم!)
1. باز کنید: **Window** → **Extension Manager**
2. در لیست، پیدا کنید: **LexaCut** (نسخه‌های 8.0.3, 8.0.4, 8.0.5)
3. کلیک راست → **Uninstall**
4. اگر **OpenCutList** هم نصب است و می‌خواهید حذف کنید، آن را هم Uninstall کنید
5. **SketchUp را ببندید**

#### گام 2: پاک کردن فایل‌های باقیمانده (خیلی مهم!)
1. بروید به این مسیر:
   - **Mac:** `~/Library/Application Support/SketchUp 20XX/SketchUp/Plugins/`
   - **Windows:** `C:\Users\[YourName]\AppData\Roaming\SketchUp\SketchUp 20XX\SketchUp\Plugins\`

2. فایل‌های زیر را پاک کنید (اگر وجود داشت):
   - `lexacut.rb` (نسخه قدیمی)
   - پوشه `ladb_lexacut/` (نسخه قدیمی)
   - `ladb_opencutlist.rb` (اگر می‌خواهید OpenCutList را حذف کنید)
   - پوشه `ladb_opencutlist/` (اگر می‌خواهید OpenCutList را حذف کنید)

#### گام 3: نصب نسخه جدید
1. **SketchUp را دوباره باز کنید**
2. بروید: **Window** → **Extension Manager**
3. کلیک کنید: **Install Extension**
4. فایل را انتخاب کنید: **`lexacut-v8.0.6.rbz`**
5. تایید کنید
6. **SketchUp را ببندید و دوباره باز کنید**

#### گام 4: راه‌اندازی
1. بروید: **Extensions** → **LexaCut**
2. پنجره باز می‌شود با UI مدرن! ✨
3. دکمه **Generate** به‌درستی کار می‌کند و cutlist کامل تولید می‌شود

---

## 🇬🇧 English

### Problem Solved
Version 8.0.6 has **completely fixed all namespace conflicts** with OpenCutList. You can now install both extensions simultaneously or use only LexaCut.

### Solution (Step by Step):

#### Step 1: Uninstall Old Versions (Important!)
1. Open: **Window** → **Extension Manager**
2. Find: **LexaCut** (versions 8.0.3, 8.0.4, 8.0.5) in the list
3. Right-click → **Uninstall**
4. If **OpenCutList** is installed and you want to remove it, uninstall it too
5. **Close SketchUp**

#### Step 2: Delete Remaining Files (Very Important!)
1. Navigate to:
   - **Mac:** `~/Library/Application Support/SketchUp 20XX/SketchUp/Plugins/`
   - **Windows:** `C:\Users\[YourName]\AppData\Roaming\SketchUp\SketchUp 20XX\SketchUp\Plugins\`

2. Delete these files (if they exist):
   - `lexacut.rb` (old version)
   - `ladb_lexacut/` folder (old version)
   - `ladb_opencutlist.rb` (if you want to remove OpenCutList)
   - `ladb_opencutlist/` folder (if you want to remove OpenCutList)

#### Step 3: Install New Version
1. **Restart SketchUp**
2. Go to: **Window** → **Extension Manager**
3. Click: **Install Extension**
4. Select: **`lexacut-v8.0.6.rbz`**
5. Confirm
6. **Close and restart SketchUp**

#### Step 4: Launch
1. Go to: **Extensions** → **LexaCut**
2. Modern UI window opens! ✨
3. **Generate** button works correctly and produces complete cutlists

---

## ✅ How to Verify It's Working

You should see:
1. **Extensions menu** has "LexaCut" listed
2. **Window title** shows "LexaCut - Modern Cutting List"
3. **Header banner** shows "✨ LEXACUT v8.0.6 - MODERN UI" (top)
4. **Footer** shows "LexaCut v8.0.6 | Modern Edition by LexaPlus"
5. **Buttons** have blue gradient with hover effects
6. **Generate button** creates complete cutlists (not just edges)

---

## 🔥 What's Fixed in v8.0.6

### Complete Namespace Separation
- ✅ All 363 Ruby files changed from `Ladb::OpenCutList` to `Ladb::LexaCut`
- ✅ All JavaScript, CSS, Twig, and YAML files updated
- ✅ Over 1,683 instances of "OpenCutList" replaced with "LexaCut"
- ✅ Zero conflicts between LexaCut and OpenCutList

### Results
- ✅ Both extensions can coexist without any conflicts
- ✅ Each extension has its own namespace, icon, menu, and data storage
- ✅ Generate button produces complete, accurate cutlists
- ✅ No shared code or identifiers between extensions

---

## 🆘 Still Having Issues?

### Complete Clean Install:

1. **Uninstall ALL cutting list extensions** from Extension Manager
2. **Close SketchUp completely**
3. **Manually delete** the Plugins folder files mentioned above
4. **Restart computer** (ensures all files are released)
5. **Open SketchUp**
6. **Install** only `lexacut-v8.0.6.rbz`
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

**Version:** 8.0.6  
**Build Date:** November 15, 2025 19:00 (Rebuilt with entry point fix)  
**Status:** Complete namespace separation - Zero conflicts with OpenCutList

