import { Icon } from "@iconify/react";
export const Highlights = () => {
  // RISE Feature Set 1
  const RiseFeatures1 = [
    {
      key: "rise1",
      icon: "tabler:rocket",
      title: "Startup Launchpad",
      bg: "bg-lightsuccess",
      text: "text-success",
    },
    {
      key: "rise2",
      icon: "tabler:target-arrow",
      title: "Investor Matching",
      bg: "bg-lightinfo",
      text: "text-info",
    },
    {
      key: "rise3",
      icon: "tabler:brain",
      title: "AI-Powered Analysis",
      bg: "bg-lightprimary",
      text: "text-primary",
    },
    {
      key: "rise4",
      icon: "tabler:map-pin",
      title: "Saudi Market Focus",
      bg: "bg-lightwarning",
      text: "text-warning",
    },
    {
      key: "rise5",
      icon: "tabler:database",
      title: "Powered by Supabase",
      bg: "bg-lightsecondary",
      text: "text-secondary",
    },
    {
      key: "rise6",
      icon: "tabler:brand-react",
      title: "Modern React UI",
      bg: "bg-lighterror",
      text: "text-error",
    },
  ];

  // RISE Feature Set 2
  const RiseFeatures2 = [
    {
      key: "rise7",
      icon: "tabler:file-analytics",
      title: "Detailed Profiles",
      bg: "bg-lightinfo",
      text: "text-info",
    },
    {
      key: "rise8",
      icon: "tabler:filter",
      title: "Targeted Filtering",
      bg: "bg-lightsuccess",
      text: "text-success",
    },
    {
      key: "rise9",
      icon: "tabler:presentation-analytics",
      title: "Funding Readiness",
      bg: "bg-lightprimary",
      text: "text-primary",
    },
    {
      key: "rise10",
      icon: "tabler:list-check",
      title: "Investor Watchlist",
      bg: "bg-lightwarning",
      text: "text-warning",
    },
    {
      key: "rise11",
      icon: "tabler:affiliate",
      title: "Streamlined Deal Flow",
      bg: "bg-lightsecondary",
      text: "text-secondary",
    },
  ];

  // RISE Feature Set 3 (Could add more unique features or reuse some)
  const RiseFeatures3 = [
     {
      key: "rise12",
      icon: "tabler:bulb",
      title: "AI Startup Suggestions",
      bg: "bg-lighterror",
      text: "text-error",
    },
    {
      key: "rise13",
      icon: "tabler:users-group",
      title: "Community Connection",
      bg: "bg-lightsuccess",
      text: "text-success",
    },
    {
      key: "rise14",
      icon: "tabler:lock-access",
      title: "Secure Authentication",
      bg: "bg-lightinfo",
      text: "text-info",
    },
     { // Reusing icon/color for visual variety
      key: "rise15",
      icon: "tabler:rocket",
      title: "Accelerate Growth",
      bg: "bg-lightsuccess",
      text: "text-success",
    },
    { // Reusing icon/color
      key: "rise16",
      icon: "tabler:target-arrow",
      title: "Find Opportunities",
      bg: "bg-lightinfo",
      text: "text-info",
    },
  ];

  return (
    <>
      <div id="highlights" className="dark:bg-dark">
        <div className="container-1218 mx-auto ">
          <div className=" lg:pt-24 pt-12 rounded-md overflow-hidden">
            {/* First Marquee Row */}
            <div className="marquee1-group flex gap-6">
              {[0, 1, 2, 3].map((_item, index) => {
                return (
                  <div key={index} className="flex gap-6 mb-6">
                    {RiseFeatures1.map((item) => {
                      return (
                        <div
                          key={item.key}
                          className={`py-5 px-8 rounded-[16px] flex gap-3 items-center ${item.bg}`}
                        >
                          <Icon
                            icon={item.icon}
                            className={`text-2xl shrink-0 ${item.text}`}
                          />
                          <p
                            className={`text-15 font-semibold whitespace-nowrap ${item.text}`}
                          >
                            {item.title}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {/* Second Marquee Row */}
            <div className="marquee2-group flex gap-6">
              {[0, 1, 2, 3, 4, 5].map((_feature, index) => {
                return (
                  <div key={index} className="flex gap-6 mb-6">
                    {RiseFeatures2.map((item) => {
                      return (
                        <div
                          key={item.key}
                          className={`py-5 px-8 rounded-[16px] flex gap-3 items-center ${item.bg}`}
                        >
                          <Icon
                            icon={item.icon}
                            className={`text-2xl shrink-0 ${item.text}`}
                          />
                          <p
                            className={`text-15 font-semibold whitespace-nowrap ${item.text}`}
                          >
                            {item.title}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {/* Third Marquee Row */}
            <div className="marquee1-group flex gap-6">
              {[0, 1, 2, 3].map((_item, index) => {
                return (
                  <div key={index} className="flex gap-6 mb-6">
                    {RiseFeatures3.map((item) => {
                      return (
                        <div
                          key={item.key}
                          className={`py-5 px-8 rounded-[16px] flex gap-3 items-center ${item.bg}`}
                        >
                          <Icon
                            icon={item.icon}
                            className={`text-2xl shrink-0 ${item.text}`}
                          />
                          <p
                            className={`text-15 font-semibold whitespace-nowrap ${item.text}`}
                          >
                            {item.title}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
