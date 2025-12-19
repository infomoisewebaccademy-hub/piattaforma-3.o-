
import React from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Conferma",
  cancelLabel = "Annulla",
  isDestructive = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Overlay con sfocatura */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={!isLoading ? onClose : undefined}
      ></div>

      {/* Contenitore Modale */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header con icona */}
        <div className={`p-6 flex flex-col items-center text-center ${isDestructive ? 'bg-red-50' : 'bg-brand-50'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-600'}`}>
                {isDestructive ? <AlertTriangle className="h-8 w-8" /> : <Check className="h-8 w-8" />}
            </div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
            <button 
                onClick={onClose}
                disabled={isLoading}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
                <X className="h-5 w-5" />
            </button>
        </div>

        {/* Corpo */}
        <div className="p-8 text-center">
            <p className="text-gray-500 leading-relaxed font-medium">
                {message}
            </p>
        </div>

        {/* Footer Azioni */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
            <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="flex-1 px-6 py-3.5 rounded-2xl text-sm font-black text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all uppercase tracking-widest"
            >
                {cancelLabel}
            </button>
            <button
                type="button"
                disabled={isLoading}
                onClick={onConfirm}
                className={`flex-1 px-6 py-3.5 rounded-2xl text-sm font-black text-white shadow-lg transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${
                    isDestructive 
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                    : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20'
                }`}
            >
                {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {confirmLabel}
            </button>
        </div>
      </div>
    </div>
  );
};
