"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { images } from "@/utils/images";

const Header = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogin = () => {
    router.push("/sign-in");
  };

  const menuItems = [
    { label: "How It Works", href: "/" },
    { label: "Why PAWnderr", href: "#" },
    { label: "Reviews", href: "#" },
    { label: "Sign Up", href: "/sign-up" }
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-[0px_4px_19.1px_7px_#0000000A] z-40 backdrop-blur-2xl">
      <div className="container mx-auto px-4 md:px-0 py-4 md:py-6 flex items-center justify-between">
        <Link href={"/"}>
          <img src={images.logoHorizontal.src} alt="logo" className="h-13" />
        </Link>

        <div className="flex items-center gap-8 md:gap-12 justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="menu_link_medium text-grey-900 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Login Button */}
          <Button
            className="hidden md:flex font-medium px-12"
            onClick={handleLogin}
          >
            Log In
          </Button>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 mt-8 px-5 h-full relative">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="menu_link_medium text-grey-900 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  className="font-medium w-full mt-4"
                  onClick={() => {
                    setOpen(false);
                    handleLogin();
                  }}
                >
                  Log In
                </Button>
                <ul className="flex items-center gap-5 justify-center absolute bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)]">
                  <li>
                    <Link href={"/"} target="_blank">
                      <img
                        src={images.facebookGrey.src}
                        alt="facebook"
                        className="w-10"
                      />
                    </Link>
                  </li>
                  <li>
                    <Link href={"/"} target="_blank">
                      <img
                        src={images.twitter.src}
                        alt="twitter"
                        className="w-10"
                      />
                    </Link>
                  </li>
                  <li>
                    <Link href={"/"} target="_blank">
                      <img
                        src={images.instagram.src}
                        alt="instagram"
                        className="w-10"
                      />
                    </Link>
                  </li>
                  <li>
                    <Link href={"/"} target="_blank">
                      <img
                        src={images.linkedin.src}
                        alt="linkedin"
                        className="w-10"
                      />
                    </Link>
                  </li>
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
