// IconBtn.jsx
import React from "react";

export default function IconBtn({ onClick, text, icon: Icon, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-shadow shadow-sm
        bg-white text-black hover:shadow-md ${className}`}
    >
      {Icon && <span className="w-4 h-4">{typeof Icon === "function" ? <Icon /> : Icon}</span>}
      <span>{text}</span>
    </button>
  );
}
