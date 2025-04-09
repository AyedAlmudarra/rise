import DisabledInput from "src/components/headless-form/Input/DisableInput";
import InputWithDescription from "src/components/headless-form/Input/InputWithDescription";
import InputWithLabel from "src/components/headless-form/Input/InputWithLabel";
import SquareInputWithLabel from "src/components/headless-form/Input/SquareInputWithLabel";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "input",
    },
  ];
const HeadlessInput = () => {
  return (
    <>
      <BreadcrumbComp title="input" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-6 col-span-12">
          <InputWithLabel />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <SquareInputWithLabel />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <InputWithDescription />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <DisabledInput />
        </div>
      </div>
    </>
  )
}

export default HeadlessInput