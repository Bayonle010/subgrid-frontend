"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toast } from "./toast";
import type {
  ToastContextValue,
  ToastItem,
  ToastOptions,
  ToastPlacement,
} from "./toast.types";

const ToastContext = createContext<ToastContextValue | null>(null);

const PLACEMENT_CLASSES: Record<ToastPlacement, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
};

interface ToastProviderProps {
  children: React.ReactNode;
  defaultPlacement?: ToastPlacement;
}

export function ToastProvider({
  children,
  defaultPlacement = "top-right",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((options: ToastOptions): string => {
    const id = `toast-${++counter.current}`;
    setToasts((prev) => [...prev, { id, ...options }]);
    return id;
  }, []);

  const value = useMemo(
    () => ({ addToast, removeToast }),
    [addToast, removeToast]
  );

  const grouped = useMemo(() => {
    const map = new Map<ToastPlacement, ToastItem[]>();
    for (const toast of toasts) {
      const p = toast.placement ?? defaultPlacement;
      if (!map.has(p)) map.set(p, []);
      map.get(p)!.push(toast);
    }
    return map;
  }, [toasts, defaultPlacement]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof window !== "undefined" &&
        createPortal(
          <>
            {Array.from(grouped.entries()).map(([placement, group]) => (
              <div
                key={placement}
                className={`fixed z-[9999] flex flex-col gap-3 pointer-events-none ${PLACEMENT_CLASSES[placement]}`}
              >
                <AnimatePresence mode="sync">
                  {group.map((toast) => (
                    <motion.div key={toast.id} className="pointer-events-auto">
                      <Toast
                        toast={toast}
                        placement={placement}
                        onRemove={removeToast}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
