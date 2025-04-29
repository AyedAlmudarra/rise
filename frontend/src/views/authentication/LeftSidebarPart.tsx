import Bgimg from "@/assets/images/logos/logo-icon.svg";

const LeftSidebarPart = () => {
  return (
    <>
      <div className="circle-top"></div>
      <div>
        <img src={Bgimg} alt="RISE Background Icon" className="circle-bottom" />
      </div>
      <div className="flex justify-center h-screen items-center z-10 relative">
        <div className="xl:w-7/12 xl:px-0 px-6">
          <h2 className="text-white text-[40px] font-bold leading-[normal]">
            Welcome to RISE
          </h2>
          <p className="opacity-75 text-white my-4 text-base font-medium">
            Connecting Startups and Investors in the Saudi market, powered by AI analysis and matchmaking.
          </p>
        </div>
      </div>
    </>
  );
};

export default LeftSidebarPart;
