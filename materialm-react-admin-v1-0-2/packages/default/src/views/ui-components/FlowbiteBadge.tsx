import BadgeSizes from "src/components/ui-components/Badge/BadgeSizes";
import BadgesWithIconText from "src/components/ui-components/Badge/BadgesWithIconText";
import Default from "src/components/ui-components/Badge/Default";
import IconBadge from "src/components/ui-components/Badge/IconBadge";
import LightBadges from "src/components/ui-components/Badge/LightBadges";
import LinkBadges from "src/components/ui-components/Badge/LinkBadges";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";



const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Badges",
  },
];

const FlowbiteBadge = () => {
  return (
    <>
      <BreadcrumbComp title="Badges" items={BCrumb} />

      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <Default />
        </div>
        {/* Light */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LightBadges />
        </div>
        {/* Link */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LinkBadges />
        </div>
        {/* Icon & Text */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <BadgesWithIconText />
        </div>
        {/* Icon*/}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <IconBadge />
        </div>
        {/* Sizes*/}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <BadgeSizes />
        </div>
      </div>
    </>
  );
};

export default FlowbiteBadge;
