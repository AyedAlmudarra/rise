
import BackgroundBread from "src/components/ui-components/Breadcrumb/BackgroundBread";
import Default from "src/components/ui-components/Breadcrumb/Default";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Breadcrumb",
  },
];
const FlowbiteBreadcrumb = () => {
  return (
    <>
      <BreadcrumbComp title="Breadcrumb" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default  */}
        <div className="col-span-12">
          <Default />
        </div>
        {/* background color  */}
        <div className="col-span-12">
          <BackgroundBread />
        </div>
      </div>
    </>
  );
};

export default FlowbiteBreadcrumb;
