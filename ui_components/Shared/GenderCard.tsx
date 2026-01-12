import { FC } from "react";

interface GenderCardProps {
  imageSrc: string;
  gender: "male" | "female";
  className?: string;
}

const GenderCard: FC<GenderCardProps> = ({
  imageSrc,
  gender,
  className = ""
}) => {
  const borderColor =
    gender === "male" ? "border-secondary-500" : "border-secondary-600";

  return (
    <div
      className={`rounded-2xl border-4 ${borderColor} overflow-hidden ${className}`}
      style={{
        transition: "transform 0.3s ease"
      }}
    >
      <img src={imageSrc} alt="pet" className="w-full object-cover h-[175px]" />
    </div>
  );
};

export default GenderCard;
