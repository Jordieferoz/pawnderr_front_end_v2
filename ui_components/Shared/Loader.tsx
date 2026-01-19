"use client";

import React from "react";

export interface LoaderProps {
  size?: number;
  className?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 40, className, text }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`rounded-full border-4 border-primary-500 border-t-transparent animate-spin ${className ?? ""
          }`}
        style={{ width: size, height: size }}
      />
      {text && <p className="text-gray-500">{text}</p>}
    </div>
  );
};

export default Loader;
