# 📋 Dynamic Form Builder

A React application for dynamically creating, nesting, and organizing questions with hierarchical auto-numbering, drag-and-drop reordering, and local storage persistence.

## ✨ Features

### Core Features
- **Add Parent Questions** — Dynamically add new questions with a text input and type selector
- **Question Types** — Choose between "Short Answer" or "True/False" for each question
- **Nested Child Questions** — When a True/False question is answered "True", add recursive sub-questions (unlimited nesting depth)
- **Auto-Numbering** — Hierarchical numbering (Q1, Q1.1, Q1.1.1, Q2, etc.) updates automatically
- **Delete Functionality** — Remove any question and all its children with one click
- **Form Submission** — Review all questions in a beautiful hierarchical modal view

### Bonus Features
- **Local Storage Persistence** — Form state is saved automatically; refresh the page without losing progress
- **Drag-and-Drop Reordering** — Reorder parent questions via drag-and-drop (powered by `@dnd-kit`)

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ 
- **npm** v9+

### Setup & Run

```bash
# 1. Clone the repository
git clone <repo-url>
cd infollion_assignment

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173/**

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite 6](https://vite.dev/) | Build tool & dev server |
| [@dnd-kit](https://dndkit.com/) | Drag-and-drop reordering |
| [uuid](https://github.com/uuidjs/uuid) | Unique question IDs |
| Vanilla CSS | Custom dark-mode glassmorphism design |

## 📁 Project Structure

```
infollion_assignment/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── QuestionItem.jsx        # Recursive question card
│   │   ├── SortableQuestionItem.jsx # Drag-and-drop wrapper
│   │   └── SubmissionView.jsx      # Submission review modal
│   ├── App.jsx                     # Main app with state & logic
│   ├── index.css                   # Design system & styles
│   └── main.jsx                    # React entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎨 Design

- **Dark mode** with deep navy background and subtle gradient radials
- **Glassmorphism** cards with backdrop blur and translucent borders
- **Gradient accents** using indigo-to-violet color palette
- **Micro-animations** on add, delete, and modal open
- **Responsive** layout for mobile and desktop
- **Google Fonts** — Inter for clean, modern typography

## 📝 Usage Guide

1. Click **"Add New Question"** to create a parent question
2. Enter your question text and select the type (Short Answer or True/False)
3. For True/False questions, select an answer:
   - If **True** is selected, an **"Add Sub-question"** button appears
   - Sub-questions can themselves have sub-questions (infinite nesting)
4. **Drag** the grip handle (⠿) on parent questions to reorder them
5. Click the **trash icon** to delete a question and all its children
6. Click **"Submit & Review"** to see all questions in a hierarchical tree view
7. Your progress is **auto-saved** to localStorage — refresh and it's still there!

## 📄 License

MIT
