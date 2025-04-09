import AutoHide from "src/components/ui-components/DatePicker/AutoHide";
import DefaultDatep from "src/components/ui-components/DatePicker/DefaultDatep";
import LimitDatep from "src/components/ui-components/DatePicker/LimitDatep";
import LocalizationDatep from "src/components/ui-components/DatePicker/LocalizationDatep";
import TitleDatePicker from "src/components/ui-components/DatePicker/TitleDatePicker";
import WeekStart from "src/components/ui-components/DatePicker/WeekStart";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";



const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Datepicker",
  },
];
const FlowbiteDatePicker = () => {
  return (
    <>
      <BreadcrumbComp title="Datepicker" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default Date Picker*/}
        <div className="lg:col-span-4  col-span-12">
          <DefaultDatep />
        </div>
        {/* Localization Date Picker*/}
        <div className="lg:col-span-4  col-span-12">
          <LocalizationDatep />
        </div>
        {/* Limit Date Picker*/}
        <div className="lg:col-span-4  col-span-12">
          <LimitDatep />
        </div>
        {/* WeekStart Date Picker*/}
        <div className="lg:col-span-4  col-span-12">
          <WeekStart />
        </div>
        {/* Autohide Date Picker*/}
        <div className="lg:col-span-4  col-span-12">
          <AutoHide />
        </div>
        {/* Title Date Picker*/}
        <div className="lg:col-span-4  col-span-12">
          <TitleDatePicker />
        </div>
      </div>
    </>
  );
};

export default FlowbiteDatePicker;
