import Link from "next/link";

import { images } from "@/utils/images";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-20 md:pt-30 relative">
      <div className="container mx-auto flex items-center flex-col justify-center">
        <div className="mx-auto text-center ">
          <Link href={"/"} className="mb-2 inline-block">
            <img
              src={images.logoBig.src}
              alt="logo"
              className="h-[180px] mx-auto"
            />
          </Link>
          <ul className="flex items-center gap-3 justify-center mb-7 md:mb-20">
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
                <img src={images.twitter.src} alt="twitter" className="w-10" />
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

          <div className="flex gap-3 items-center text-light-grey2 font-medium text-base md:text-2xl font_fredoka mb-8">
            <Link href={"/"}>Privacy Policy</Link> •
            <Link href={"/"}> Terms of Service</Link> •
            <Link href={"/"}> Safety Tips</Link>
          </div>
          <p className="text-xs text-light-grey2 mb-10">
            © {currentYear} PAWnderr | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
