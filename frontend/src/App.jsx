/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Calendar, ChevronRight, LogOut, User } from 'lucide-react';
import Auth from './Auth';
import { useAuth } from './hooks/useAuth';
import { useTodo } from './hooks/useTodo';

export default function App() {
  const { user, logout, loading: authLoading } = useAuth();
  const { todos, fetchTodos, addTodo, editTodo, removeTodo, loading: todosLoading } = useTodo();
  
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user, fetchTodos]);

  if (authLoading) return null;

  if (!user) {
    return <Auth />;
  }

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await addTodo({ title: inputValue.trim() });
    setInputValue('');
  };

  const toggleTodo = async (todo) => {
    await editTodo({ id: todo._id, completed: !todo.completed });
  };

  const deleteTodo = async (id) => {
    await removeTodo({ id });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                <ListTodo className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">TaskFlow</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <div className="bg-gray-100 p-1 rounded-full">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center justify-center p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-gray-500 flex items-center gap-2 text-sm mt-3">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-700' },
            { label: 'Active', value: stats.active, color: 'bg-amber-50 text-amber-700' },
            { label: 'Done', value: stats.completed, color: 'bg-emerald-50 text-emerald-700' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} p-4 rounded-2xl border border-white/50 shadow-sm`}>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleAddTodo} className="relative mb-8 group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-white border-2 border-transparent shadow-xl shadow-gray-200/50 rounded-2xl py-4 pl-6 pr-16 text-lg focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-400"
            disabled={todosLoading}
          />
          <button
            type="submit"
            disabled={todosLoading}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-[#1A1A1A] text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <motion.div
                  key={todo._id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className={`group flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${
                    todo.completed ? 'opacity-60' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo)}
                    className="flex-shrink-0 transition-transform active:scale-90 disabled:opacity-50"
                    disabled={todosLoading}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 group-hover:text-blue-400" />
                    )}
                  </button>
                  
                  <span className={`flex-grow text-lg transition-all ${
                    todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}>
                     {todo.title}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                    disabled={todosLoading}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListTodo className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-semibold">No tasks found</h3>
                <p className="text-gray-500 text-sm">Time to add some productivity!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        {todos.length > 0 && (
          <footer className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span>{stats.active} tasks left</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>{Math.round((stats.completed / stats.total) * 100) || 0}% complete</span>
            </div>
            <div className="flex items-center gap-1 group cursor-default">
              Stay focused <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
