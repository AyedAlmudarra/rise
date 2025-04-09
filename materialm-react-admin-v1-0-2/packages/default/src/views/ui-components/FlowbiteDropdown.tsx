import DropDownHeader from "src/components/ui-components/Dropdown/DropdownHeader";
import DropdownPalcements from "src/components/ui-components/Dropdown/DropdownPlacements";
import DropDownSize from "src/components/ui-components/Dropdown/DropDownSize";
import DropdownWithIcon from "src/components/ui-components/Dropdown/DropdownWithIcon";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";



const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Dropdown",
  },
];

const FlowbiteDropdown = () => {
  return (
    <>
      <BreadcrumbComp title="Dropdown" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default Drodown & Header Dropdown*/}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DropDownHeader />
        </div>
        {/* Drodown with icon*/}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DropdownWithIcon />
        </div>
        {/* Drodown sizes*/}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DropDownSize />
        </div>
        {/* Drodown Placement*/}
        <div className="col-span-12">
          <DropdownPalcements />
        </div>
      </div>
    </>
  );
};

export default FlowbiteDropdown;
