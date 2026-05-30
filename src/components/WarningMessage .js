// components/WarningMessage.js
"use client";
import React, { useState } from "react";
import { CiCircleInfo, CiWarning } from "react-icons/ci";

const WarningMessage = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-3 flex justify-center sticky top-[110px] z-40 shadow-lg">
      <div className="flex items-center gap-3 w-full max-w-[1395px]">
        {/* Info Icon */}
        <div className="flex-shrink-0 xl:ml-5">
          <CiCircleInfo className="w-6 h-6 text-yellow-300" />
        </div>

        {/* Warning Text */}
        <div className="flex items-center gap-2  p-2 rounded">

          <p className="text-sm font-medium leading-relaxed">
            <span className="font-bold ">⚠️ WARNING:</span> Scamsters are falsely claiming to represent
            <span className="font-bold"> Ethniz Courture</span>. Do NOT respond to unknown calls. Verify with us only on our official contact number before any business.
          </p>
        </div>

        {/* Close Button */}
        <button
          className="flex-shrink-0 ml-4 text-white hover:text-gray-200 transition-colors duration-200 p-1"
          onClick={() => setVisible(false)}
          aria-label="Close warning message"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WarningMessage;
