import AlignSpinner from "src/components/ui-components/Spinner/AlignSpinner";
import ColorSpinner from "src/components/ui-components/Spinner/ColorSpinner";
import DefaultSpinner from "src/components/ui-components/Spinner/DefaultSpinner";
import LoadButton from "src/components/ui-components/Spinner/LoadButton";
import SizingSpinner from "src/components/ui-components/Spinner/SizingSpinner";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Spinner",
  },
];
const FlowbiteSpinner = () => {
  return (
    <>
      <BreadcrumbComp title="Spinner" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <DefaultSpinner />
        </div>
         {/* Color Spinner */}
         <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <ColorSpinner />
        </div>
        {/* Sizing Spinner */}
        <div className="lg:col-span-4 md:col-span-4 col-span-12">
          <SizingSpinner />
        </div>
        {/* Align Spinner */}
        <div className="lg:col-span-6 col-span-12">
          <AlignSpinner />
        </div>
        {/* Load Button */}
        <div className="lg:col-span-6 col-span-12">
          <LoadButton />
        </div>
      </div>
    </>
  );
};

export default FlowbiteSpinner;
