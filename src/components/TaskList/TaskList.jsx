import { TaskItem } from "../TaskItem";
import styles from "./TaskList.module.css";

export function TaskList({ tasks, loading, error, onToggle, onEdit, onDelete }) {
  if (loading) {
    return <div className={styles.message}>Loading tasks...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (tasks.length === 0) {
    return <div className={styles.message}>No tasks found. Add one above!</div>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
