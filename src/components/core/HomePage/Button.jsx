import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`
          relative overflow-hidden text-center text-[13px] sm:text-[16px] px-8 py-4 rounded-xl font-bold
          ${
            active 
              ? "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-lg shadow-purple-500/30" 
              : "bg-gradient-to-r from-slate-800 to-slate-900 text-white border border-slate-700 shadow-lg shadow-slate-900/50"
          }
          hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40
          active:scale-95
          transition-all duration-300 ease-out
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
          before:translate-x-[-100%] before:transition-transform before:duration-700
          hover:before:translate-x-[100%]
          group cursor-pointer
        `}
      >
        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
          {children}
        </span>
        
        {/* Animated background glow */}
        <div className={`
          absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${active 
            ? "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] blur-sm" 
            : "bg-gradient-to-r from-purple-600 to-pink-600 blur-sm"
          }
          -z-10 scale-110
        `}></div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
      </div>
    </Link>
  );
};

export default Button;