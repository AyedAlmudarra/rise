import DefaultTabs from "src/components/ui-components/Tabs/DefaultTabs";
import FullWidthTabs from "src/components/ui-components/Tabs/FullWidthTabs";
import StateTabs from "src/components/ui-components/Tabs/StateTabs";
import TabsWithPill from "src/components/ui-components/Tabs/TabsWithPill";
import UnderlineTabs from "src/components/ui-components/Tabs/UnderlineTabs";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tabs",
  },
];
const FlowbiteTab = () => {
  return (
    <>
      <BreadcrumbComp title="Tabs" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="col-span-12">
          <DefaultTabs />
        </div>
        {/* Underline Tabs */}
        <div className="col-span-12">
          <UnderlineTabs />
        </div>
         {/* Tabs With Pill */}
         <div className="col-span-12">
          <TabsWithPill />
        </div>
        {/* Full Width Tabs */}
        <div className="col-span-12">
          <FullWidthTabs />
        </div>
        {/* State Tabs */}
        <div className="col-span-12">
          <StateTabs />
        </div>
      </div>
    </>
  );
};

export default FlowbiteTab;
