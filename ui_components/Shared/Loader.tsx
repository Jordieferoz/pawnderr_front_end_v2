import { FC } from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const Loader: FC<LoaderProps> = ({
  size = "md",
  text = "Loading...",
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4"
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <div
        className={`${sizeClasses[size]} border-blue border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-light-grey2 text-base md:text-lg">{text}</p>}
    </div>
  );
};

export default Loader;
