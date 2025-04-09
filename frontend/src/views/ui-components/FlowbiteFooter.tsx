import DefaultFooter from "src/components/ui-components/Footer/DefaultFooter";
import FooterWithLogo from "src/components/ui-components/Footer/FooterWithLogo";
import SitemapLinkFooter from "src/components/ui-components/Footer/SitemapLinkFooter";
import SocialFooter from "src/components/ui-components/Footer/SocialFooter";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Footer",
  },
];
const FlowbiteFooter = () => {
  return (
    <>
      <BreadcrumbComp title="Footer" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="col-span-12">
          <DefaultFooter />
        </div>
        {/* Footer With Logo */}
        <div className="col-span-12">
          <FooterWithLogo />
        </div>
        {/* Social Footer */}
        <div className="col-span-12">
          <SocialFooter />
        </div>
        {/* Sitemap Link Footer */}
        <div className="col-span-12">
          <SitemapLinkFooter />
        </div>
      </div>
    </>
  );
};

export default FlowbiteFooter;
