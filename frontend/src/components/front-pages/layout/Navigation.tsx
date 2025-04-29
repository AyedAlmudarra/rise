// Use anchor links for scrolling on the same page
// import { Link, useLocation } from "react-router-dom";

// Updated navigation items for homepage sections
const RiseHomepageNav = [
  {
    menu: "Features",
    link: "#features", // Assumes a section with id="features"
  },
  {
    menu: "Highlights",
    link: "#highlights", // Assumes a section with id="highlights"
  },
  {
    menu: "FAQ",
    link: "#faq", // Assumes a section with id="faq"
  },
  {
    menu: "Get Started",
    link: "#get-started", // Assumes the 'PurchaseTemp' section has id="get-started"
  },
];

const Navigation = () => {
  // Location check is less relevant for same-page scroll links
  // const location = useLocation();
  // const pathname = location.pathname;

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId.substring(1)); // Remove #
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <ul className="flex xl:flex-row flex-col xl:gap-9 gap-6 xl:items-center">
        {RiseHomepageNav.map((item, index) => (
          <li
            key={index}
            // Removed active class logic based on pathname
            className={`rounded-full font-semibold text-15 py-1.5 px-2.5 text-dark dark:text-white hover:text-primary dark:hover:text-primary`}
          >
            {/* Use standard anchor tags for scrolling */}
            <a 
              href={item.link} 
              onClick={(e) => handleScroll(e, item.link)}
              className="flex gap-3 items-center text-primary-ld"
            >
              {item.menu}
              {/* Removed badge logic */}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Navigation;
