import { useEffect, useState, useCallback } from "react";
import { taskApi } from "../api";

export function useTasks(filter = "all", search = "") {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }
        setError(null);
        const data = await taskApi.getAll({ status: filter, search });
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [filter, search],
  );

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(async (taskData) => {
    try {
      // Support both string (title only) and object format
      const data =
        typeof taskData === "string" ? { title: taskData } : taskData;
      const newTask = await taskApi.create(data);
      // Optimistic update: add to list immediately
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const toggleTask = useCallback(async (task) => {
    try {
      // Optimistic update: toggle locally first
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t,
        ),
      );
      await taskApi.update(task.id, { completed: !task.completed });
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: task.completed } : t,
        ),
      );
      setError(err.message);
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    // Store original task for potential rollback
    let originalTask;
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            originalTask = t;
            return { ...t, ...updates };
          }
          return t;
        }),
      );
      await taskApi.update(id, updates);
    } catch (err) {
      // Revert on error
      if (originalTask) {
        setTasks((prev) => prev.map((t) => (t.id === id ? originalTask : t)));
      }
      setError(err.message);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    // Store the task for potential rollback
    let deletedTask;
    try {
      // Optimistic update: remove from list immediately
      setTasks((prev) => {
        deletedTask = prev.find((t) => t.id === id);
        return prev.filter((t) => t.id !== id);
      });
      await taskApi.delete(id);
    } catch (err) {
      // Revert on error
      if (deletedTask) {
        setTasks((prev) => [...prev, deletedTask]);
      }
      setError(err.message);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    refresh: loadTasks,
  };
}
