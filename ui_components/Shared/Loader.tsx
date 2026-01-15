"use client";

import React from "react";

export interface LoaderProps {
  size?: number;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 40, className }) => {
  return (
    <div
      className={`rounded-full border-4 border-primary-500 border-t-transparent animate-spin ${
        className ?? ""
      }`}
      style={{ width: size, height: size }}
    />
  );
};

export default Loader;
