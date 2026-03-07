import { FC } from "react";

import { getGenderColor } from "@/utils";
import { IInfoCardProps } from "./types";

const InfoCard: FC<IInfoCardProps> = ({
  title,
  type,
  desc,
  list = [],
  image,
  className,
  imagePosition = "top",
  gender
}) => {
  const borderColor = getGenderColor(gender || "");
  const imageElement = image && (
    <img src={image} className="w-full rounded-xl grow basis-0" alt="image" />
  );

  return (
    <div
      className="bg-white p-4 shadow-[0px_4px_10.6px_0px_#0000001A] border-2 rounded-xl"
      style={{ borderColor }}
    >
      <div className="flex flex-col gap-4">
        {imagePosition === "top" && imageElement}
        <div className="grow basis-0">
          <h2 className={`heading4 text-dark-grey mb-3 ${className ?? ""}`}>
            {title}
          </h2>

          {type === "desc" && (
            <p className="text-dark-black text-2xl font_fredoka font-medium pb-4">
              {desc}
            </p>
          )}

          {type === "list" && (
            <div className="flex flex-col gap-4 pt-4.5 pb-4">
              {list.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-3 items-start w-full"
                >
                  <p className="body_large_medium text-grey-500">{item.left}</p>
                  <p className="body_large_medium text-dark-grey2 text-right">
                    {item.right}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        {imagePosition === "bottom" && imageElement}
      </div>
    </div>
  );
};

export default InfoCard;
