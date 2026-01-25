// ============================================
// VIBE & VALUE - Toast Notification Component
// ============================================

"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "achievement";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

let toastListeners: ((toast: Toast) => void)[] = [];
let toastIdCounter = 0;

export function showToast(toast: Omit<Toast, "id">) {
  const id = `toast-${toastIdCounter++}`;
  const fullToast: Toast = { ...toast, id };
  toastListeners.forEach((listener) => listener(fullToast));
  return id;
}

export function showAchievement(message: string) {
  return showToast({ type: "achievement", message, duration: 5000 });
}

export function showSuccess(message: string) {
  return showToast({ type: "success", message, duration: 3000 });
}

export function showError(message: string) {
  return showToast({ type: "error", message, duration: 4000 });
}

export function showInfo(message: string) {
  return showToast({ type: "info", message, duration: 3000 });
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);

      if (toast.duration !== 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, toast.duration || 3000);
      }
    };

    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const styles = {
    success:
      "bg-earth-green-500 text-white border-earth-green-600",
    error: "bg-vibrant-orange-500 text-white border-vibrant-orange-600",
    info: "bg-blue-500 text-white border-blue-600",
    achievement:
      "bg-gradient-to-r from-vibrant-orange-500 to-earth-green-500 text-white border-transparent",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    achievement: "🏆",
  };

  return (
    <div
      className={`
        pointer-events-auto min-w-[300px] max-w-md p-4 rounded-2xl
        border-2 shadow-lg backdrop-blur-sm
        ${styles[toast.type]}
        animate-slide-in-right
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{icons[toast.type]}</span>
        <p className="flex-1 font-medium">{toast.message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
