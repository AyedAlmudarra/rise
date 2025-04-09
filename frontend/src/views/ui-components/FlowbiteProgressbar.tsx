import DefaultProgress from "src/components/ui-components/Progressbar/DefaultProgress";
import LabelPostionProgress from "src/components/ui-components/Progressbar/LabelPostionProgress";
import LabelProgress from "src/components/ui-components/Progressbar/LabelProgress";
import ProgressColor from "src/components/ui-components/Progressbar/ProgressColor";
import ProgressSize from "src/components/ui-components/Progressbar/ProgressSize";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Progress Bar",
  },
];
const FlowbiteProgressbar = () => {
  return (
    <>
      <BreadcrumbComp title="Progress Bar" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default Progress */}
        <div className="col-span-12">
          <DefaultProgress />
        </div>
        {/* Label Progress */}
        <div className="col-span-12">
          <LabelProgress />
        </div>
        {/* Label Postion Progress */}
        <div className="col-span-12">
          <LabelPostionProgress />
        </div>
        {/* Progress Size */}
        <div className="col-span-12">
          <ProgressSize />
        </div>
        {/* Progress Colors */}
        <div className="col-span-12">
          <ProgressColor />
        </div>
      </div>
    </>
  );
};

export default FlowbiteProgressbar;
