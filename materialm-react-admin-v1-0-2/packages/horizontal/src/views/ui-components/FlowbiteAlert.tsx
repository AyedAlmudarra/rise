import Additional from "src/components/ui-components/Alert/Additional";
import AlertWithIcon from "src/components/ui-components/Alert/AlertWithIcon";
import AllOptions from "src/components/ui-components/Alert/AllOptions";
import DefaultAlert from "src/components/ui-components/Alert/DefaultAlert";
import DismissibleAlert from "src/components/ui-components/Alert/DismissibleAlert";
import LightAlert from "src/components/ui-components/Alert/LightAlert";
import LightAlertWithIcon from "src/components/ui-components/Alert/LightAlertWithIcon";
import LightBorderAccent from "src/components/ui-components/Alert/LightBorderAccent";
import LightDismissibleAlert from "src/components/ui-components/Alert/LightDismissibleAlert";
import LightRoundeAlert from "src/components/ui-components/Alert/LightRoundeAlert";
import RoundedAlert from "src/components/ui-components/Alert/RoundedAlert";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Alert",
  },
];

const FlowbiteAlert = () => {
  return (
    <>
      <BreadcrumbComp title="Alert" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DefaultAlert />
        </div>
        {/* Light Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightAlert />
        </div>
        {/* Alert With Icon */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <AlertWithIcon />
        </div>
        {/* Light Alert With Icon */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightAlertWithIcon />
        </div>
        {/* Dismissible Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DismissibleAlert />
        </div>
        {/* Light Dismissible Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightDismissibleAlert />
        </div>
        {/* Rounded Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <RoundedAlert />
        </div>
        {/* Light Rounded Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightRoundeAlert />
        </div>
        {/* Light Border Accent */}
        <div className="col-span-12">
          <LightBorderAccent />
        </div>
        {/* Additional Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <Additional />
        </div>
        {/* AllOptions Alert */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <AllOptions />
        </div>
      </div>
    </>
  );
};

export default FlowbiteAlert;
