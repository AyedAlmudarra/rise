import React, { useState } from "react";
import { Icon } from "@iconify/react";
import featureImage from "@/assets/images/front-pages/background/feature-image.png";
import placeholderImage2 from "@/assets/images/front-pages/background/widget_materialM_2.png";
import placeholderImage3 from "@/assets/images/front-pages/background/widget_materialM_3.png";
import { Accordion, Button, HR } from "flowbite-react";

const FeatureTabs = () => {
  const [activeTab, setActiveTab] = useState("AI Startup Analysis");
  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const aiAnalysisFeatures = [
    {
      title: "In-Depth Company Evaluation",
      desc: "Receive comprehensive AI-generated reports covering SWOT analysis, market positioning, scalability, and more.",
    },
    {
      title: "Funding Readiness Score",
      desc: "Understand your startup's investment potential with an objective, data-driven readiness score.",
    },
    {
      title: "Actionable Recommendations",
      desc: "Get tailored suggestions from our AI to improve your business model, strategy, and investor pitch.",
    },
  ];

  const investorMatchingFeatures = [
    {
      title: "Targeted Investor Discovery",
      desc: "Connect with investors whose preferences align with your startup's industry, stage, and funding needs.",
    },
    {
      title: "Verified Investor Profiles",
      desc: "Access detailed profiles of vetted investors, including their investment thesis and past deals.",
    },
    {
      title: "Streamlined Communication",
      desc: "Initiate contact and manage conversations with potential investors directly through the platform.",
    },
  ];

  const curatedDealFlowFeatures = [
    {
      title: "AI-Filtered Opportunities",
      desc: "Discover promising startups tailored to your investment criteria, powered by intelligent filtering.",
    },
    {
      title: "Comprehensive Startup Data",
      desc: "Access detailed profiles, AI analyses, and key metrics for potential investment targets.",
    },
    {
      title: "Efficient Due Diligence",
      desc: "Utilize platform tools and data insights to streamline your evaluation and decision-making process.",
    },
  ];

  return (
    <>
      <div className="bg-lightgray dark:bg-darkgray lg:py-24 py-12">
        <div className="container-1218 mx-auto">
          {/* Tabs */}
          <div className="overflow-x-auto ">
            <div className="flex shrink-0 gap-4 md:pb-14 pb-8">
              <div
                onClick={() => handleTabClick("AI Startup Analysis")}
                className={` py-4 px-6 whitespace-nowrap w-full rounded-tw cursor-pointer text-dark text-base font-semibold text-center flex gap-2 justify-center items-center  md:hover:bg-lightprimary md:dark:hover:bg-lightprimary md:hover:text-primary shadow-elevation2 ${
                  activeTab == "AI Startup Analysis"
                    ? "text-white bg-primary dark:bg-primary shadow-elevation3 hover:!bg-primaryemphasis hover:!text-white"
                    : "dark:text-white bg-white dark:bg-dark"
                }`}
              >
                <Icon
                  icon="fluent:brain-circuit-20-regular"
                  height={22}
                />
                AI Startup Analysis
              </div>
              <div
                onClick={() => handleTabClick("Investor Matching")}
                className={`py-4 px-6 whitespace-nowrap w-full rounded-tw cursor-pointer text-dark text-base font-semibold text-center flex gap-2 justify-center items-center  md:hover:bg-lightprimary md:dark:hover:bg-lightprimary md:hover:text-primary shadow-elevation2 ${
                  activeTab == "Investor Matching"
                    ? "text-white bg-primary dark:bg-primary shadow-elevation3 hover:!bg-primaryemphasis hover:!text-white"
                    : "dark:text-white bg-white dark:bg-dark"
                }`}
              >
                <Icon
                  icon="mdi:handshake-outline"
                  height={22}
                />{" "}
                Investor Matching
              </div>
              <div
                onClick={() => handleTabClick("Curated Deal Flow")}
                className={`py-4 px-6 whitespace-nowrap w-full rounded-tw cursor-pointer text-dark text-base font-semibold text-center flex gap-2 justify-center items-center   md:hover:bg-lightprimary md:dark:hover:bg-lightprimary md:hover:text-primary shadow-elevation2 ${
                  activeTab == "Curated Deal Flow"
                    ? "text-white bg-primary dark:bg-primary shadow-elevation3 hover:!bg-primaryemphasis hover:!text-white"
                    : "dark:text-white bg-white dark:bg-dark"
                }`}
              >
                <Icon
                  icon="carbon:analytics"
                  height={22}
                />{" "}
                Curated Deal Flow
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-30">
              {/* Tabs Content */}
              {activeTab === "AI Startup Analysis" && (
                 <>
            <div className="lg:col-span-6 col-span-12">
              <img src={featureImage} className="w-full" alt="AI Analysis Feature" />
            </div>
            <div className="lg:col-span-6 col-span-12 lg:ps-7">
                  <h2 className="sm:text-44 text-3xl font-bold !leading-[48px] text-dark dark:text-white pb-6">
                    Unlock Deep Startup Insights with AI
                  </h2>
                  <Accordion className="shadow-none dark:shadow-none divide-y-0 !rounded-none">
                    {aiAnalysisFeatures.map((item, i) => (
                      <Accordion.Panel
                        key={i}
                        className="bg-white dark:bg-dark"
                      >
                        <Accordion.Title className="focus:ring-0 px-0 text-17 font-semibold text-ld py-5 ">
                          {item.title}
                        </Accordion.Title>
                        <Accordion.Content className="px-0 pt-0 !rounded-none">
                          <p className="text-base text-darklink leading-7 ">
                            {item.desc}
                          </p>
                        </Accordion.Content>
                        <HR className="my-0" />
                      </Accordion.Panel>
                    ))}
                  </Accordion>
                  <Button color={"primary"} className="font-bold mt-6">
                    Explore AI Features
                  </Button>
                </div>
                 </>

              )}
              {activeTab === "Investor Matching" && (
                 <>
            <div className="lg:col-span-6 col-span-12">
              <img src={placeholderImage2} className="w-full" alt="Investor Matching Feature" />
            </div>
            <div className="lg:col-span-6 col-span-12 lg:ps-7">
                  <h2 className="sm:text-44 text-3xl font-bold !leading-[48px] text-dark dark:text-white pb-6">
                    Connect with the Right Investors
                  </h2>
                  <Accordion className="shadow-none dark:shadow-none divide-y-0 !rounded-none">
                    {investorMatchingFeatures.map((item, i) => (
                      <Accordion.Panel
                        key={i}
                        className="bg-white dark:bg-dark"
                      >
                        <Accordion.Title className="focus:ring-0 px-0 text-17 font-semibold text-ld py-5 ">
                          {item.title}
                        </Accordion.Title>
                        <Accordion.Content className="px-0 pt-0 !rounded-none">
                          <p className="text-base text-darklink leading-7 ">
                            {item.desc}
                          </p>
                        </Accordion.Content>
                        <HR className="my-0" />
                      </Accordion.Panel>
                    ))}
                  </Accordion>
                  <Button color={"primary"} className="font-bold mt-6">
                    Find Investors
                  </Button>
                </div>
                 </>

              )}
              {activeTab === "Curated Deal Flow" && (
                 <>
            <div className="lg:col-span-6 col-span-12">
              <img src={placeholderImage3} className="w-full" alt="Curated Deal Flow Feature" />
            </div>
            <div className="lg:col-span-6 col-span-12 lg:ps-7">
                  <h2 className="sm:text-44 text-3xl font-bold !leading-[48px] text-dark dark:text-white pb-6">
                    Access Tailored Investment Opportunities
                  </h2>
                  <Accordion className="shadow-none dark:shadow-none divide-y-0 !rounded-none">
                    {curatedDealFlowFeatures.map((item, i) => (
                      <Accordion.Panel
                        key={i}
                        className="bg-white dark:bg-dark"
                      >
                        <Accordion.Title className="focus:ring-0 px-0 text-17 font-semibold text-ld py-5 ">
                          {item.title}
                        </Accordion.Title>
                        <Accordion.Content className="px-0 pt-0 !rounded-none">
                          <p className="text-base text-darklink leading-7 ">
                            {item.desc}
                          </p>
                        </Accordion.Content>
                        <HR className="my-0" />
                      </Accordion.Panel>
                    ))}
                  </Accordion>
                  <Button color={"primary"} className="font-bold mt-6">
                    Discover Startups
                  </Button>
                </div>
                 </>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeatureTabs;
