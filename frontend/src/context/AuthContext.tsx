import React, { createContext, useContext, useState } from 'react';
import type { AuthUser, Role } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, name: string, identifier: string, role: Role, teamId?: number, teamName?: string, id?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedToken = localStorage.getItem('bloodbridge_token');
    const savedUser = localStorage.getItem('bloodbridge_user');
    if (savedToken && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (token: string, name: string, identifier: string, role: Role, teamId?: number, teamName?: string, id?: number) => {
    const userData: AuthUser = { id, name, identifier, role, token, teamId, teamName };
    localStorage.setItem('bloodbridge_token', token);
    localStorage.setItem('bloodbridge_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('bloodbridge_token');
    localStorage.removeItem('bloodbridge_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
