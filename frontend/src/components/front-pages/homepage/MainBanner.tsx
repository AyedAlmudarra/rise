import tech1 from "@/assets/images/front-pages/technology/react.svg";
import tech2 from "@/assets/images/front-pages/technology/flowbite.svg";
import tech4 from "@/assets/images/front-pages/technology/typescript.svg";
import tech5 from "@/assets/images/front-pages/technology/tailwind.svg";
import mainbanner from "@/assets/images/front-pages/background/main-banner.webp";
import { Button, Tooltip } from "flowbite-react";
import { Link } from "react-router-dom";


const MainBanner = () => {
  const Technology = [
    {
      tech: tech1,
      tooltip: "React",
    },
    {
      tech: tech2,
      tooltip: "Flowbite React",
    },
    {
      tech: tech4,
      tooltip: "Typescript",
    },
    {
      tech: tech5,
      tooltip: "Tailwind CSS",
    },
    {
     
    },
  ];
  return (
    <>
      <div id="home" className="bg-lightgray dark:bg-darkgray overflow-x-hidden">
        <div className="container-1218 mx-auto sm:pt-10 pt-6 xl:pb-0 pb-10">
          <div className="grid grid-cols-12 gap-30 items-center ">
            <div className="xl:col-span-6 col-span-12 lg:text-start text-center">
              <h1 className="lg:text-56 text-4xl text-dark dark:text-white font-medium lg:leading-[64px] leading-[50px]">
                <b className="font-bold" >Connect, Analyze, Invest.</b> The AI-Powered Platform for Saudi Startups & Investors.
              </h1>
              <p className="text-lg text-darklink mt-6 mb-8">
                RISE leverages AI to provide deep insights for startups and connects them with the right investors in the Saudi market.
              </p>
              <ul className="flex flex-wrap lg:justify-start justify-center gap-5 pb-7 ml-0">
                {Technology.map((item, index) => (
                  <Tooltip
                    content={item.tooltip}
                    className="!text-xs"
                    placement="bottom"
                    key={index}
                  >
                    <li
                      className="md:h-14 md:w-14 h-10 w-10 bg-white dark:bg-darkmuted rounded-[16px] flex justify-center items-center shadow-elevation1"
                    >
                      <img src={item.tech} alt={item.tooltip} height={28} className="md:h-7 h-5" />
                    </li>
                  </Tooltip>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row lg:justify-start justify-center gap-4">
                 <Button
                  color={"primary"}
                  as={Link}
                   to="/auth/register/startup"
                  className="px-6 py-2.5 font-bold w-full sm:w-auto"
                >
                  Register as Startup
                </Button>
                <Button
                  color={"secondary"}
                  as={Link}
                   to="/auth/register/investor"
                  className="px-6 py-2.5 font-bold w-full sm:w-auto"
                >
                  Register as Investor
                </Button>
              </div>
            </div>
            <div className="lg:col-span-6 col-span-12 xl:block hidden">
              <div className="min-w-[1300px] max-h-[700px] h-[calc(100vh_-_100px)] overflow-hidden ">
                <img src={mainbanner} className="rtl:scale-x-[-1]" alt="banner" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainBanner;
