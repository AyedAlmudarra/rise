import AdvanceRatting from "src/components/ui-components/Ratting/AdvanceRatting";
import DefaultRatting from "src/components/ui-components/Ratting/DefaultRatting";
import RattingCount from "src/components/ui-components/Ratting/RattingCount";
import StarRatting from "src/components/ui-components/Ratting/StarRatting";
import WithTextRattings from "src/components/ui-components/Ratting/WithTextRattings";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Rating",
  },
];
const FlowbiteRating = () => {
  return (
    <>
      <BreadcrumbComp title="Rating" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-4 col-span-12">
          <DefaultRatting />
        </div>
        {/* With Text Rattings */}
        <div className="lg:col-span-4 col-span-12">
          <WithTextRattings />
        </div>
        {/* Ratting Count*/}
        <div className="lg:col-span-4 col-span-12">
          <RattingCount />
        </div>
        {/* Star Ratting*/}
        <div className="lg:col-span-6 col-span-12">
          <StarRatting />
        </div>
        {/* Advance Ratting*/}
        <div className="lg:col-span-6 col-span-12">
          <AdvanceRatting />
        </div>
      </div>
    </>
  );
};

export default FlowbiteRating;
