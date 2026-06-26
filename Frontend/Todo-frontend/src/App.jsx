import React, { useState, useEffect } from 'react';
import { todoApi } from './api/todoApi';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Toast from './components/Toast';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);
  const [toast, setToast] = useState(null);

  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const data = await todoApi.getAll();
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading todos:", error);
      showToast("Unable to load tasks from backend server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleFormSubmit = async (todoData) => {
    try {
      if (editingTodo) {
        // Edit mode
        const updated = await todoApi.update(editingTodo.id, todoData);
        setTodos((prev) => prev.map((t) => (t.id === editingTodo.id ? updated : t)));
        showToast("Task updated successfully!", "success");
        setEditingTodo(null);
      } else {
        // Add mode
        const created = await todoApi.create(todoData);
        setTodos((prev) => [created, ...prev]);
        showToast("Task created successfully!", "success");
      }
    } catch (error) {
      console.error("Error saving todo:", error);
      showToast(`Error saving task: ${error.message || 'unknown error'}`, "error");
      throw error; // Re-throw to handle loading state inside Form
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const updatedData = { ...todo, completed: !todo.completed };
      const updated = await todoApi.update(todo.id, updatedData);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      showToast(
        updated.completed ? "Task marked as completed!" : "Task marked as pending.", 
        "info"
      );
    } catch (error) {
      console.error("Error toggling todo status:", error);
      showToast("Failed to update status. Please try again.", "error");
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await todoApi.delete(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      showToast("Task deleted successfully.", "success");
      if (editingTodo?.id === id) {
        setEditingTodo(null);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      showToast("Failed to delete task.", "error");
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    // Scroll smoothly to form on mobile devices
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  // Compute metrics
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityCount = todos.filter((t) => t.priority === 'HIGH' && !t.completed).length;

  return (
    <div className="min-h-screen pb-16 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Panel */}
      <header className="py-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              ApexTodo
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Manage your daily tasks with reactive persistence & beautiful styling.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-white/5 text-xs font-semibold text-slate-400">
          <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          {isLoading ? 'Syncing Backend...' : 'Backend Connected'}
        </div>
      </header>

      {/* Stats Deck */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', value: totalCount, color: 'text-indigo-400', bg: 'bg-indigo-500/5' },
          { label: 'Pending Tasks', value: pendingCount, color: 'text-amber-400', bg: 'bg-amber-500/5' },
          { label: 'Completed Tasks', value: completedCount, color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
          { label: 'Critical Tasks', value: highPriorityCount, color: 'text-rose-400', bg: 'bg-rose-500/5' },
        ].map((stat, idx) => (
          <div key={idx} className={`glass p-4 rounded-2xl flex flex-col justify-between ${stat.bg}`}>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
            <span className={`text-2xl md:text-3xl font-bold mt-2 font-mono ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </section>

      {/* Main Workspace */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sidebar: Entry Form */}
        <section className="lg:col-span-1">
          <TodoForm
            editingTodo={editingTodo}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
          />
        </section>

        {/* Content Panel: Todo List */}
        <section className="lg:col-span-2">
          <TodoList
            todos={todos}
            isLoading={isLoading}
            onToggle={handleToggleTodo}
            onEdit={handleEditClick}
            onDelete={handleDeleteTodo}
          />
        </section>
      </main>
    </div>
  );
}
