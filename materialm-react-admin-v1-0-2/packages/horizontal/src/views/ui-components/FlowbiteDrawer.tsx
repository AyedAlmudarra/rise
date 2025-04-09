import BottomDrawer from "src/components/ui-components/Drawer/BottomDrawer";
import ContactDrawer from "src/components/ui-components/Drawer/ContactDrawer";
import CustomBackDrop from "src/components/ui-components/Drawer/CustomBackDrop";
import DefaultDrawer from "src/components/ui-components/Drawer/DefaultDrawer";
import DrawerNavigation from "src/components/ui-components/Drawer/DrawerNavigation";
import FormDrawer from "src/components/ui-components/Drawer/FormDrawer";
import LeftDrawer from "src/components/ui-components/Drawer/LeftDrawer";
import RightDrawer from "src/components/ui-components/Drawer/RightDrawer";
import SwipableDrawer from "src/components/ui-components/Drawer/SwipableDrawer";
import TopDrawer from "src/components/ui-components/Drawer/TopDrawer";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Drawer",
  },
];
const FlowbiteDrawer = () => {
  return (
    <>
      <BreadcrumbComp title="Drawer" items={BCrumb} />

      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <DefaultDrawer />
        </div>
        {/* Drawer Navigation */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <DrawerNavigation />
        </div>
        {/* Contact Form Drawer */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <ContactDrawer />
        </div>
        {/* Form Drawer */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <FormDrawer />
        </div>
        {/* Custom BackDrop */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <CustomBackDrop />
        </div>
        {/* Swipable Drawer  */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <SwipableDrawer />
        </div>
        {/* Left Drawer  */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <LeftDrawer />
        </div>
        {/* Right Drawer  */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <RightDrawer />
        </div>
        {/* Top Drawer  */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <TopDrawer />
        </div>
        {/* Bottom Drawer  */}
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <BottomDrawer />
        </div>
      </div>
    </>
  );
};

export default FlowbiteDrawer;
