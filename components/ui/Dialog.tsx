import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

function Dialog({ open, onClose, children, title, className }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-50 mx-auto max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-indigo-500/30 bg-[#0b1220] p-6 shadow-2xl",
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 space-y-1.5", className)}>{children}</div>
  );
}

function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-lg font-semibold text-white", className)}>
      {children}
    </h2>
  );
}

function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-gray-400", className)}>{children}</p>
  );
}

export { Dialog, DialogHeader, DialogTitle, DialogDescription };
