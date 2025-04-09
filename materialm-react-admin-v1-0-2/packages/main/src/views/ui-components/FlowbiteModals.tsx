import DefaultModal from "src/components/ui-components/Modals/DefaultModal";
import FormModal from "src/components/ui-components/Modals/FormModal";
import PlacementModal from "src/components/ui-components/Modals/PlacementModal";
import PopupModal from "src/components/ui-components/Modals/PopupModal";
import SizingModal from "src/components/ui-components/Modals/SizingModal";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Modals",
  },
];

const FlowbiteModals = () => {
  return (
    <>
      <BreadcrumbComp title="Modals" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <DefaultModal />
        </div>
        {/* Popup Modal */}
        <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <PopupModal />
        </div>
        {/* Form Modal */}
        <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <FormModal />
        </div>
        {/* Sizing Modal */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <SizingModal />
        </div>
        {/* Placement Modal */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <PlacementModal />
        </div>
      </div>
    </>
  );
};

export default FlowbiteModals;
