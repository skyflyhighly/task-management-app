import { useState } from "react";
import styles from "./TaskForm.module.css";

export function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit(title.trim());
    setTitle("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
      />
      <button className={styles.submitButton} type="submit">
        Add Task
      </button>
    </form>
  );
}
