import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || null);
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || null);

  const login = useCallback((data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('userName', data.userName);
    setToken(data.token);
    setRole(data.role);
    setUserId(data.userId);
    setUserName(data.userName);
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUserId(null);
    setUserName(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, userId, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
