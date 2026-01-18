import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));

      setUser({
        id: payload.id,
        username: payload.sub,
        role: payload.role,
        token
      });
    }

    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('access_token', token);

    const payload = JSON.parse(atob(token.split('.')[1]));

    setUser({
      id: payload.id,
      username: payload.sub,
      role: payload.role,
      token
    });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
