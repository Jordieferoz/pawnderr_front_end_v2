import { getGenderColor } from "@/utils";
import { FC } from "react";

interface IImageCardProps {
  image?: string;
  gender?: string;
}

const ImageCard: FC<IImageCardProps> = ({ image, gender }) => {
  if (!image) return null;
  const borderColor = getGenderColor(gender || "");

  return (
    <div
      className="bg-white p-4 shadow-[0px_4px_10.6px_0px_#0000001A] border-2 rounded-xl"
      style={{ borderColor }}
    >
      <img src={image} className="w-full rounded-xl" alt="gallery" />
    </div>
  );
};

export default ImageCard;
