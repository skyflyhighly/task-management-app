import { useState } from "react";
import { Check, Clock, Trash2 } from "lucide-react";
import styles from "./TaskItem.module.css";

export function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const handleSubmit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      onEdit(task.id, { title: trimmed });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setEditValue(task.title);
      setIsEditing(false);
    }
  };

  return (
    <li className={`${styles.item} ${task.completed ? styles.completed : ""}`}>
      <span className={styles.status} onClick={() => onToggle(task)}>
        {task.completed ? <Check size={18} /> : <Clock size={18} />}
      </span>
      {isEditing ? (
        <input
          type="text"
          className={styles.editInput}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          className={styles.title}
          onDoubleClick={() => setIsEditing(true)}
        >
          {task.title}
        </span>
      )}
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        <Trash2 size={18} />
      </button>
    </li>
  );
}
