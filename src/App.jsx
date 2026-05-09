import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import QuestionItem from './components/QuestionItem.jsx'
import SortableQuestionItem from './components/SortableQuestionItem.jsx'
import SubmissionView from './components/SubmissionView.jsx'

const STORAGE_KEY = 'infollion_questions'

function createQuestion() {
  return {
    id: uuidv4(),
    text: '',
    type: 'short',
    answer: null,
    children: [],
  }
}

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e)
  }
  return []
}

function saveToStorage(questions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export default function App() {
  const [questions, setQuestions] = useState(() => loadFromStorage())
  const [showSubmission, setShowSubmission] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeId, setActiveId] = useState(null)

  // Persist to localStorage on every change
  useEffect(() => {
    saveToStorage(questions)
  }, [questions])

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = useCallback((message) => {
    setToast(message)
  }, [])

  // ---- Question CRUD ----

  const addQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, createQuestion()])
    showToast('✨ New question added')
  }, [showToast])

  // Deep-update helper: applies a function to the question with the given id
  const updateQuestionTree = useCallback((questions, targetId, updater) => {
    return questions.map((q) => {
      if (q.id === targetId) {
        return updater(q)
      }
      if (q.children.length > 0) {
        return { ...q, children: updateQuestionTree(q.children, targetId, updater) }
      }
      return q
    })
  }, [])

  // Deep-delete helper
  const deleteFromTree = useCallback((questions, targetId) => {
    return questions
      .filter((q) => q.id !== targetId)
      .map((q) => ({
        ...q,
        children: deleteFromTree(q.children, targetId),
      }))
  }, [])

  const updateQuestion = useCallback((id, field, value) => {
    setQuestions((prev) =>
      updateQuestionTree(prev, id, (q) => {
        const updated = { ...q, [field]: value }
        // Reset answer & children when switching away from truefalse
        if (field === 'type' && value !== 'truefalse') {
          updated.answer = null
          updated.children = []
        }
        // Reset children when switching answer away from true
        if (field === 'answer' && value !== 'true') {
          updated.children = []
        }
        return updated
      })
    )
  }, [updateQuestionTree])

  const deleteQuestion = useCallback((id) => {
    setQuestions((prev) => deleteFromTree(prev, id))
    showToast('🗑️ Question deleted')
  }, [deleteFromTree, showToast])

  const addChildQuestion = useCallback((parentId) => {
    setQuestions((prev) =>
      updateQuestionTree(prev, parentId, (q) => ({
        ...q,
        children: [...q.children, createQuestion()],
      }))
    )
    showToast('✨ Sub-question added')
  }, [updateQuestionTree, showToast])

  // ---- Drag and Drop (parent level only) ----

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id)
  }, [])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    setActiveId(null)
    if (active.id !== over?.id) {
      setQuestions((prev) => {
        const oldIndex = prev.findIndex((q) => q.id === active.id)
        const newIndex = prev.findIndex((q) => q.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
      showToast('↕️ Question reordered')
    }
  }, [showToast])

  const handleDragCancel = useCallback(() => {
    setActiveId(null)
  }, [])

  const activeQuestion = activeId ? questions.find((q) => q.id === activeId) : null

  // ---- Submission ----

  const handleSubmit = useCallback(() => {
    if (questions.length === 0) {
      showToast('⚠️ Add at least one question first')
      return
    }
    setShowSubmission(true)
  }, [questions.length, showToast])

  const handleClearAll = useCallback(() => {
    setQuestions([])
    showToast('🧹 All questions cleared')
  }, [showToast])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Dynamic Form Builder</h1>
        <p>Create, nest, and organize your questions with ease</p>
      </header>

      {questions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No questions yet</h3>
          <p>Click the button below to add your first question</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {questions.map((question, index) => (
              <SortableQuestionItem
                key={question.id}
                question={question}
                number={`${index + 1}`}
                onUpdate={updateQuestion}
                onDelete={deleteQuestion}
                onAddChild={addChildQuestion}
                isParent={true}
              />
            ))}
          </SortableContext>

          <DragOverlay>
            {activeQuestion ? (
              <div className="question-card drag-overlay-card">
                <QuestionItem
                  question={activeQuestion}
                  number={`${questions.findIndex((q) => q.id === activeId) + 1}`}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  onAddChild={() => {}}
                  isParent={true}
                  isDragOverlay={true}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <div className="actions-bar">
        <button id="add-question-btn" className="btn btn-primary" onClick={addQuestion}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Question
        </button>
        {questions.length > 0 && (
          <>
            <button id="submit-btn" className="btn btn-secondary" onClick={handleSubmit}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Submit &amp; Review
            </button>
            <button id="clear-all-btn" className="btn btn-danger btn-sm" onClick={handleClearAll}>
              Clear All
            </button>
          </>
        )}
      </div>

      {showSubmission && (
        <SubmissionView
          questions={questions}
          onClose={() => setShowSubmission(false)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
