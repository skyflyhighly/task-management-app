import { useState } from "react";
import { TaskFilter, TaskForm, TaskList } from "../../components";
import { useTasks } from "../../hooks";
import styles from "./TasksPage.module.css";

export function TasksPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { tasks, loading, error, addTask, updateTask, toggleTask, deleteTask } = useTasks(filter, search);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Task Manager</h1>
        <p className={styles.subtitle}>Stay organized and productive</p>
      </header>

      <main className={styles.main}>
        <TaskFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />
        <TaskForm onSubmit={addTask} />
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onToggle={toggleTask}
          onEdit={updateTask}
          onDelete={deleteTask}
        />
      </main>
    </div>
  );
}
