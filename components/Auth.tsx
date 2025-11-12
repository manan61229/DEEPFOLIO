
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogoIcon } from './IconComponents';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, signup, loginAsGuest } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setLoading(true);
    try {
        await loginAsGuest();
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="text-center">
            <LogoIcon className="w-12 h-12 text-cyan-400 mx-auto" />
            <h1 className="mt-4 text-3xl font-bold text-white tracking-tight">
                Welcome to DeepFolio <span className="text-cyan-400">AI</span>
            </h1>
            <p className="mt-2 text-gray-400">
                {isLogin ? 'Sign in to generate your portfolio' : 'Create an account to get started'}
            </p>
        </div>

        <div className="flex border-b border-gray-600">
            <button 
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`w-1/2 py-3 font-semibold transition-colors ${isLogin ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
                Sign In
            </button>
            <button 
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`w-1/2 py-3 font-semibold transition-colors ${!isLogin ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
                Sign Up
            </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-500"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
            </button>
          </div>
        </form>

        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-500">Or</span>
            </div>
        </div>

        <div>
            <button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-500"
            >
                Continue as Guest
            </button>
        </div>

      </div>
    </div>
  );
};