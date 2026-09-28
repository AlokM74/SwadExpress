import { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useNavigate } from "react-router-dom";

const supportLinks = [
  { label: "Help Center", href: "/my-profile/support" },
  { label: "Contact Us", href: "mailto:support.swadexpress@gmail.com" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/alokm74",
    Icon: InstagramIcon,
  },
  {
    label: "GitHub",
    href: "https://github.com/alokm74",
    Icon: GitHubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alok-pradhan-m74",
    Icon: LinkedInIcon,
  },
];

const Footer = () => {
  const [showTopButton, setShowTopButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setShowTopButton(window.scrollY > 300);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFooterAction = (href) => {
    if (href.startsWith("mailto:")) {
      window.open(href, "_self");
    } else if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      navigate(href);
    }
  };

  return (
    <footer className="relative mt-10! border-t border-[#2a2a2a] bg-[#121212] text-white">
      
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red-700/70 to-transparent" />

      <div className="mx-auto max-w-7xl px-5! py-10! sm:px-6! lg:px-10! lg:py-12!">
        <div className="grid grid-cols-1 gap-10! sm:grid-cols-2 lg:grid-cols-3 lg:gap-14!">
          
          <div className="sm:col-span-2 lg:col-span-1">
            <button
              type="button"
              onClick={goToTop}
              className="inline-flex items-center cursor-pointer gap-2! rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
              aria-label="Swad Express home"
            >
              <img
                src="/src/assets/logo2.png"
                alt=""
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
              />
              <span className="text-2xl font-bold">
                Swad<span className="text-red-400">Express</span>
              </span>
            </button>

            <p className="mt-4! max-w-sm text-sm leading-6 text-gray-400">
              Hot, fresh food from the restaurants you love, delivered to your
              door.
            </p>
          </div>

          
          <nav aria-label="Customer support">
            <h3 className="text-base font-semibold text-white">
              Customer Support
            </h3>

            <ul className="mt-4! space-y-3! text-sm text-gray-400">
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => handleFooterAction(href)}
                    className="inline-block rounded transition duration-200 hover:translate-x-1 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 motion-reduce:transition-none motion-reduce:hover:translate-x-0"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          
          <div>
            <h3 className="text-base font-semibold text-white">
              Connect With Us
            </h3>

            <p className="mt-4! max-w-md text-sm leading-6 text-gray-400">
              Follow SwadExpress for updates, offers and delicious food
              inspiration.
            </p>

            <div className="mt-5! flex flex-wrap items-center gap-3!">
              {socialLinks.map(({ label, href, Icon }) => (
                <button
                  type="button"
                  key={label}
                  aria-label={label}
                  title={label}
                  onClick={() => handleFooterAction(href)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#333] bg-[#1b1b1b] text-gray-300 transition duration-200 hover:-translate-y-0.5 hover:border-red-500 hover:bg-[#7a1f1f] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <Icon fontSize="small" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="my-8! border-t border-[#292929]" />

        <div className="flex flex-col items-center justify-between gap-2! text-center sm:flex-row sm:text-left">
          <p className="text-xs text-gray-500 sm:text-sm">
            © {new Date().getFullYear()} SwadExpress. All rights reserved.
          </p>

          <p className="text-xs text-gray-500 sm:text-sm">
            Made with <span className="text-red-400">♥</span> for food lovers.
          </p>
        </div>
      </div>

      
      <button
        type="button"
        onClick={goToTop}
        aria-label="Go to top"
        title="Go to top"
        aria-hidden={!showTopButton}
        tabIndex={showTopButton ? 0 : -1}
        className={`fixed bottom-5! right-5! z-50 flex h-11 w-11 items-center justify-center rounded-full border border-red-500/40 bg-[#7a1f1f] text-white shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:bg-[#922626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 motion-reduce:transition-none sm:bottom-7! sm:right-7! sm:h-12 sm:w-12 ${
          showTopButton
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <KeyboardArrowUpIcon />
      </button>
    </footer>
  );
};

export default Footer;
