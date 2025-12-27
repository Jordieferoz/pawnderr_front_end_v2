"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

const Header = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/sign-in");
  };
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-[0px_4px_19.1px_7px_#0000000A] z-40 backdrop-blur-2xl">
      <div className="container mx-auto px-4 md:px-0 py-4 md:py-6 flex items-center justify-between">
        <Link href={"/"}>
          <img src={images.logoHorizontal.src} alt="logo" className="h-13" />
        </Link>
        <div className="flex items-center gap-8 md:gap-12 justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/"
              className="menu_link_medium text-grey-900 hover:text-blue-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#"
              className="menu_link_medium text-grey-900 hover:text-blue-600 transition-colors"
            >
              Why PAWnderr
            </Link>
            <Link
              href="#"
              className="menu_link_medium text-grey-900 hover:text-blue-600 transition-colors"
            >
              Reviews
            </Link>
            <Link
              href="/sign-up"
              className="menu_link_medium text-grey-900 hover:text-blue-600 transition-colors"
            >
              Sign Up
            </Link>
          </nav>
          <Button className="font-medium px-12" onClick={handleLogin}>
            Log In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
