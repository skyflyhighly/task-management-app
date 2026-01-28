import styles from "./TaskFilter.module.css";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export function TaskFilter({ currentFilter, onFilterChange, search, onSearchChange }) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className={styles.filterGroup}>
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            className={`${styles.filterButton} ${currentFilter === value ? styles.active : ""}`}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
