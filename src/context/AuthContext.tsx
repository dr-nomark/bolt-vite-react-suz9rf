import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, Scrap } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserScraps: (scraps: Scrap[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'authState';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      const authState: AuthState = JSON.parse(storedAuth);
      setUser(authState.user);
    }
  }, []);

  const saveAuthState = (authState: AuthState, rememberMe: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(authState));
    if (!rememberMe) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const updateUserScraps = (scraps: Scrap[]) => {
    if (user) {
      const updatedUser = { ...user, scraps };
      const storage = localStorage.getItem(STORAGE_KEY) ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY, JSON.stringify({ user: updatedUser, rememberMe: true }));
      setUser(updatedUser);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const mockUser: User = {
      id: Date.now().toString(),
      username,
      email,
      scraps: []
    };
    
    const authState: AuthState = {
      user: mockUser,
      rememberMe: false
    };
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    setUser(mockUser);
  };

  const login = async (username: string, password: string, rememberMe: boolean) => {
    const mockUser: User = {
      id: Date.now().toString(),
      username,
      email: `${username}@example.com`,
      scraps: []
    };
    
    const authState: AuthState = {
      user: mockUser,
      rememberMe
    };
    
    saveAuthState(authState, rememberMe);
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserScraps }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};