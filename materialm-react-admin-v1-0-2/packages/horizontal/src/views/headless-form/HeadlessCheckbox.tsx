import DisableCheckBox from "src/components/headless-form/Checkbox/DisableCheckBox";
import RenderAsDiv from "src/components/headless-form/Checkbox/RenderAsDiv";
import RenderAsProps from "src/components/headless-form/Checkbox/RenderAsProps";
import TransitionCheckbox from "src/components/headless-form/Checkbox/TransitionCheckbox";
import UsingHtmlForm from "src/components/headless-form/Checkbox/UsingHtmlForm";
import UsingUncontrolled from "src/components/headless-form/Checkbox/UsingUnctrolled";
import WithDescription from "src/components/headless-form/Checkbox/WithDescription";
import WithLable from "src/components/headless-form/Checkbox/WithLable";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Checkbox",
    },
  ];
  
const HeadlessCheckbox = () => {
  return (
    <div>
      <BreadcrumbComp title="Checkbox" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <WithLable />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <WithDescription />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DisableCheckBox />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <UsingHtmlForm />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <UsingUncontrolled />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <TransitionCheckbox />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <RenderAsDiv />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <RenderAsProps />
        </div>
      </div>
    </div>
  )
}

export default HeadlessCheckbox