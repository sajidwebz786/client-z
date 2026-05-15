import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import api from '../api/axios';

const AuthContext = createContext(null);

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const getStoredAuth = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  if (token && isTokenValid(token)) {
    try {
      const user = userStr ? JSON.parse(userStr) : jwtDecode(token);
      return { token, user };
    } catch {
      return { token: null, user: null };
    }
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { token: null, user: null };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredAuth();
    setUser(stored.user);
    setToken(stored.token);
    setLoading(false);
  }, []);

  const saveAuth = useCallback((newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: authToken, user: userData } = response.data;
      saveAuth(authToken, userData);
      toast.success('Login successful!');
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [saveAuth]);

  const register = useCallback(async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token: authToken, user: newUser } = response.data;
      saveAuth(authToken, newUser);
      toast.success('Registration successful!');
      return { success: true, user: newUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [saveAuth]);

  const googleLogin = useCallback(async (googleToken) => {
    try {
      const response = await api.post('/auth/google', { token: googleToken });
      const { token: authToken, user: userData } = response.data;
      saveAuth(authToken, userData);
      toast.success('Login successful!');
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Google login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [saveAuth]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (logoutError) {
      console.error('Logout API error:', logoutError);
    } finally {
      clearAuth();
      toast.info('Logged out successfully');
    }
  }, [clearAuth]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      const updatedUser = response.data.user || response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Profile updated!');
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
