import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;
}

const defaultUser: UserProfile = {
  id: 'usr-sre-01',
  name: 'Alex Rivers',
  email: 'alex.rivers@performance.lab',
  role: 'admin',
  organization: 'Open Infrastructure Lab',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('devflow_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return defaultUser;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('devflow_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('devflow_user');
      }
    } catch {
      // Ignore
    }
  }, [user]);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    // Accepts any valid email for demo or matches admin
    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: email.includes('admin') ? 'admin' : 'member',
      organization: 'Performance Engineering Lab',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
    };
    setUser(newUser);
    return true;
  };

  const register = async (name: string, email: string, _password?: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      name,
      email,
      role: 'member',
      organization: 'DevFlow Community',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80'
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
