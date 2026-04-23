# FriendlyI18n 🌐

**FriendlyI18n** is a high-performance, minimalist bulk editor for i18n JSON files. Designed for large-scale translation projects (40+ files), it ensures a lag-free experience while maintaining perfect structural symmetry across your entire codebase.

![Preview of FriendlyI18n](https://img.shields.io/badge/UI-Minimalist-black?style=for-the-badge)
![Vue 3](https://img.shields.io/badge/Vue%203-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

---

## ✨ Key Features

### 🚀 High-Performance Data Grid
* **Reactive Map Strategy**: Uses a optimized flat-map state to handle thousands of keys across dozens of files without UI lag.
* **Sticky Layout**: Horizontal and vertical sticky positioning for keys and headers, so you never lose context.
* **Resizable Workspace**: Draggable sidebar and column headers to customize your editing environment.

### ⚖️ Structural Alignment (Project-Wide Sync)
* **Symmetric Keys**: Ensures every exported file contains the exact same set of keys. Missing translations are automatically injected as empty strings during export.
* **Global Delete**: Removing a key purges it from every single language file instantly.
* **Base Language Reference**: Auto-detects **PT-BR** (or allows manual selection) as the structural source of truth. The project's sorting and structure follow your base language.

### 🛠️ Advanced Bulk Tools
* **Multi-Pattern Visibility**: Quickly isolate columns by typing comma-separated patterns (e.g., `en, pt, es`) to focus on specific languages.
* **Transformation Tools**: Apply prefix, suffix, find-and-replace, or case transformations (UPPER/lower) to thousands of keys at once.
* **ZIP Export**: Bundle your entire aligned project into a single, clean archive with one click.

### 🎨 Premium Minimalist UI
* **Utility-Focused Dark Mode**: A monochromatic, high-contrast interface designed for long data-entry sessions.
* **Focused Modals**: Custom modal system for editing complex translations across all languages in a single focused view.

---

## 🛠️ Tech Stack

* **Framework**: [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Icons**: [Lucide Vue Next](https://lucide.dev/)
* **Processing**: [JSZip](https://stuk.github.io/jszip/) for in-memory bundling.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm / yarn / bun

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/FriendlyI18n.git

# Navigate to project
cd FriendlyI18n

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```text
src/
├── store/
│   └── useEditor.ts        # Central business logic (Syncing, Bulk, Export)
├── composables/
│   └── useResizing.ts      # UI layout & resizing interactivity
├── components/
│   ├── Sidebar/            # Navigation, Filter & Bulk Tools
│   ├── Grid/               # High-performance editing surface
│   └── Modals/             # Task-specific interaction layers
├── types/
│   └── index.ts            # Core TypeScript interfaces
└── App.vue                 # Modular entry point
```

---

## 📜 License
MIT
