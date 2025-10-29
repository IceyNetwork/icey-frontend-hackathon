import React from "react";
import { animationDuration } from "../../consts/static";

interface ModalWrapperProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  show,
  onClose,
  children,
  className = "",
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-all"
      style={{
        backgroundColor: show ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
        backdropFilter: show ? "blur(12px)" : "blur(0px)",
        transitionDuration: `${animationDuration}ms`,
      }}
      onClick={onClose}
    >
      <div
        className={`relative backdrop-blur-2xl bg-linear-to-br from-cyan-950/60 to-blue-950/40 p-8 rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transition-all ${className}`}
        style={{
          opacity: show ? 1 : 0,
          transform: show
            ? "scale(1) translateY(0)"
            : "scale(0.9) translateY(20px)",
          transitionDuration: `${animationDuration}ms`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
