# 🤖 Cursor + Claude: OpenCutList → LexaCut Refactor Workflow

> **Purpose:** Step-by-step instructions for Claude to analyze, map, and prepare the OpenCutList codebase for a complete refactor into LexaCutList.

---

## 📋 Mission Statement

You are Claude, working inside Cursor to help refactor **OpenCutList** (a SketchUp Ruby extension) into **LexaCutList** — a modernized, AI-powered cutting list optimizer with Vue 3 + Tailwind UI.

Your job is to:
1. **Understand** the existing architecture completely
2. **Map** all modules, classes, and dependencies
3. **Validate** the architecture against the actual codebase
4. **Prepare** a refactor plan with clear steps
5. **Execute** the refactor systematically (when asked)

---

## 🎯 Phase 1: Architecture Analysis (START HERE)

### Step 1.1: Read the Architecture Overview
Read the complete architecture documentation:

```
/Volumes/Work/Code/Startups/OpenCutList/docs/ARCHITECTURE_OVERVIEW.md
```

**Task:** Confirm you understand:
- The 8 core architectural layers
- The Ruby ↔ JS data flow
- The entry point sequence
- The modernization goals

**Output:** Summarize the architecture in 3-4 sentences.

---

### Step 1.2: Identify the Entry Point
Read the main entry file:

```
/Volumes/Work/Code/Startups/OpenCutList/open_cutlist.rb
```

**Task:** 
- Find the `SketchupExtension` registration
- Identify the namespace (should be `OpenCutList`)
- Find what file gets loaded next (usually `src/ruby/plugin.rb`)

**Output:** List the complete load chain from `open_cutlist.rb` → final UI launch.

---

### Step 1.3: Map All Ruby Modules
Explore the Ruby source directory:

```
/Volumes/Work/Code/Startups/OpenCutList/src/ruby/
```

