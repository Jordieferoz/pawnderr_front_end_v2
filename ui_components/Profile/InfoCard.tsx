import { FC } from "react";
import { IInfoCardProps } from "./types";

const InfoCard: FC<IInfoCardProps> = ({
  title,
  type,
  desc,
  list = [],
  image,
}) => {
  return (
    <div className="bg-white p-4 shadow-[0px_4px_10.6px_0px_#0000001A] rounded-xl">
      <img src={image} className="w-full rounded-xl mb-7.5" />

      <h2 className="heading2_medium text-dark-grey2 mb-2 border-b pb-4.5 border-dashed border-[#9B9B9B6E]">
        {title}
      </h2>

      {type === "desc" && (
        <p className="text-grey-600 heading4 leading-snug pt-4.5 pb-4">
          {desc}
        </p>
      )}

      {type === "list" && (
        <div className="flex flex-col gap-4 pt-4.5 pb-4">
          {list.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-start w-full"
            >
              <p className="body_large_medium text-grey-700">{item.left}</p>
              <p className="body_large_medium text-dark-grey2 text-right">
                {item.right}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfoCard;
