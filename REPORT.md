# Technical Project Report: Dynamic Form Builder

## 1. Executive Summary
The **Dynamic Form Builder** is a robust, React-based web application designed to manage complex, hierarchical question structures. The project demonstrates advanced React patterns, including recursive component rendering, deep state management, and seamless integration of third-party libraries for enhanced user experience (UX).

## 2. Technical Architecture

### 2.1 Recursive Component Strategy
A key technical requirement was supporting unlimited nesting of sub-questions. I implemented a **recursive component architecture**:
- The `QuestionItem` component renders itself for any child questions found in its data node.
- This approach avoids "prop drilling" and allows the UI to scale infinitely without adding complexity to the rendering logic.

### 2.2 Deep State Management
Managing a tree-like data structure in React requires careful handling of state to ensure immutability:
- **State Structure**: The entire form is represented as a single array of objects, where each object can contain a `children` array.
- **Tree Traversal**: I implemented custom recursive helper functions (`updateQuestionTree` and `deleteFromTree`) to perform CRUD operations on specific nodes within the nested hierarchy.

### 2.3 Persistence Layer
To provide a seamless user experience, I integrated **Local Storage Persistence**:
- A `useEffect` hook monitors the `questions` state and synchronizes it with the browser's `localStorage` on every update.
- This ensures that users can refresh the page or return later without losing their progress.

## 3. UI/UX Design

### 3.1 Design System: Glassmorphism
The application features a premium **Dark Mode Glassmorphism** design:
- **Aesthetics**: Utilizing `backdrop-blur`, subtle borders, and a deep navy color palette to create a high-end "Pro" feel.
- **Hierarchy Visualization**: Nested questions are visually indented and connected with a persistent left-border gradient, making the structure easy to scan.

### 3.2 Drag-and-Drop Reordering
For the bonus challenge, I integrated **@dnd-kit**:
- This allows for accessible and performant reordering of parent questions.
- The use of `SortableContext` ensures that parent questions can be reordered without disrupting their internal child structures.

## 4. Feature Highlights
- **Hierarchical Auto-Numbering**: Numbers (e.g., Q1.1, Q1.1.1) are dynamically computed during render, ensuring they are always accurate after deletions or reorders.
- **Conditional Sub-questions**: Logic-based UI that only exposes sub-question creation when a True/False question is answered "True".
- **Real-time Feedback**: Integrated a "toast" notification system for immediate feedback on user actions (e.g., "Question added", "Question reordered").

## 5. Verification & Testing
The application was rigorously tested for:
- **Recursive Integrity**: Verified that 5+ levels of nesting do not cause performance bottlenecks or UI glitches.
- **Edge Cases**: Verified that switching question types (e.g., from True/False back to Short Answer) safely clears hidden child data to prevent orphaned state.
- **Cross-browser Compatibility**: Tested for responsiveness and layout consistency across various screen sizes.

---
**Developed by**: Subramanya
**Live Demo**: [https://dynamic-form-builder-lime-tau.vercel.app/](https://dynamic-form-builder-lime-tau.vercel.app/)
