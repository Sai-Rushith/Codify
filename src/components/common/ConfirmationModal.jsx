// ConfirmationModal.jsx
import React from "react";
import { motion } from "framer-motion";
import IconBtn from "./IconBtn"

/**
 * Usage:
 *  <ConfirmationModal modalData={modalData} />
 * where modalData is either null (hidden) or an object:
 * {
 *   text1: "Title",
 *   text2: "Description",
 *   btn1Handler: () => { ... },    // cancel
 *   btn1Text: "Cancel",
 *   btn2Handler: () => { ... },    // confirm
 *   btn2Text: "Logout"
 * }
 */
export default function ConfirmationModal({ modalData }) {
  // if modalData is falsy -> don't render
  if (!modalData) return null;

  

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-[1000] grid place-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={() => modalData?.btn1Handler?.()}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.16 }}
        className="w-11/12 max-w-md rounded-xl border border-white/10 bg-gradient-to-b from-gray-50 to-white shadow-2xl"
        style={{ backdropFilter: "blur(6px)" }}
      >
        {/* header */}
        <div className="px-6 py-5 border-b border-black/8 flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black text-white grid place-items-center font-bold">
            
          </div>
          <div>
            <h3 id="confirm-title" className="text-lg font-semibold text-white">
              {modalData?.text1 || "Are you sure?"}
            </h3>
            <p className="mt-1 text-sm text-white">
              {modalData?.text2 || "This action cannot be undone."}
            </p>
          </div>
        </div>

        {/* body / actions */}
        <div className="px-6 py-5 flex items-center gap-3 justify-end">
          {/* Cancel button (light) */}
          <button
            onClick={modalData?.btn1Handler}
            className="rounded-md px-4 py-2 text-sm font-semibold bg-white text-black border border-black/5 hover:shadow"
          >
            {modalData?.btn1Text || "Cancel"}
          </button>

          {/* Confirm button (dark) */}
          <button
            onClick={modalData?.btn2Handler}
            className="rounded-md px-4 py-2 text-sm font-semibold bg-black text-white hover:opacity-95 shadow-sm"
          >
            {modalData?.btn2Text || "Confirm"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
