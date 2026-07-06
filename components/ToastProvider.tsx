import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircleIcon, AlertTriangleIcon, InfoIcon, X } from './icons';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const TOAST_DURATION = 4000; // 4 seconds

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, TOAST_DURATION);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-4 right-4 z-[100] w-full max-w-sm space-y-3">
            {toasts.map(toast => (
                <ToastMessage key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const toastConfig = {
    success: {
        Icon: CheckCircleIcon,
        className: 'bg-green-500/20 border-green-500/30 text-green-300',
        iconClassName: 'text-green-400'
    },
    error: {
        Icon: AlertTriangleIcon,
        className: 'bg-red-500/20 border-red-500/30 text-red-300',
        iconClassName: 'text-red-400'
    },
    info: {
        Icon: InfoIcon,
        className: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
        iconClassName: 'text-indigo-400'
    }
};

const ToastMessage: React.FC<{ toast: Toast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
    const { Icon, className, iconClassName } = toastConfig[toast.type];

    return (
        <div className={`relative flex items-start gap-4 p-4 pr-10 rounded-lg border backdrop-blur-sm shadow-lg animate-toast-in ${className}`}>
            <Icon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${iconClassName}`} />
            <p className="text-sm font-medium text-slate-100">{toast.message}</p>
            <button onClick={onDismiss} className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
                <span className="sr-only">Dismiss</span>
            </button>
        </div>
    );
};