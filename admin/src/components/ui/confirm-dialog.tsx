'use client';

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: (value: boolean) => void;
}

interface ConfirmContextValue {
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    message: '',
    title: '确认操作',
    confirmText: '确定',
    cancelText: '取消',
    variant: 'danger',
    resolve: () => {},
  });

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title || '确认操作',
        message: options.message,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        variant: options.variant || 'danger',
        resolve,
      });
    });
  }, []);

  const handleConfirm = () => {
    state.resolve(true);
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    state.resolve(false);
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleCancel}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md glass rounded-2xl p-6 shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-3 rounded-xl ${
                  state.variant === 'danger' 
                    ? 'bg-red-100 dark:bg-red-900/30' 
                    : state.variant === 'warning'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30'
                    : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <AlertTriangle className={`w-6 h-6 ${
                    state.variant === 'danger'
                      ? 'text-red-500'
                      : state.variant === 'warning'
                      ? 'text-yellow-500'
                      : 'text-blue-500'
                  }`} />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {state.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {state.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium"
                >
                  {state.cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 rounded-xl text-white font-medium transition-all ${
                    state.variant === 'danger'
                      ? 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
                      : state.variant === 'warning'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600'
                      : 'bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600'
                  }`}
                >
                  {state.confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}
