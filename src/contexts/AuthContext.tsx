import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import { AuthService } from '../services/AuthService';

interface User {
  name: string;
  email: string;
  planType: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = localStorage.getItem('@ConcursoApp:user');
      const storagedToken = localStorage.getItem('@ConcursoApp:token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));

        try {
          const { data } = await AuthService.getMe();
          setUser(data);
          localStorage.setItem('@ConcursoApp:user', JSON.stringify(data));
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    }
    
    loadStorageData();
  }, []);

  async function login(payload: any) {
    const { data: { token, name, email, planType } } = await AuthService.login(payload);
    
    localStorage.setItem('@ConcursoApp:token', token);
    
    try {
      const { data: meData } = await AuthService.getMe();
      setUser(meData);
      localStorage.setItem('@ConcursoApp:user', JSON.stringify(meData));
    } catch (err) {
      const loggedUser = { name, email, planType };
      setUser(loggedUser);
      localStorage.setItem('@ConcursoApp:user', JSON.stringify(loggedUser));
    }
  }

  async function register(payload: any) {
    const { data: { token, name, email, planType } } = await AuthService.register(payload);

    localStorage.setItem('@ConcursoApp:token', token);
    
    try {
      const { data: meData } = await AuthService.getMe();
      setUser(meData);
      localStorage.setItem('@ConcursoApp:user', JSON.stringify(meData));
    } catch (err) {
      const loggedUser = { name, email, planType };
      setUser(loggedUser);
      localStorage.setItem('@ConcursoApp:user', JSON.stringify(loggedUser));
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('@ConcursoApp:user');
    localStorage.removeItem('@ConcursoApp:token');
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
