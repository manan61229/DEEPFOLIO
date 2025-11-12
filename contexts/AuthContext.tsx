
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for a logged-in user in localStorage on initial load
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (loggedInUserEmail) {
      const isGuest = localStorage.getItem('isGuest') === 'true';
      setUser({ email: loggedInUserEmail, isGuest });
    }
  }, []);

  const login = (email: string, pass: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: User) => u.email === email && u.password === pass);
      if (foundUser) {
        localStorage.setItem('loggedInUser', email);
        localStorage.removeItem('isGuest');
        const currentUser = { email, isGuest: false };
        setUser(currentUser);
        resolve(currentUser);
      } else {
        reject(new Error('Invalid email or password.'));
      }
    });
  };

  const signup = (email: string, pass: string): Promise<User> => {
     return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u: User) => u.email === email);
      if (userExists) {
        reject(new Error('User with this email already exists.'));
      } else {
        const newUser = { email, password: pass };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', email);
        localStorage.removeItem('isGuest');
        const currentUser = { email, isGuest: false };
        setUser(currentUser);
        resolve(currentUser);
      }
    });
  };

  const loginAsGuest = (): Promise<User> => {
    return new Promise((resolve) => {
      const guestUser = { email: 'guest@deepfolio.ai', isGuest: true };
      localStorage.setItem('loggedInUser', guestUser.email);
      localStorage.setItem('isGuest', 'true');
      setUser(guestUser);
      resolve(guestUser);
    });
  };


  const logout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('isGuest');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loginAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};