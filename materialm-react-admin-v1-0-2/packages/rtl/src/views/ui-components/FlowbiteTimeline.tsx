import DefaultTimeline from "src/components/ui-components/Timeline/DefaultTimeline";
import HorizontalTimeline from "src/components/ui-components/Timeline/HorizontalTimeline";
import VerticalTimeline from "src/components/ui-components/Timeline/VerticalTimeline";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Timeline",
  },
];
const FlowbiteTimeline = () => {
  return (
    <>
      <BreadcrumbComp title="Timeline" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className=" col-span-12">
          <DefaultTimeline />
        </div>
         {/* Vertical Timeline */}
         <div className=" col-span-12">
          <VerticalTimeline />
        </div>
         {/* Horizontal Timeline */}
         <div className=" col-span-12">
          <HorizontalTimeline />
        </div>
      </div>
    </>
  );
};

export default FlowbiteTimeline;
