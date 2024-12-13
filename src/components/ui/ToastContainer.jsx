import React from 'react';
import useToastStore from '@/store/toast/useToastStore';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded shadow-lg text-white ${
            toast.type === 'success'
              ? 'bg-green-500'
              : toast.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
          }`}
        >
          <span>{toast.message}</span>
          <button
            className="ml-4 text-sm underline"
            onClick={() => removeToast(toast.id)}
          >
            닫기
          </button>
        </div>
      ))}
    </div>
  );
};
