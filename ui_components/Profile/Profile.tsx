"use client";

import { images } from "@/utils/images";
import { useRouter } from "next/navigation";
import { FC } from "react";

import { InfoCard, ProfileCard } from ".";

const Profile: FC = () => {
  const router = useRouter();

  const profileData = {
    name: "Jake",
    gender: "Male" as const,
    age: 2,
    breed: "Pug",
    location: "Gurugram",
    image: images.doggo1.src,
  };

  return (
    <div className="profile_wrapper common_container">
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <img
            onClick={() => router.back()}
            className="w-10 h-10"
            src={images.backBtn.src}
          />
          <h4 className="display4_medium my-4">Profile</h4>
        </div>
        <img
          className="cursor-pointer"
          onClick={() => router.push("/profile/edit")}
          src={images.editIcon.src}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-7">
        <div className="md:col-span-4 md:order-2">
          <ProfileCard {...profileData} />
        </div>
        <div className="md:col-span-8 md:order-1 flex flex-col gap-7.5">
          <InfoCard
            type="desc"
            title="Bio (aka Bark-o-graphy):"
            image={images.doggo2.src}
            desc={
              "Certified couch potato with a PhD in snoring. Jake lives for belly rubs, surprise snacks, and dramatic sighs. He may be small, but his attitude? Big dog energy. Looking for a cuddle buddy who doesn’t mind the occasional zoomie outburst."
            }
            list={[]}
          />
          <InfoCard
            type="list"
            title="Floof’s Story:"
            image={images.doggo3.src}
            list={[
              { left: "Nickname", right: "Jakey" },
              {
                left: "Favourite Activities",
                right: "Fetch, Cuddles, Digging",
              },
            ]}
            desc={""}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
