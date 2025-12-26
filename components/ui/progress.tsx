"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import * as ProgressPrimitive from "@radix-ui/react-progress";

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
  variant?: "linear" | "circular";
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  baseColor?: string;
  highlightColor?: string;
}

function Progress({
  className,
  value = 0,
  variant = "linear",
  size = 120,
  strokeWidth = 8,
  showValue = false,
  baseColor = "#e5e7eb", // Default gray color
  highlightColor = "#3b82f6", // Default blue color
  ...props
}: ProgressProps) {
  // Check if color is a hex/rgb value or Tailwind class
  const isHexColor = (color: string) =>
    color.startsWith("#") || color.startsWith("rgb");

  if (variant === "circular") {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div
        className={cn(
          "relative inline-flex items-center justify-center",
          className
        )}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={isHexColor(baseColor) ? undefined : baseColor}
            stroke={isHexColor(baseColor) ? baseColor : undefined}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={cn(
              isHexColor(highlightColor) ? undefined : highlightColor,
              "transition-all duration-300 ease-in-out"
            )}
            stroke={isHexColor(highlightColor) ? highlightColor : undefined}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {showValue && (
          <span className="absolute text-sm font-semibold">
            {Math.round(value)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        !isHexColor(baseColor) && baseColor,
        className
      )}
      style={isHexColor(baseColor) ? { backgroundColor: baseColor } : undefined}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          !isHexColor(highlightColor) && highlightColor,
          "rounded-3xl h-full w-full flex-1 transition-all"
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          ...(isHexColor(highlightColor)
            ? { backgroundColor: highlightColor }
            : {})
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
