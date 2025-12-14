"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { cardsData, tabs } from "@/constants";
import { openFilterModal } from "@/store/modalSlice";
import { images } from "@/utils/images";

import ActivityCard from "./ActivityCard";

const Activities: FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState("likes-me");

  const handleOpenFilter = () => {
    dispatch(openFilterModal());
  };

  const isSubscribed = false;

  return (
    <div className="activities_wrapper">
      <div className="common_container">
        <div className="flex items-center my-4 justify-between mb-7">
          <div className="flex items-center gap-3">
            <img
              onClick={() => router.back()}
              className="w-9 h-9"
              src={images.backBtn.src}
            />
            <h4 className="display4_medium text-accent-900 flex gap-2 items-center">
              Activities
              <img src={images.pawnderrPlus.src} className="w-8 h-8" />
            </h4>
          </div>
        </div>
      </div>

      <div className="my-3 flex items-center gap-4.5">
        <div className="pl-8 flex-shrink-0">
          <img
            className="cursor-pointer w-10"
            src={images.filterIcon.src}
            onClick={handleOpenFilter}
          />
        </div>

        <ul className="flex items-center hide-scrollbar gap-2 flex-nowrap overflow-x-auto snap-x snap-mandatory pr-[var(--container-padding,1rem)]">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex gap-2 shrink-0 items-center rounded-full body_regular py-2 px-3 cursor-pointer transition-colors ${
                selectedTab === tab.id
                  ? "bg-blue text-white"
                  : "border border-neutral-white text-light-grey2"
              }`}
            >
              {tab.label}
              <span
                className={`h-6 w-6 rounded-full flex items-center justify-center ${
                  selectedTab === tab.id
                    ? "bg-white text-blue"
                    : "bg-grey-100 text-grey2-700"
                }`}
              >
                {tab.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative">
        <ActivityCard
          cards={!isSubscribed ? [cardsData?.[0] ?? {}] : cardsData}
          className={`${!isSubscribed ? "" : ""}`}
        />
        {!isSubscribed && (
          <div className="absolute top-0 backdrop-blur-lg w-full bg-white/80 h-[550px] flex items-center justify-center">
            <div className="text-center">
              <h4 className="display2_medium text-accent-900">
                Unlock the Fun
              </h4>
              <p className="heading1_medium text-accent-900 mb-5">
                See Your Profile viewers
              </p>
              <p className="heading4 text-dark-grey mb-12">
                With Premium, your pet doesn’t just <br /> match… they mingle!
                Gain full access to <br /> the Activities Page
              </p>
              <Button className="w-[calc(100%-72px)]">Try PAWNderr+</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
