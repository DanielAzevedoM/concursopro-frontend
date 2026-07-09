import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertModalProps {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function AlertModal({
  isOpen,
  type,
  title,
  message,
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
}: AlertModalProps) {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: <CheckCircle className="w-10 h-10 text-emerald-500" />,
      bg: "bg-emerald-100",
      buttonColor: "bg-primary-800 hover:bg-primary-900",
    },
    error: {
      icon: <XCircle className="w-10 h-10 text-red-500" />,
      bg: "bg-red-100",
      buttonColor: "bg-primary-800 hover:bg-primary-900",
    },
    warning: {
      icon: <AlertTriangle className="w-10 h-10 text-amber-500" />,
      bg: "bg-amber-100",
      buttonColor: "bg-primary-800 hover:bg-primary-900",
    },
    info: {
      icon: <Info className="w-10 h-10 text-blue-500" />,
      bg: "bg-blue-100",
      buttonColor: "bg-primary-800 hover:bg-primary-900",
    },
  };

  const { icon, bg, buttonColor } = config[type];

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-200 relative">
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        <div
          className={`w-20 h-20 ${bg} rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner`}
        >
          {icon}
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-500 mb-8 font-medium leading-relaxed">
          {message}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className={`w-full text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 ${buttonColor}`}
          >
            {confirmText}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full text-gray-500 hover:text-gray-800 font-bold py-3 transition-colors"
            >
              {cancelText || "Cancelar"}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
