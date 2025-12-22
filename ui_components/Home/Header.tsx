import { Button } from "@/components/ui/button";
import { images } from "@/utils/images";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-[0px_4px_19.1px_7px_#0000000A] z-40 backdrop-blur-2xl">
      <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
        <img src={images.logoBig.src} alt="logo" className="h-13" />
        <div className="flex items-center gap-8 md:gap-12 justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              href="#"
              className="menu_link_medium text-grey-900 hover:text-blue-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#"
              className="menu_link_medium text-grey-900 hover:text-blue-600 transition-colors"
            >
              Why PAWnderr
            </a>
            <a
              href="#"
              className="menu_link_medium text-grey-900 hover:text-blue-600 transition-colors"
            >
              Reviews
            </a>
            <a
              href="#"
              className="menu_link_medium text-grey-900 hover:text-blue-600 transition-colors"
            >
              Sign Up
            </a>
          </nav>
          <Button className="font-medium px-12">Log In</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
