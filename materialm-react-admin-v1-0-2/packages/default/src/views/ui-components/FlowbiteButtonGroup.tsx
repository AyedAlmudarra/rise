import ColorOptions from "src/components/ui-components/ButtonGroup/ColorOptions";
import DefaultGroup from "src/components/ui-components/ButtonGroup/DefaultGroup";
import GroupWithIcon from "src/components/ui-components/ButtonGroup/GroupWithIcon";
import OutlineButtonGroup from "src/components/ui-components/ButtonGroup/OutlineButtonGroup";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Button Group",
  },
];
const page = () => {
  return (
    <>
      <BreadcrumbComp title="Button Group" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DefaultGroup />
        </div>
        {/* Outline Button Group */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <OutlineButtonGroup />
        </div>
        {/* Color Options */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ColorOptions />
        </div>
        {/* Group With Icon */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <GroupWithIcon />
        </div>
      </div>
    </>
  );
};

export default page;
