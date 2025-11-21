# 🚀 LexaCut

**AI-Powered Cutting List Optimizer for SketchUp**

> Modern, intelligent, and beautiful cutting list generation for woodworking and manufacturing projects.

---

## 📖 About

**LexaCut** is a modernized fork of [OpenCutList](https://github.com/lairdubois/lairdubois-opencutlist-sketchup-extension), rebuilt from the ground up to provide:

- 🤖 **AI-Powered Optimization** - Intelligent material layout using CognitiveCut Engine
- 🎨 **Modern UI** - Vue 3 + TailwindCSS interface with dark mode
- 🌍 **RTL Language Support** - Full Persian, Arabic, and other RTL language support
- 📊 **Enhanced Reporting** - Advanced export formats (Excel, PDF, DXF, JSON)
- ⚡ **Performance** - Faster computation and better memory management
- 🔧 **Developer-Friendly** - Clean architecture, comprehensive documentation

---

## 🏗️ Project Status

**Current Phase:** Implementation & Testing

This project is currently in the implementation and testing phase. We have:
- ✅ Completed architecture analysis
- ✅ Implemented core functionality
- ✅ Established database setup
- ✅ Validated Excel formulas and extraction

For detailed status reports, see [Project Status](docs/project-status/PROJECT_COMPLETE.md).

---

## 🎯 Key Features (Planned)

### Core Features (Inherited from OpenCutList)
- ✅ Automatic cutting list generation from SketchUp models
- ✅ Material grouping and quantity calculations
- ✅ 1D and 2D cutting diagrams with optimization
- ✅ Label generation for parts
- ✅ Multi-language support (17 languages)
- ✅ Export to CSV, PDF formats

### LexaCut Enhancements
- 🚀 **CognitiveCut AI Engine** - Machine learning-based material optimization
- 🎨 **Modern UI/UX** - Vue 3 + TailwindCSS with responsive design
- 📊 **Advanced Analytics** - Cost analysis, waste reduction insights
- 🌐 **Cloud Sync** - Save and share projects across devices
- 🔌 **Plugin System** - Extensible architecture for custom integrations
- 📱 **Mobile Companion** - View and manage projects on mobile devices
- 🌍 **RTL Support** - First-class support for Persian and Arabic

---

## 🛠️ Tech Stack

### Backend (Ruby)
- Ruby 2.7+
- SketchUp Ruby API
- Custom bin packing algorithms

### Frontend
- **Current:** jQuery + Bootstrap + Twig templates
- **Target:** Vue 3 + TypeScript + TailwindCSS

### AI/ML
- Python 3.10+
- TensorFlow/PyTorch (planned)
- REST API for optimization services

---

## 📂 Project Structure

```
LexaCut/
├── src/
│   ├── ladb_opencutlist/       # Original OpenCutList source
│   │   ├── ruby/               # Ruby backend
│   │   ├── js/                 # JavaScript frontend
│   │   ├── css/                # Stylesheets
│   │   └── twig/               # Templates
│   └── (future) frontend/      # Modern Vue 3 frontend
├── docs/                       # Documentation
│   ├── installation/           # Installation guides
│   ├── project-status/         # Progress tracking
│   ├── technical/              # Technical documentation
│   ├── testing/                # Testing guides and reports
│   └── resources/              # Reference resources
├── build/                      # Build tools
├── dist/                       # Distribution files
├── scripts/                    # Utility scripts
├── test/                       # Test files
└── test-cases/                 # Test data and scenarios
```

---

## 🚦 Roadmap

### Phase 1: Foundation (Completed)
- [x] Fork OpenCutList codebase
- [x] Set up project structure
- [x] Create architecture documentation
- [x] Complete codebase analysis

### Phase 2: Namespace Migration
- [ ] Rename OpenCutList → LexaCut
- [ ] Update all file references
- [ ] Test basic functionality

### Phase 3: UI Modernization
- [ ] Set up Vue 3 + Vite + TypeScript
- [ ] Integrate TailwindCSS
- [ ] Migrate components from jQuery to Vue
- [ ] Implement dark/light mode

### Phase 4: AI Integration
- [ ] Design CognitiveCut Engine architecture
- [ ] Implement Python optimization service
- [ ] Create Ruby ↔ Python bridge
- [ ] Add AI-powered recommendations

### Phase 5: Enhanced Features
- [ ] Excel export with styling
- [ ] DXF/CNC export
- [ ] Cloud sync infrastructure
- [ ] Mobile companion app

### Phase 6: Release
- [ ] Comprehensive testing
- [ ] Package as .rbz extension
- [ ] Create user documentation
- [ ] Launch LexaCut v1.0

---

## 🤝 Contributing

This project is currently in early development. Contributions will be welcome soon!

For now, if you're interested in contributing:
1. ⭐ Star this repository
2. 👀 Watch for updates
3. 💬 Join discussions (coming soon)

---

## 📄 License

This project is a fork of [OpenCutList](https://github.com/lairdubois/lairdubois-opencutlist-sketchup-extension).

- **OpenCutList:** GNU General Public License v3.0
- **LexaCut:** GNU General Public License v3.0

See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **OpenCutList Team** - For creating the amazing foundation this project builds upon
- **Lexaplus & Renzo Group Community** - For years of development and refinement
- **All Contributors** - Past, present, and future

---

## 📧 Contact

**Parsa Barati** - [LexaPlus](https://lexaplus.com)

- GitHub: [@ParsaBarati](https://github.com/ParsaBarati)
- Project Link: [https://github.com/ParsaBarati/LexaCut](https://github.com/ParsaBarati/LexaCut)

---

## 📊 Project Stats

```
Total Files:     900+
Lines of Code:   235,000+
Languages:       17
Backend:         Ruby
Frontend:        JavaScript → Vue 3 (planned)
Status:          In Development
```

---

<div align="center">

**Built with ❤️ by the LexaPlus Team**

*Transforming how professionals create cutting lists*

[⭐ Star](https://github.com/ParsaBarati/LexaCut) • [🐛 Report Bug](https://github.com/ParsaBarati/LexaCut/issues) • [💡 Request Feature](https://github.com/ParsaBarati/LexaCut/issues)

</div>
