// API client for connecting to the Spring Boot backend
// Defaults to the Vite proxy '/todos' which forwards to http://localhost:8080/todos
// If you want to connect directly (e.g. if you build the app and deploy it on a different domain),
// you can set VITE_API_URL in an .env file.
const BASE_URL = import.meta.env.VITE_API_URL || '/todos';

export const todoApi = {
  /**
   * Fetch all todos
   * @returns {Promise<Array>} List of todo items
   */
  async getAll() {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Create a new todo
   * @param {Object} todo - Todo details (title, description, completed, priority, etc.)
   * @returns {Promise<Object>} The created todo item
   */
  async create(todo) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: todo.title,
        description: todo.description || '',
        completed: todo.completed || false,
        priority: todo.priority || 'MEDIUM',
        dueDate: todo.dueDate || null,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create todo: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Update an existing todo
   * @param {string|number} id - Todo ID
   * @param {Object} todo - Updated fields
   * @returns {Promise<Object>} The updated todo item
   */
  async update(id, todo) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        title: todo.title,
        description: todo.description || '',
        completed: todo.completed,
        priority: todo.priority || 'MEDIUM',
        dueDate: todo.dueDate || null,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update todo: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Delete a todo item
   * @param {string|number} id - Todo ID
   * @returns {Promise<Object>} Success status
   */
  async delete(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.status} ${response.statusText}`);
    }
    if (response.status === 204) {
      return { success: true };
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return { success: true };
  }
};
