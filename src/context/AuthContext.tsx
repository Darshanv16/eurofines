import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthContextType, Entity, InventoryType } from '../types/auth';
import { api } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedInventory, setSelectedInventory] = useState<InventoryType | null>(null);

  // Load user from token and selected entity/inventory from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      api.getCurrentUser().then((response) => {
        if (response.data) {
          const userData: User = {
            id: response.data.id,
            email: response.data.email,
            role: response.data.role as UserRole,
          };
          setUser(userData);
        } else {
          // Token invalid, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      });
    }
    
    const storedEntity = localStorage.getItem('selectedEntity');
    if (storedEntity) {
      setSelectedEntity(storedEntity as Entity);
    }
    
    const storedInventory = localStorage.getItem('selectedInventory');
    if (storedInventory) {
      setSelectedInventory(storedInventory as InventoryType);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await api.signin(email, password);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      const userData: User = {
        id: response.data.user.id,
        email: response.data.user.email,
        role: response.data.user.role as UserRole,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    
    throw new Error('An error occurred. Please try again.');
  };

  const signup = async (email: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    const response = await api.signup(email, password, role);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      const userData: User = {
        id: response.data.user.id,
        email: response.data.user.email,
        role: response.data.user.role as UserRole,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    
    throw new Error('An error occurred. Please try again.');
  };

  const selectEntity = (entity: Entity) => {
    setSelectedEntity(entity);
    localStorage.setItem('selectedEntity', entity);
    // Clear inventory when entity changes
    setSelectedInventory(null);
    localStorage.removeItem('selectedInventory');
  };

  const selectInventory = (inventory: InventoryType) => {
    setSelectedInventory(inventory);
    localStorage.setItem('selectedInventory', inventory);
  };

  const logout = () => {
    setUser(null);
    setSelectedEntity(null);
    setSelectedInventory(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedEntity');
    localStorage.removeItem('selectedInventory');
  };

  const value: AuthContextType = {
    user,
    selectedEntity,
    selectedInventory,
    login,
    signup,
    selectEntity,
    selectInventory,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
