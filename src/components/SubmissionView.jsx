function SubmissionTree({ questions, prefix }) {
  return (
    <ul className="submission-tree">
      {questions.map((q, idx) => {
        const num = prefix ? `${prefix}.${idx + 1}` : `${idx + 1}`
        return (
          <li key={q.id} className="submission-item">
            <div className="submission-item-content">
              <span className="submission-question-number">Q{num}</span>
              <span className="submission-question-text">
                {q.text || '(No question text)'}
              </span>
              <div className="submission-meta">
                <span className={`tag ${q.type === 'short' ? 'tag-short' : 'tag-truefalse'}`}>
                  {q.type === 'short' ? 'Short Answer' : 'True / False'}
                </span>
                {q.type === 'truefalse' && q.answer && (
                  <span className={`tag ${q.answer === 'true' ? 'tag-true' : 'tag-false'}`}>
                    {q.answer === 'true' ? 'True' : 'False'}
                  </span>
                )}
              </div>
            </div>
            {q.children && q.children.length > 0 && (
              <div className="submission-children">
                <SubmissionTree questions={q.children} prefix={num} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default function SubmissionView({ questions, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 Form Submission Review</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close review">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <SubmissionTree questions={questions} prefix="" />
      </div>
    </div>
  )
}
