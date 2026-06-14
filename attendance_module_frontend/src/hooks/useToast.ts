import { useContext } from 'react';
import { ToastContext, ToastContextType } from '../components/ToastProvider';

/**
 * Custom hook to show success and error toast notifications.
 * Must be used inside a ToastProvider component.
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
