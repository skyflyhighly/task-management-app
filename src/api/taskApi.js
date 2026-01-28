const API_BASE_URL = "http://localhost:3000/api";

/**
 * Handles API response and extracts data or throws error
 */
async function handleResponse(response) {
  const json = await response.json();

  if (!response.ok) {
    const errorMessage = json.message
      ? Array.isArray(json.message)
        ? json.message.join(", ")
        : json.message
      : json.error || "An error occurred";
    throw new Error(errorMessage);
  }

  return json;
}

export const taskApi = {
  /**
   * GET /api/tasks
   * Fetches all tasks with optional status filter and search
   * @param {Object} options - Query options
   * @param {string} [options.status] - Filter by status: "all" | "completed" | "pending"
   * @param {string} [options.search] - Search term to filter by title or description
   * @returns {Promise<Array>} Array of task objects
   */
  async getAll({ status = "all", search = "" } = {}) {
    const params = new URLSearchParams({ status });
    if (search) {
      params.append("search", search);
    }
    const response = await fetch(`${API_BASE_URL}/tasks?${params}`);
    const json = await handleResponse(response);
    return json.data;
  },

  /**
   * GET /api/tasks/:id
   * Fetches a single task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Task object
   */
  async getOne(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    const json = await handleResponse(response);
    return json.data;
  },

  /**
   * POST /api/tasks
   * Creates a new task
   * @param {Object} taskData - Task data
   * @param {string} taskData.title - Task title (required, 1-255 chars)
   * @param {string} [taskData.description] - Task description (optional, max 5000 chars)
   * @param {boolean} [taskData.completed] - Task completion status (default: false)
   * @returns {Promise<Object>} Created task object
   */
  async create({ title, description, completed }) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: {
          title,
          ...(description !== undefined && { description }),
          ...(completed !== undefined && { completed }),
        },
      }),
    });
    const json = await handleResponse(response);
    return json.data;
  },

  /**
   * PATCH /api/tasks/:id
   * Updates an existing task
   * @param {number} id - Task ID
   * @param {Object} updates - Fields to update
   * @param {string} [updates.title] - Task title
   * @param {string} [updates.description] - Task description
   * @param {boolean} [updates.completed] - Task completion status
   * @returns {Promise<Object>} Updated task object
   */
  async update(id, updates) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: updates }),
    });
    const json = await handleResponse(response);
    return json.data;
  },

  /**
   * DELETE /api/tasks/:id
   * Deletes a task
   * @param {number} id - Task ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  },
};
