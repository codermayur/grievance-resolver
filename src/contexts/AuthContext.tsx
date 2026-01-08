import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Student',
    email: 'student@university.edu',
    password: 'password',
    role: 'student',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Dr. Jane Faculty',
    email: 'faculty@university.edu',
    password: 'password',
    role: 'faculty',
    departmentId: 'dept-1',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@university.edu',
    password: 'password',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      return false;
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      isActive: true,
      createdAt: new Date(),
    };
    
    setUser(newUser);
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
