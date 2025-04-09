import ButtonLoading from "src/components/ui-components/Button/ButtonLoading";
import ButtonSizesPill from "src/components/ui-components/Button/ButtonSizesPill";
import ButtonSizesSquare from "src/components/ui-components/Button/ButtonSizeSquare";
import ButtonWithIcon from "src/components/ui-components/Button/ButtonWithIcon";
import DefaultButtons from "src/components/ui-components/Button/DefaultButtons";
import LightButtons from "src/components/ui-components/Button/LightButtons";
import RoundedOutline from "src/components/ui-components/Button/RoundedOutline";
import SquareButton from "src/components/ui-components/Button/SquareButton";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Button",
  },
];


const FlowbiteButtons = () => {
  return (
    <>
      <BreadcrumbComp title="Button" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Basic */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DefaultButtons />
        </div>
        {/* Light */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightButtons />
        </div>
        {/* Rounded Outline */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <RoundedOutline />
        </div>
        {/* Square Outline */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <SquareButton />
        </div>
        {/* Button Sizes Pill */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ButtonSizesPill />
        </div>
        {/* Button Sizes Suare */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ButtonSizesSquare />
        </div>
        {/* Button With Icon */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ButtonWithIcon />
        </div>
        {/* Loading Button */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ButtonLoading />
        </div>
      </div>
    </>
  );
};

export default FlowbiteButtons;