**Task:**
- List all subdirectories (`app/`, `core/`, `export/`, etc.)
- For each subdirectory, list all `.rb` files
- Identify the main classes/modules in each file (don't read full contents yet, just search for `class` and `module` definitions)

**Output:** Create a hierarchical tree structure showing:
```
src/ruby/
├── app/
│   ├── file1.rb (Module::Class1, Module::Class2)
│   └── file2.rb (Module::Class3)
├── core/
│   └── ...
└── export/
    └── ...
```

---

### Step 1.4: Map All JavaScript/Vue Components
Explore the frontend directory:

```
/Volumes/Work/Code/Startups/OpenCutList/src/js/
```

**Task:**
- Find the main Vue app file (likely `app.js` or `main.js`)
- List all Vue components in `/src/js/components/` (if exists)
- Find the HTML entry point (`/src/html/dialog.html` or similar)
- Identify the Vue version being used (check for Vue.component vs createApp)

**Output:** List all Vue components with their file paths.

---

### Step 1.5: Analyze the Ruby ↔ JS Bridge
Search for the communication bridge between Ruby and JavaScript:

**Task:**
- Search for `UI::HtmlDialog` or `UI::WebDialog` in Ruby files
- Find how Ruby sends data to JS (look for `execute_script` or similar)
- Find how JS calls Ruby (look for `window.sketchup.call` or `sketchup.execute`)
- List all command handlers/callbacks

**Output:** Document the bridge API:
```
Ruby → JS:
  - method1: sends data to JS
  - method2: triggers UI update

JS → Ruby:
  - command1: generates cutlist
  - command2: exports data
```

---

## 🎯 Phase 2: Generate Module Map

### Step 2.1: Create Complete Module Map
Based on your analysis, create a comprehensive module map file:

**File:** `/Volumes/Work/Code/Startups/OpenCutList/docs/MODULE_MAP.md`

**Structure:**
```markdown
# OpenCutList Module Map

## Ruby Modules

### Namespace: OpenCutList

#### Core Domain Models
- **File:** src/ruby/core/part.rb
  - **Class:** OpenCutList::Part
  - **Purpose:** Represents a single part/component
  - **Key Methods:** ...
  - **Dependencies:** ...

... (continue for all files)

## JavaScript/Vue Components

### Main App
- **File:** src/js/app.js
- **Purpose:** Bootstrap Vue application
- **Dependencies:** Vue 2.x, ...

... (continue for all components)

## Data Flow Diagram

(Text-based diagram showing how data flows from SketchUp → Ruby → JS → Vue)
```

**Task:** Generate this file with ALL discovered modules, classes, and components.

---

### Step 2.2: Identify External Dependencies
Search for dependency declarations:

**Ruby:**
- Look for `require` and `require_relative` statements
- Check for any `Gemfile` or bundled gems

**JavaScript:**
- Look for `import` statements
- Check for `package.json` (if exists)
- Identify Vue version, Bootstrap version, etc.

**Output:** List all external dependencies in `MODULE_MAP.md` under a "Dependencies" section.

---

### Step 2.3: Validate Architecture Against Reality
Compare the architecture described in `ARCHITECTURE_OVERVIEW.md` with what you actually found:

**Task:**
- Does the actual codebase match the described structure?
- Are there files/directories not mentioned in the overview?
- Are there discrepancies in how data flows?

**Output:** Create a "Validation Report" section in `MODULE_MAP.md`:
```markdown
## Validation Report

### ✅ Confirmed Structures
- Entry point at open_cutlist.rb ✓
- Ruby source in src/ruby/ ✓
- ...

### ⚠️ Discrepancies Found
- Architecture mentions src/ruby/config/ but actual path is src/ruby/settings/
- ...

### ❓ Unknown/Unclear Areas
- How are user preferences persisted?
- ...
```

---

## 🎯 Phase 3: Refactor Planning

### Step 3.1: Identify Refactor Scope
Based on the module map, identify what needs to change:

**Namespace Changes:**
- All `OpenCutList` → `LexaCut`
- File renaming: `open_cutlist.rb` → `lexa_cutlist.rb`

**UI Modernization:**
- Vue 2 → Vue 3
- Bootstrap → TailwindCSS
- Create new `/src/frontend/` directory structure

**New Features:**
- AI optimization module at `src/ruby/ai/`
- Enhanced export system
- RTL language support

**Output:** Create `/Volumes/Work/Code/Startups/OpenCutList/docs/REFACTOR_PLAN.md` with:
```markdown
# LexaCut Refactor Plan

## Phase 1: Namespace Migration
- [ ] Rename main file
- [ ] Update all namespace references
- [ ] Update manifest.json
- [ ] Test in SketchUp

## Phase 2: UI Modernization
- [ ] Setup Vue 3 + Vite project in src/frontend/
- [ ] Install TailwindCSS
- [ ] Migrate components one by one
- [ ] Test bridge communication

... (continue for all phases)
```

---

### Step 3.2: Create Dependency Graph
Visualize module dependencies:

**Task:** In `MODULE_MAP.md`, add a section showing which modules depend on which:

```markdown
## Dependency Graph

```
Part → Material
CutListManager → Part, Material
AppController → CutListManager
UIBridge → AppController
```
```

This helps identify the order of refactoring (start with leaves, work up to roots).

---

### Step 3.3: Identify Risky Areas
Flag areas that need extra care during refactor:

**Task:** In `REFACTOR_PLAN.md`, add a "Risk Assessment" section:
```markdown
## Risk Assessment

### High Risk (requires careful testing)
- UIBridge communication (any change breaks Ruby ↔ JS)
- SketchUp API calls (must maintain compatibility)

### Medium Risk
- Export system (changing formats could break user workflows)

### Low Risk
- UI components (isolated, can be replaced)
```

---

## 🎯 Phase 4: Preparation for Execution

### Step 4.1: Create Test Checklist
Before any code changes, create a test plan:

**File:** `/Volumes/Work/Code/Startups/OpenCutList/docs/TEST_CHECKLIST.md`

**Content:**
```markdown
# LexaCut Testing Checklist

## Before Refactor
- [ ] Can load current OpenCutList in SketchUp?
- [ ] Can generate a cutlist?
- [ ] Can export to CSV?
- [ ] Can export to PDF?

## After Namespace Change
- [ ] Extension loads with new name?
- [ ] All menus work?
- [ ] ...

## After UI Migration
- [ ] Vue 3 app loads in HtmlDialog?
- [ ] Data from Ruby displays correctly?
- [ ] ...
```

---

### Step 4.2: Setup Refactor Branch
Recommend creating a Git branch:

**Output:** Suggest to user:
```bash
git checkout -b feature/lexacut-refactor
git push -u origin feature/lexacut-refactor
```

---

### Step 4.3: Backup Current Working Version
Recommend creating a snapshot:

**Output:** Suggest to user:
```bash
# Create a tagged backup
git tag -a v1.0-opencutlist-backup -m "Backup before LexaCut refactor"
git push origin v1.0-opencutlist-backup

# Or create a ZIP backup
cd /Volumes/Work/Code/Startups/
zip -r OpenCutList-backup-$(date +%Y%m%d).zip OpenCutList/
```

---

## 🎯 Phase 5: Ready for Execution

### Step 5.1: Summary Report
After completing all analysis phases, create a summary:

**File:** `/Volumes/Work/Code/Startups/OpenCutList/docs/ANALYSIS_SUMMARY.md`

**Content:**
```markdown
# OpenCutList → LexaCut: Analysis Complete

## Codebase Statistics
- Total Ruby files: X
- Total JS files: Y
- Total Vue components: Z
- Lines of Ruby code: ~N
- Lines of JS code: ~M

## Architecture Validation
✅ Architecture matches reality: [Yes/No]
✅ All dependencies identified: [Yes/No]
✅ Bridge communication understood: [Yes/No]

## Refactor Readiness
- Module map: ✅ Complete
- Refactor plan: ✅ Created
- Test checklist: ✅ Prepared
- Risk assessment: ✅ Done

## Recommended Next Steps
1. Review all generated documentation
2. Create refactor branch
3. Start with Phase 1: Namespace Migration
4. Test after each phase

## Questions for Human Review
- [List any unclear areas]
- [List any decisions needed]
```

---

### Step 5.2: Wait for Human Approval
**Output:** 

```
✅ Analysis Complete!

I've generated the following documentation:
- MODULE_MAP.md (complete module inventory)
- REFACTOR_PLAN.md (step-by-step refactor roadmap)
- TEST_CHECKLIST.md (testing strategy)
- ANALYSIS_SUMMARY.md (executive summary)

📊 Next Steps:
1. Review the generated docs
2. Ask me any questions about the codebase
3. When ready, say: "Start Phase 1: Namespace Migration"

⚠️ Important:
- Create a git branch first
- Have SketchUp closed during refactor
- Test after each major change

Ready to proceed? 🚀
```

---

## 🎯 Execution Phases (After Approval)

### Phase 1: Namespace Migration
*[Detailed steps for renaming OpenCutList → LexaCut]*

### Phase 2: UI Modernization
*[Detailed steps for Vue 3 + Tailwind setup]*

### Phase 3: AI Integration
*[Detailed steps for adding CognitiveCut engine]*

### Phase 4: Testing & Packaging
*[Detailed steps for building .rbz and testing]*

---

## 📌 Important Notes for Claude

1. **Don't skip steps** — complete each phase fully before moving to next
2. **Always validate** — after reading a file, confirm what you found
3. **Ask if unclear** — if something doesn't match the architecture doc, ask the human
4. **Document everything** — create markdown files for all findings
5. **Test frequently** — suggest testing after each major change
6. **Preserve functionality** — never break existing features during refactor

---

## 🧠 Memory Check

After completing Phase 1 (Architecture Analysis), you should know:
- [ ] Where the entry point is
- [ ] What the main Ruby modules are
- [ ] How the UI is structured
- [ ] How Ruby and JS communicate
- [ ] What the namespace is
- [ ] What dependencies exist

After completing Phase 2 (Module Map), you should have:
- [ ] Complete MODULE_MAP.md file
- [ ] List of all classes and modules
- [ ] Dependency graph
- [ ] Validation report

After completing Phase 3 (Refactor Planning), you should have:
- [ ] Complete REFACTOR_PLAN.md file
- [ ] Risk assessment
- [ ] Phase-by-phase roadmap

---

## 🚀 How to Use This Prompt

**User says:**
> "Claude, read CURSOR_PROMPT.md and start Phase 1"

**You should:**
1. Read this file completely
2. Start with Step 1.1
3. Work through each step systematically
4. Create all requested documentation
5. Report progress after each major step
6. Wait for approval before execution phases

**If user says:**
> "Skip to Step X"

**You should:**
- Confirm what you'll skip
- Warn about dependencies
- Then proceed to requested step

---

*Prepared by: Parsa Barati (LexaPlus)*  
*For: Cursor + Claude Systematic Refactor*  
*Version: 1.0*

