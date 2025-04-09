import ContentSeparator from "src/components/ui-components/Sidebar/ContentSeparator";
import CustomDropdownIcon from "src/components/ui-components/Sidebar/CustomDropdownIcon";
import DefaultSidebar from "src/components/ui-components/Sidebar/DefaultSidebar";
import MultilevelDropdown from "src/components/ui-components/Sidebar/MultilevelDropdown";
import SidebarWithButton from "src/components/ui-components/Sidebar/SidebarWithButton";
import SidebarWithLogo from "src/components/ui-components/Sidebar/SidebarWithLogo";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Sidebar",
  },
];
const FlowbiteSidebar = () => {
  return (
    <>
      <BreadcrumbComp title="Sidebar" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DefaultSidebar />
        </div>
        {/* Multilevel Dropdown */}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <MultilevelDropdown />
        </div>
        {/* Custom Dropdown Icon*/}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <CustomDropdownIcon />
        </div>
        {/* Content Separator*/}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <ContentSeparator />
        </div>
        {/* Sidebar With Button*/}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <SidebarWithButton />
        </div>
        {/* Sidebar With Logo*/}
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <SidebarWithLogo />
        </div>
      </div>
    </>
  );
};

export default FlowbiteSidebar;
