"use client";

import React, { useEffect, useState } from "react";

export interface ICustomAvatarProps {
  src: string;
  alt?: string;
  size?: number;
  gender?: "male" | "female";
  type?: "normal" | "countdown";
  durationSeconds?: number;
  onComplete?: () => void;
  name?: string;
  showPlus?: boolean;
  plusIcon?: string;
}

const CustomAvatar: React.FC<ICustomAvatarProps> = ({
  src,
  alt = "avatar",
  size = 80,
  gender = "male",
  type = "normal",
  durationSeconds = 60,
  onComplete,
  name,
  showPlus = false,
  plusIcon
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    if (type !== "countdown" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [type, timeLeft, onComplete]);

  const progress =
    type === "countdown" ? (timeLeft / durationSeconds) * 360 : 360;

  return (
    <div className="inline-flex flex-col items-center gap-1.5 cursor-pointer">
      <div
        className="relative inline-block rounded-full"
        style={{ width: size, height: size }}
      >
        {/* Plus icon badge */}
        {showPlus && plusIcon && (
          <img
            src={plusIcon}
            className="absolute top-1 -right-1 w-[18px] h-[18px] z-20"
            alt="plus"
          />
        )}

        {/* Border gradient */}
        <div className="absolute inset-0 rounded-full">
          {type === "countdown" ? (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(from 0deg, #FFB510 ${progress}deg, rgba(255,181,16,0.2) ${progress}deg)`,
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))"
              }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: gender === "female" ? "#ec4899" : "#3b82f6",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))"
              }}
            />
          )}
        </div>

        {/* Avatar image */}
        <div className="w-full h-full rounded-full overflow-hidden p-1">
          <img
            src={src}
            alt={alt}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>

      {/* Name label */}
      {name && (
        <p className="tp_small_medium text-neutral-white text-center">{name}</p>
      )}
    </div>
  );
};

export default CustomAvatar;
