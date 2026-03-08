import Image from "next/image";
import { FC } from "react";

import { images } from "@/utils/images";

interface NoStateProps {
  hideImage?: boolean;
  title?: string;
  desc?: string;
  className?: string;
}

const NoState: FC<NoStateProps> = ({
  hideImage = false,
  title,
  desc,
  className = ""
}) => {
  return (
    <div
      className={`bg-white rounded-[12px] shadow-[0_4px_30px_0_#0000001A] p-[30px] w-[320px] mx-auto flex flex-col items-center justify-center text-center ${className}`}
    >
      {!hideImage && (
        <div className="mb-4">
          <Image
            src={images.pawYellow.src}
            alt={title || "No state"}
            width={50}
            height={44}
            className="max-w-full h-auto object-contain"
          />
        </div>
      )}
      {title && (
        <h3 className="font_fredoka text-2xl font-medium text-dark-grey2 mb-2">
          {title}
        </h3>
      )}
      {desc && <p className="text-base font_fredoka text-dark-grey">{desc}</p>}
    </div>
  );
};

export default NoState;
