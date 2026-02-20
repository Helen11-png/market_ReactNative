import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Регистрация
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Здесь будет реальный API запрос
      await new Promise(resolve => setTimeout(resolve, 1500)); // Имитация
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
      };
      
      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.setItem('token', 'mock-jwt-token');
      
    } catch (error) {
      throw new Error('Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  // Вход
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: '1',
        name: 'Иван Иванов',
        email,
      };
      
      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('token', 'mock-jwt-token');
      
    } catch (error) {
      throw new Error('Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  // Выход
  const logout = async () => {
    setUser(null);
    await AsyncStorage.clear();
  };

  // Проверка при запуске
  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
      }
    };
    
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};