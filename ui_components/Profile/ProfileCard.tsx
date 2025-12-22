import { FC } from "react";

import { IProfileCardProps } from "./types";

const ProfileCard: FC<IProfileCardProps> = ({
  name,
  gender,
  age,
  breed,
  location,
  image
}) => {
  return (
    <div className="bg-white p-4 shadow-[0px_4px_10.6px_0px_#0000001A] rounded-xl">
      <img src={image} className="w-full rounded-xl mb-7.5" alt="image" />
      <h3 className="display4_medium text-dark-grey2 mb-2">
        {name}{" "}
        <span className="body_large_medium">
          {gender}, {age} Years
        </span>
      </h3>
      <p className="text-grey-700 heading3 leading-snug pb-4">
        {breed}, {location}
      </p>
    </div>
  );
};

export default ProfileCard;
