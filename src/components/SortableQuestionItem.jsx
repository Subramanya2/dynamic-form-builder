import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import QuestionItem from './QuestionItem.jsx'

export default function SortableQuestionItem({
  question,
  number,
  onUpdate,
  onDelete,
  onAddChild,
  isParent,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`question-card ${isDragging ? 'dragging' : ''}`}
    >
      <QuestionItem
        question={question}
        number={number}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onAddChild={onAddChild}
        isParent={isParent}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}
