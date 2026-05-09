export default function QuestionItem({
  question,
  number,
  onUpdate,
  onDelete,
  onAddChild,
  isParent,
  isDragOverlay,
  dragHandleProps,
}) {
  const { id, text, type, answer, children } = question

  return (
    <>
      <div className="question-card-header">
        {isParent && !isDragOverlay && dragHandleProps && (
          <div className="drag-handle" {...dragHandleProps}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </div>
        )}
        <span className="question-number">Q{number}</span>
        <div className="question-actions">
          <button
            className="btn-icon"
            onClick={() => onDelete(id)}
            title="Delete question"
            aria-label={`Delete question Q${number}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      <div className="question-card-body">
        <div className="question-row">
          <input
            className="input-field"
            type="text"
            placeholder="Enter your question..."
            value={text}
            onChange={(e) => onUpdate(id, 'text', e.target.value)}
            id={`question-input-${id}`}
          />
          <select
            className="select-field"
            value={type}
            onChange={(e) => onUpdate(id, 'type', e.target.value)}
            id={`question-type-${id}`}
          >
            <option value="short">Short Answer</option>
            <option value="truefalse">True / False</option>
          </select>
        </div>

        {type === 'truefalse' && (
          <div className="answer-selector">
            <label>Answer:</label>
            <div className="radio-group">
              <label
                className={`radio-option ${answer === 'true' ? 'selected-true' : ''}`}
              >
                <input
                  type="radio"
                  name={`answer-${id}`}
                  value="true"
                  checked={answer === 'true'}
                  onChange={() => onUpdate(id, 'answer', 'true')}
                />
                True
              </label>
              <label
                className={`radio-option ${answer === 'false' ? 'selected-false' : ''}`}
              >
                <input
                  type="radio"
                  name={`answer-${id}`}
                  value="false"
                  checked={answer === 'false'}
                  onChange={() => onUpdate(id, 'answer', 'false')}
                />
                False
              </label>
            </div>
          </div>
        )}

        {/* Show children and "Add child" button when answer is true */}
        {type === 'truefalse' && answer === 'true' && (
          <div className="children-container">
            {children.map((child, idx) => (
              <div className="question-card" key={child.id}>
                <QuestionItem
                  question={child}
                  number={`${number}.${idx + 1}`}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onAddChild={onAddChild}
                  isParent={false}
                />
              </div>
            ))}
            <button
              className="btn btn-secondary btn-sm add-child-btn"
              onClick={() => onAddChild(id)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Sub-question
            </button>
          </div>
        )}
      </div>
    </>
  )
}
