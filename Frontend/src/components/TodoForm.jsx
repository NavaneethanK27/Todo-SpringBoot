import React, { useState, useEffect } from 'react';

/**
 * TodoForm component for creating and editing tasks
 * @param {Object|null} editingTodo - The todo object currently being edited, or null
 * @param {Function} onSubmit - Form submission handler (payload is todo properties)
 * @param {Function} onCancel - Edit cancellation handler
 */
export default function TodoForm({ editingTodo, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if editingTodo changes
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
      setPriority(editingTodo.priority || 'MEDIUM');
      setDueDate(editingTodo.dueDate ? editingTodo.dueDate.substring(0, 10) : '');
    } else {
      resetForm();
    }
  }, [editingTodo]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setDueDate('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        completed: editingTodo ? editingTodo.completed : false,
      });
      if (!editingTodo) {
        resetForm();
      }
    } catch (error) {
      console.error("Form submit error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl space-y-4">
      <h2 className="text-lg font-bold text-slate-100 mb-2 flex items-center gap-2">
        <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
        {editingTodo ? 'Edit Task' : 'Add New Task'}
      </h2>

      {/* Title */}
      <div>
        <label htmlFor="todo-title" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          Task Title <span className="text-indigo-400">*</span>
        </label>
        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Finish Spring Boot integration"
          required
          maxLength={100}
          className="w-full px-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-100 placeholder-slate-600"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="todo-description" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          Description
        </label>
        <textarea
          id="todo-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details, links, or notes..."
          rows={3}
          maxLength={500}
          className="w-full px-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-100 placeholder-slate-600 resize-none"
        />
      </div>

      {/* Grid: Priority & Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Priority
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'LOW', label: 'Low', color: 'border-sky-500/20 active:bg-sky-500/10 text-sky-400' },
              { value: 'MEDIUM', label: 'Medium', color: 'border-amber-500/20 active:bg-amber-500/10 text-amber-400' },
              { value: 'HIGH', label: 'High', color: 'border-rose-500/20 active:bg-rose-500/10 text-rose-400' },
            ].map((p) => {
              const isSelected = priority === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? p.value === 'HIGH'
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                        : p.value === 'MEDIUM'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                      : 'border-white/5 bg-slate-950/20 text-slate-400 hover:text-slate-200 hover:border-white/10'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="todo-duedate" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Due Date
          </label>
          <input
            id="todo-duedate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-slate-300 cursor-pointer [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2">
        {editingTodo && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border border-white/5 hover:border-white/10 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className={`px-5 py-2 text-sm font-semibold rounded-xl text-white shadow-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            !title.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : editingTodo ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
          {editingTodo ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}
