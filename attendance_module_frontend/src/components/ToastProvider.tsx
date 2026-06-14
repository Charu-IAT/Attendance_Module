import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';
import './Toast.css';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
  duration?: number;
  isRemoving?: boolean;
}

export interface ToastContextType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  toast: (message: string, type: 'success' | 'error', duration?: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const { id, message, type, duration = 4000, isRemoving } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`toast-item ${type} ${isRemoving ? 'removing' : ''}`} role="alert">
      <div className="toast-icon">
        {type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
      </div>
      <div className="toast-content">
        <h4 className="toast-title">{type === 'success' ? 'Success' : 'Error'}</h4>
        <p className="toast-message">{message}</p>
      </div>
      <button type="button" className="toast-close" onClick={() => onClose(id)} aria-label="Close toast">
        <FiX />
      </button>
      <div
        className="toast-progress"
        style={{ animation: `toast-progress ${duration}ms linear forwards` }}
      />
    </div>
  );
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isRemoving: true } : t))
    );
    // After animation ends, remove from state array
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300); // matches the 0.3s transition time in Toast.css
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    addToast(message, 'success', duration);
  }, [addToast]);

  const error = useCallback((message: string, duration?: number) => {
    addToast(message, 'error', duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, toast: addToast }}>
      {children}
      {createPortal(
        <div className="toast-container" id="toast-root">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onClose={removeToast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
