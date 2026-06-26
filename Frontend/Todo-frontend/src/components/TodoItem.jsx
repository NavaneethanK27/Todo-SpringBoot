import React from 'react';

/**
 * TodoItem component
 * @param {Object} todo - Todo details
 * @param {Function} onToggle - Complete toggle function
 * @param {Function} onEdit - Trigger edit function
 * @param {Function} onDelete - Trigger delete function
 */
export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const getPriorityStyle = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'LOW':
      default:
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && !todo.completed;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div 
      className={`glass-interactive group relative flex items-center justify-between p-5 rounded-2xl gap-4 ${
        todo.completed ? 'opacity-65 border-white/5 bg-slate-950/20' : 'bg-slate-900/40'
      }`}
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Custom Toggle Button */}
        <button
          onClick={() => onToggle(todo)}
          className={`mt-1 flex items-center justify-center w-6 h-6 rounded-full border-2 shrink-0 transition-all duration-300 cursor-pointer ${
            todo.completed
              ? 'bg-emerald-500 border-emerald-500 text-slate-950 scale-100'
              : 'border-slate-500 hover:border-indigo-400 hover:scale-105'
          }`}
          aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        >
          {todo.completed && (
            <svg className="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Text details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 
              className={`text-base font-semibold leading-6 truncate transition-all duration-300 ${
                todo.completed ? 'line-through text-slate-500' : 'text-slate-100'
              }`}
            >
              {todo.title}
            </h3>
            
            {/* Priority Tag */}
            <span className={`px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md border ${getPriorityStyle(todo.priority)}`}>
              {todo.priority || 'MEDIUM'}
            </span>
          </div>

          {todo.description && (
            <p className={`text-sm leading-relaxed mb-2 break-words ${todo.completed ? 'text-slate-600' : 'text-slate-400'}`}>
              {todo.description}
            </p>
          )}

          {/* Date and details */}
          {todo.dueDate && (
            <div className="flex items-center gap-1.5 text-xs">
              <svg className={`w-3.5 h-3.5 ${isOverdue(todo.dueDate) ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={isOverdue(todo.dueDate) ? 'text-rose-400 font-medium' : 'text-slate-500'}>
                {isOverdue(todo.dueDate) ? `Overdue: ${formatDate(todo.dueDate)}` : `Due: ${formatDate(todo.dueDate)}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
        <button
          onClick={() => onEdit(todo)}
          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 rounded-xl transition-all duration-200 cursor-pointer"
          aria-label="Edit todo"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-xl transition-all duration-200 cursor-pointer"
          aria-label="Delete todo"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
