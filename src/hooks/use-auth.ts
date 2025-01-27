import { useAuthStore } from '@/stores/auth-store';

export const useAuth = () => {
  const { token, user, setAuth, clearAuth } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      // Mock API call - replace with your actual API endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      setAuth(data.token, { id: data.id, email, name: data.name });
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    clearAuth();
  };

  return {
    isAuthenticated: !!token,
    user,
    login,
    logout,
  };
};