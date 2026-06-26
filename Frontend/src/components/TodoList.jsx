import React, { useState, useMemo } from 'react';
import TodoItem from './TodoItem';

/**
 * TodoList component
 * @param {Array} todos - List of all todos
 * @param {boolean} isLoading - Loading state flag
 * @param {Function} onToggle - Toggle todo completion
 * @param {Function} onEdit - Edit todo click handler
 * @param {Function} onDelete - Delete todo click handler
 */
export default function TodoList({ todos, isLoading, onToggle, onEdit, onDelete }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, completed
  const [priorityFilter, setPriorityFilter] = useState('all'); // all, high, medium, low
  const [sortBy, setSortBy] = useState('none'); // none, dueDate, priority

  // Helper mapping for priority weights in sorting
  const priorityWeights = { HIGH: 3, MEDIUM: 2, LOW: 1 };

  // Filtered and sorted todos
  const filteredAndSortedTodos = useMemo(() => {
    let result = [...todos];

    // 1. Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (todo) =>
          todo.title?.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query)
      );
    }

    // 2. Filter by Status
    if (statusFilter === 'pending') {
      result = result.filter((todo) => !todo.completed);
    } else if (statusFilter === 'completed') {
      result = result.filter((todo) => todo.completed);
    }

    // 3. Filter by Priority
    if (priorityFilter !== 'all') {
      result = result.filter(
        (todo) => todo.priority?.toUpperCase() === priorityFilter.toUpperCase()
      );
    }

    // 4. Sort
    if (sortBy === 'dueDate') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sortBy === 'priority') {
      result.sort((a, b) => {
        const weightA = priorityWeights[a.priority?.toUpperCase()] || 0;
        const weightB = priorityWeights[b.priority?.toUpperCase()] || 0;
        return weightB - weightA; // High priority first
      });
    }

    return result;
  }, [todos, searchQuery, statusFilter, priorityFilter, sortBy]);

  // Loading skeleton layout
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="glass p-5 rounded-2xl flex items-center justify-between gap-4 animate-shimmer">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-6 h-6 rounded-full bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-3 bg-slate-800 rounded w-2/3" />
              </div>
            </div>
            <div className="w-16 h-8 bg-slate-800 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search, Filter & Sort Controls Grid */}
      <div className="glass p-5 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-100 placeholder-slate-500"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🔵 Low Priority</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300 cursor-pointer"
          >
            <option value="none">Sort By (Default)</option>
            <option value="dueDate">📅 Due Date</option>
            <option value="priority">🔥 High Priority First</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs & Todo count */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex p-1 bg-slate-950/40 border border-white/5 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs font-medium text-slate-500">
          Showing {filteredAndSortedTodos.length} of {todos.length} items
        </span>
      </div>

      {/* Todo Items Container */}
      {filteredAndSortedTodos.length > 0 ? (
        <div className="space-y-3">
          {filteredAndSortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center gap-4 border-dashed border-white/10">
          <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-white/5 flex items-center justify-center text-indigo-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-200">No tasks found</h4>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              {todos.length === 0
                ? "You don't have any tasks created yet. Use the form above to add a new task."
                : "No tasks match your current filters and search query. Try resetting them."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
