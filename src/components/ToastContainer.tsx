import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-[#00eefc] shrink-0" />;
        let borderClass = 'border-[#00eefc]/40';
        let bgClass = 'bg-[#12131a]/95';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-[#3fdeb7] shrink-0" />;
          borderClass = 'border-[#3fdeb7]/40';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-[#ff5545] shrink-0" />;
          borderClass = 'border-[#ff5545]/50';
          bgClass = 'bg-[#181116]/95';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-[#ff9f1c] shrink-0" />;
          borderClass = 'border-[#ff9f1c]/40';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border ${borderClass} ${bgClass} backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-right-4 fade-in`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-headline text-sm font-bold text-white tracking-wide">
                {toast.title}
              </div>
              <div className="font-body text-xs text-[#9ba0b4] mt-0.5 leading-relaxed break-words">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9ba0b4] hover:text-white transition-colors p-1 rounded-md"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
