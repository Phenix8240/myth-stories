import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const serif = { fontFamily: "'Cormorant Garamond', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif" };
const sans = { fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" };

/* Kala Chakra: time wheel with 12 spokes, rim studs and a lotus hub */
const ChakraIcon = ({ className = "" }) => {
  const spokes = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="50" cy="50" r="46" strokeWidth="3.5" />
      <circle cx="50" cy="50" r="36" strokeWidth="1.5" />
      {spokes.map((a) => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          <line x1="50" y1="21" x2="50" y2="4" strokeWidth="0" />
          <line x1="50" y1="24" x2="50" y2="40" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="9" r="2.6" fill="currentColor" stroke="none" />
        </g>
      ))}
      {/* lotus hub */}
      <g fill="currentColor" stroke="none">
        <path d="M50 30 C56 38 56 46 50 50 C44 46 44 38 50 30Z" />
        <path d="M50 70 C56 62 56 54 50 50 C44 54 44 62 50 70Z" />
        <path d="M30 50 C38 44 46 44 50 50 C46 56 38 56 30 50Z" />
        <path d="M70 50 C62 44 54 44 50 50 C54 56 62 56 70 50Z" />
        <circle cx="50" cy="50" r="4.5" />
      </g>
    </svg>
  );
};

const NAV_ITEMS = [
  { label: "Overview", to: "/" },
  { label: "Periods", section: "#periods" },
  { label: "Battles", section: "#battles" },
  { label: "Traditions", section: "#traditions" },
  { label: "Monuments", section: "#sites" },
  { label: "Mahavidya", to: "/mahavidya" },
  { label: "Full Timeline", to: "/history" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* Lock body scroll while mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Close mobile menu when resizing to desktop */
  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setIsOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollToSection = (sectionId) => {
    const el = document.querySelector(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSectionClick = (sectionId) => {
    setIsOpen(false);
    if (pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 150);
    } else {
      scrollToSection(sectionId);
    }
  };

  const linkStyle = (isActive, isMobile = false) => {
    const base = isMobile
      ? "w-full py-3 text-left text-base font-semibold transition border-b border-[#d4a437]/10"
      : "whitespace-nowrap border-b-2 py-1 text-sm font-semibold tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a437]";
    const state = isActive
      ? "text-[#f1d98f] border-[#d4a437]"
      : `text-[#e8d7a8] hover:text-[#f1d98f] ${isMobile ? "" : "border-transparent"}`;
    return `${base} ${state}`;
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-[#d4a437]/40 bg-[#1a0e05]/95 py-2 shadow-xl backdrop-blur-md"
          : "border-[#d4a437]/20 bg-[#1a0e05]/80 py-3"
      }`}
      style={sans}
    >
      {/* Full-width row: logo hugs left edge, links sit centre-to-right */}
      <div className="flex w-full items-center gap-4 px-3 sm:px-5 lg:px-6">
        {/* Logo - left corner */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a437]"
          aria-label="KalaChakra home"
        >
          <ChakraIcon className="h-9 w-9 text-[#d4a437] sm:h-10 sm:w-10" />
          <span
            className="text-xl font-bold leading-none tracking-wide text-[#f1d98f] sm:text-2xl"
            style={serif}
          >
            KalaChakra
          </span>
        </Link>

        {/* Desktop links: centred in remaining space, CTA at right corner */}
        <div className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => linkStyle(isActive)}
              >
                {item.label}
              </NavLink>
            ) : (
              <button
                key={item.label}
                onClick={() => handleSectionClick(item.section)}
                className={linkStyle(false)}
              >
                {item.label}
              </button>
            )
          )}
        </div>

        <Link
          to="/history"
          className="ml-auto hidden shrink-0 rounded-sm border border-[#d4a437] bg-[#d4a437] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2e1b0c] transition hover:bg-[#f1d98f] focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:block"
        >
          Explore Timeline
        </Link>

        {/* Mobile / tablet toggle - right corner */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="ml-auto p-2 text-[#f1d98f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a437] lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {isOpen ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z" />
            ) : (
              <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile / tablet drawer */}
      {isOpen && (
        <div className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-[#d4a437]/30 bg-[#1a0e05] px-5 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col">
            {NAV_ITEMS.map((item) =>
              item.to ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => linkStyle(isActive, true)}
                >
                  {item.label}
                </NavLink>
              ) : (
                <button
                  key={item.label}
                  onClick={() => handleSectionClick(item.section)}
                  className={linkStyle(false, true)}
                >
                  {item.label}
                </button>
              )
            )}
            <Link
              to="/history"
              className="mt-4 rounded-sm border border-[#d4a437] bg-[#d4a437] px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#2e1b0c] transition hover:bg-[#f1d98f]"
            >
              Explore Timeline
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;