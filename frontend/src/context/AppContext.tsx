import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'volunteer' | 'ngo' | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activePath: string;
  navigate: (path: string) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  selectedOpportunityId: string | null;
  setSelectedOpportunityId: (id: string | null) => void;
  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('volunteer');
  const [activePath, setActivePath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      setActivePath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setActivePath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activePath,
        navigate,
        toasts,
        addToast,
        removeToast,
        selectedOpportunityId,
        setSelectedOpportunityId,
        isApplyModalOpen,
        setIsApplyModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
