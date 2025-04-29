import { FaqComponent } from "@/components/front-pages/homepage/FAQ";
// import FeatureTabs from "@/components/front-pages/homepage/FeatureTabs"; // Removed import
import { Highlights } from "@/components/front-pages/homepage/Highlights";
import MainBanner from "@/components/front-pages/homepage/MainBanner";
import PurchaseTemp from "@/components/front-pages/homepage/PurchaseTemp";


const HomePage = () => {
  return (
    <>
      <MainBanner />
      {/* <FeatureTabs /> */}{/* Removed component usage */}
      <Highlights />
      <FaqComponent />
      <PurchaseTemp/>
    </>
  );
};

export default HomePage;
