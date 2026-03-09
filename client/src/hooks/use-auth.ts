import { create } from 'zustand';

interface AuthStore {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthStore>((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
  
  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
    set({ token });
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    set({ token: null });
  },
  
  isAuthenticated: () => !!get().token,
}));
