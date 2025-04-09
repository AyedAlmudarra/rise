import ActionCard from "src/components/ui-components/Card/ActionCard";
import CardWithImage from "src/components/ui-components/Card/CardWithImage";
import CardWithList from "src/components/ui-components/Card/CardWithList";
import CTACardButton from "src/components/ui-components/Card/CTACardButton";
import CustomImageREnder from "src/components/ui-components/Card/CustomImageREnder";
import DefaultCard from "src/components/ui-components/Card/DefaultCard";
import EcommerceCard from "src/components/ui-components/Card/EcommerceCard";
import FormCard from "src/components/ui-components/Card/FormCard";
import HorizontalCard from "src/components/ui-components/Card/HorizontalCard";
import PricingCard from "src/components/ui-components/Card/PricingCard";
import UserProfileCard from "src/components/ui-components/Card/UserProfileCard";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Card",
  },
];

const FlowbiteCard = () => {
  return (
    <>
      <BreadcrumbComp title="Card" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-6 col-span-12">
          <DefaultCard />
        </div>
        {/* CTA Card Button */}
        <div className="lg:col-span-6 col-span-12">
          <CTACardButton />
        </div>
        {/* Card With Image */}
        <div className="lg:col-span-6 col-span-12">
          <CardWithImage />
        </div>
        {/* Custom Image Render */}
        <div className="lg:col-span-6 col-span-12">
          <CustomImageREnder />
        </div>
        {/* Horizontal Card */}
        <div className=" col-span-12">
          <HorizontalCard />
        </div>
        {/* User Profile Card */}
        <div className="lg:col-span-6 col-span-12">
          <UserProfileCard />
        </div>
        {/* Form Card */}
        <div className="lg:col-span-6 col-span-12">
          <FormCard />
        </div>
        {/* Card With List */}
        <div className="lg:col-span-6 col-span-12">
          <CardWithList />
        </div>
         {/* Pricing Card */}
         <div className="lg:col-span-6 col-span-12">
          <PricingCard />
        </div>
        {/* Ecommerce Card */}
        <div className="lg:col-span-6 col-span-12">
          <EcommerceCard />
        </div>
        {/* Action Card */}
        <div className="lg:col-span-6 col-span-12">
          <ActionCard />
        </div>
      </div>
    </>
  );
};

export default FlowbiteCard;
