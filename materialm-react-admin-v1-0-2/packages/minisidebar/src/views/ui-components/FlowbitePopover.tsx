import CompanyProfile from "src/components/ui-components/Popover/CompanyProfile";
import ControlledPopover from "src/components/ui-components/Popover/ControlledPopover";
import DefaultPopover from "src/components/ui-components/Popover/DefaultPopover";
import DisableArrow from "src/components/ui-components/Popover/DisableArrow";
import ImagePopover from "src/components/ui-components/Popover/ImagePopover";
import PasswordPopover from "src/components/ui-components/Popover/PasswordPopover";
import PlacementPopover from "src/components/ui-components/Popover/PlacementPopover";
import TriggerType from "src/components/ui-components/Popover/TriggerType";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Popover",
  },
];
const FlowbitePopover = () => {
  return (
    <>
      <BreadcrumbComp title="Popover" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <DefaultPopover />
        </div>
        {/* Company Profile */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <CompanyProfile />
        </div>
        {/* Controlled Popover */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <ControlledPopover />
        </div>
        {/* Disable Arrow */}
        <div className="lg:col-span-3 md:col-span-6 col-span-12">
          <DisableArrow />
        </div>
        {/* Image Popover */}
        <div className="lg:col-span-6 col-span-12">
          <ImagePopover />
        </div>
        {/* Password Popover */}
        <div className="lg:col-span-6 col-span-12">
          <PasswordPopover />
        </div>
        {/* Placement Popover */}
        <div className="lg:col-span-8 col-span-12">
          <PlacementPopover />
        </div>
        {/* Trigger Type */}
        <div className="lg:col-span-4 col-span-12">
          <TriggerType/>
        </div>
      </div>
    </>
  );
};

export default FlowbitePopover;
