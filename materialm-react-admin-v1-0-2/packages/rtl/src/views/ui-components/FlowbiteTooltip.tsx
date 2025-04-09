import AnimatioTooltip from "src/components/ui-components/Tooltip/AnimatioTooltip";
import DisableTooltip from "src/components/ui-components/Tooltip/DisableTooltip";
import TooltipPlacement from "src/components/ui-components/Tooltip/TooltipPlacement";
import TooltipStyle from "src/components/ui-components/Tooltip/TooltipStyle";
import TooltipTrigger from "src/components/ui-components/Tooltip/TooltipTrigger";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tooltips",
  },
];
const FlowbiteTooltip = () => {
  return (
    <>
      <BreadcrumbComp title="Tooltips" items={BCrumb} />

      <div className="grid grid-cols-12 gap-30">
        {/* Tooltip Style */}
        <div className="lg:col-span-4 col-span-12">
          <TooltipStyle />
        </div>
        {/* Tooltip Trigger */}
        <div className="lg:col-span-4 col-span-12">
          <TooltipTrigger/>
        </div>
        {/* Tooltip Disable Icon */}
        <div className="lg:col-span-4 col-span-12">
          <DisableTooltip/>
        </div>
        {/* Animatio Tooltip */}
        <div className="col-span-12">
          <AnimatioTooltip/>
        </div>
         {/* Tooltip Placement */}
         <div className="col-span-12">
          <TooltipPlacement/>
        </div>
      </div>
    </>
  );
};

export default FlowbiteTooltip;
