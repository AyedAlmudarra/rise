import CTANav from "src/components/ui-components/Navbar/CTANav";
import DefaultNav from "src/components/ui-components/Navbar/DefaultNav";
import NavWithDropdown from "src/components/ui-components/Navbar/NavWithDropdown";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Navbar",
  },
];
const FlowbiteNavbar = () => {
  return (
    <>
      <BreadcrumbComp title="Navbar" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default Navbar*/}
        <div className="col-span-12">
          <DefaultNav />
        </div>
        {/* CTA Navbar */}
        <div className="col-span-12">
          <CTANav />
        </div>
         {/* Nav With Dropdown */}
         <div className="col-span-12">
          <NavWithDropdown />
        </div>
      </div>
    </>
  );
};

export default FlowbiteNavbar;
