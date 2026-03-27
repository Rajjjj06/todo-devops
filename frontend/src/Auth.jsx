import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, LogIn } from 'lucide-react';

import { useAuth } from './hooks/useAuth';

export default function Auth() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() && password.trim()) {
      try {
        if (isLogin) {
          await login({ name: name.trim(), password });
        } else {
          await register({ name: name.trim(), password });
        }
      } catch (error) {
        console.error(error);
        alert("Authentication failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 text-[#1A1A1A] font-sans selection:bg-blue-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-200">
             {isLogin ? <LogIn className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="text-gray-500 text-center mb-8">
          {isLogin ? 'Enter your credentials to continue' : 'Sign up to start managing your tasks'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-4 px-5 text-lg focus:outline-none focus:border-blue-500 transition-all focus:bg-white placeholder:text-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-4 px-5 text-lg focus:outline-none focus:border-blue-500 transition-all focus:bg-white placeholder:text-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white flex items-center justify-center gap-2 rounded-xl py-4 text-lg font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
          >
            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-gray-500 mb-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-base text-blue-600 font-bold hover:text-blue-700 transition-colors"
          >
            {isLogin ? "Create an account" : "Sign in to your account"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
