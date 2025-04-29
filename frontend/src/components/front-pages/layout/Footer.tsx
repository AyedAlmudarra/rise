// import { Tooltip } from "flowbite-react"; // Temporarily removed as part of commenting out social icons
import { Link } from "react-router-dom";
import Logo from "@/layouts/full/shared/logo/Logo";
// import linkedin from "@/assets/images/front-pages/background/linkedin.svg"; // Placeholder for LinkedIn - Commented out
// import instagram from "@/assets/images/front-pages/background/instagram.svg"


export const Footer = () => {
  const riseLinksCompany = [
    {
      key: "home",
      title: "Home",
      link: "/",
    },
    {
      key: "about",
      title: "About RISE",
      link: "/about",
    },
    {
      key: "contact",
      title: "Contact Us",
      link: "/app/help/contact",
    },
  ];
  const riseLinksStartups = [
    {
      key: "startup-register",
      title: "Register as Startup",
      link: "/auth/register/startup",
    },
    {
      key: "startup-features",
      title: "Startup Features",
      link: "/#features",
    },
     {
      key: "startup-guides",
      title: "Startup Guides",
      link: "/app/resources/startup-guides",
    },
  ];
  const riseLinksInvestors = [
    {
      key: "investor-register",
      title: "Register as Investor",
      link: "/auth/register/investor",
    },
    {
      key: "investor-features",
      title: "Investor Features",
      link: "/#features",
    },
    {
      key: "investor-guides",
      title: "Investor Guides",
      link: "/app/resources/investor-guides",
    },
  ];
  const riseLinksLegal = [
     {
      key: "faq",
      title: "FAQ",
      link: "/#faq",
    },
     {
      key: "privacy",
      title: "Privacy Policy",
      link: "/privacy-policy",
    },
     {
      key: "terms",
      title: "Terms of Service",
      link: "/terms-of-service",
    },
  ];

  return (
    <>
      <div className="bg-dark">
        <div className="container-1218 mx-auto ">
          <div className="border-b border-darkborder lg:py-24 py-12">
            <div className="grid grid-cols-12 gap-y-10 sm:gap-x-6 md:gap-x-8 lg:gap-x-12 ">
              <div className="lg:col-span-3 sm:col-span-6 col-span-12">
                 <h4 className="text-17 text-white font-semibold mb-8">
                  RISE Platform
                </h4>
                <div className="flex flex-col gap-4">
                  {riseLinksCompany.map((item) => {
                    return (
                      <Link
                        key={item.key}
                         to={item.link}
                        className="text-sm text-lightmuted hover:text-primary block"
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="lg:col-span-3 sm:col-span-6 col-span-12">
                <h4 className="text-17 text-white font-semibold mb-8">
                  For Startups
                </h4>
                <div className="flex flex-col gap-4">
                  {riseLinksStartups.map((item) => {
                    const isScrollLink = item.link.startsWith('#');
                    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                       if (isScrollLink) {
                          e.preventDefault();
                          const element = document.getElementById(item.link.substring(1));
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                       }
                    };
                    return isScrollLink ? (
                        <a
                          key={item.key}
                          href={item.link}
                          onClick={handleScroll}
                          className="text-sm text-lightmuted hover:text-primary block cursor-pointer"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <Link
                          key={item.key}
                          to={item.link}
                          className="text-sm text-lightmuted hover:text-primary block"
                        >
                          {item.title}
                        </Link>
                    );
                  })}
                </div>
              </div>
              <div className="lg:col-span-3 sm:col-span-6 col-span-12">
                <h4 className="text-17 text-white font-semibold mb-8">
                  For Investors
                </h4>
                <div className="flex flex-col gap-4">
                  {riseLinksInvestors.map((item) => {
                     const isScrollLink = item.link.startsWith('#');
                    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                       if (isScrollLink) {
                          e.preventDefault();
                          const element = document.getElementById(item.link.substring(1));
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                       }
                    };
                     return isScrollLink ? (
                        <a
                          key={item.key}
                          href={item.link}
                          onClick={handleScroll}
                          className="text-sm text-lightmuted hover:text-primary block cursor-pointer"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <Link
                          key={item.key}
                          to={item.link}
                          className="text-sm text-lightmuted hover:text-primary block"
                        >
                          {item.title}
                        </Link>
                    );
                  })}
                </div>
              </div>
              <div className="lg:col-span-3 sm:col-span-6 col-span-12">
                <h4 className="text-17 text-white font-semibold mb-8">
                   Help & Legal
                </h4>
                 <div className="flex flex-col gap-4 mb-8">
                  {riseLinksLegal.map((item) => {
                     const isScrollLink = item.link.startsWith('#');
                     const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                       if (isScrollLink) {
                          e.preventDefault();
                          const element = document.getElementById(item.link.substring(1));
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                       }
                    };
                     return isScrollLink ? (
                        <a
                          key={item.key}
                          href={item.link}
                          onClick={handleScroll}
                          className="text-sm text-lightmuted hover:text-primary block cursor-pointer"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <Link
                          key={item.key}
                          to={item.link}
                          className="text-sm text-lightmuted hover:text-primary block"
                        >
                          {item.title}
                        </Link>
                    );
                  })}
                </div>
                <h4 className="text-17 text-white font-semibold mb-4">
                  Follow Us
                </h4>
                <div className="flex items-center gap-5">
                  {/* Update href with actual RISE social links */}
                  {/* Temporarily commented out LinkedIn icon due to missing SVG */}
                  {/* 
                  <Tooltip
                    content="LinkedIn"
                    placement="bottom"
                    className="shrink-0"
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <img
                        src={linkedin} // Use imported LinkedIn icon
                        height={22}
                        width={22}
                        alt="LinkedIn icon"
                      />
                    </a>
                  </Tooltip>
                  */}
                  {/* Temporarily commented out Twitter icon as well for consistency - uncomment when ready */}
                  {/* 
                  <Tooltip
                    content="Twitter (X)"
                    placement="bottom"
                    className="shrink-0"
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <img
                        src={twitter}
                        height={22}
                        width={22}
                        alt="Twitter icon"
                      />
                    </a>
                  </Tooltip>
                  */}
                  {/* Removed Instagram */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-1218 mx-auto ">
          <div className="flex md:justify-between justify-center items-center flex-wrap md:py-10 py-8">
            <div className="flex items-center gap-3">
               <Logo/>
              <p className="text-15 text-lightmuted ">
                © {new Date().getFullYear()} RISE Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
