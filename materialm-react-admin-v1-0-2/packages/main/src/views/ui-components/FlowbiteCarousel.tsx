import CustomControl from "src/components/ui-components/Curousel/CustomControl";
import DefaultCusrosel from "src/components/ui-components/Curousel/DefaultCusrosel";
import Indicators from "src/components/ui-components/Curousel/Indicators";
import PauseHover from "src/components/ui-components/Curousel/PauseHover";
import SlideEventChange from "src/components/ui-components/Curousel/SlideEventChange";
import SliderContent from "src/components/ui-components/Curousel/SliderContent";
import SlidingInterval from "src/components/ui-components/Curousel/SlidingInterval";
import StaticCurosel from "src/components/ui-components/Curousel/StaticCurosel";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Carousel",
  },
];

const FlowbiteCarousel = () => {
  return (
    <>
      <BreadcrumbComp title="Carousel" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DefaultCusrosel />
        </div>
        {/* Static Curosel */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <StaticCurosel />
        </div>
        {/* Sliding Interval */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <SlidingInterval />
        </div>
        {/* Custom Control */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <CustomControl />
        </div>
        {/* Indicators */}
        <div className="col-span-12">
          <Indicators />
        </div>
        {/* Pause On Hover */}
        <div className="col-span-12">
          <PauseHover />
        </div>
        {/* Slider Content */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <SliderContent />
        </div>
        {/* Slide Event Change */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <SlideEventChange />
        </div>
      </div>
    </>
  );
};

export default FlowbiteCarousel;
