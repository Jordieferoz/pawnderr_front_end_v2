import React from "react";

import { images } from "@/utils/images";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="container mx-auto  h-full">{children}</div>
      <div
        className="absolute w-full left-0 top-0 hidden md:block pointer-events-none z-[-1] h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${images.discoverBg.src})` }}
      />
    </div>
  );
}
