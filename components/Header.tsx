
import React from 'react';
import { LogoIcon, UserIcon, LogOutIcon } from './IconComponents';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900/50 backdrop-blur-md sticky top-0 z-10 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LogoIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            DeepFolio <span className="text-cyan-400">AI</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
            {user?.isGuest ? (
                <>
                    <span className="text-sm text-gray-400">Welcome, Guest</span>
                    <button
                        onClick={logout}
                        className="text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 px-3 py-1.5 rounded-md transition-colors"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={logout}
                        className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                       Exit
                    </button>
                </>
            ) : user ? (
                <>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                        <UserIcon className="w-5 h-5" />
                        <span>{user.email}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center space-x-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                        <LogOutIcon className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </>
            ) : null}
        </div>
      </div>
    </header>
  );
};