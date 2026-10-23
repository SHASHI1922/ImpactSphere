import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start space-x-3 transition-all animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-white border-primaryGreen text-stone-900'
              : toast.type === 'error'
              ? 'bg-white border-red-500 text-stone-900'
              : 'bg-forest-900 border-forest-700 text-warmIvory'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-primaryGreen" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-limeAccent" />}
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-bold">{toast.title}</h5>
            {toast.message && <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{toast.message}</p>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-stone-400 hover:text-stone-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
