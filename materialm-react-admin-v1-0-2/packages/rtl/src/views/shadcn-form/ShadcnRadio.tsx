
import DefaultRadio from "src/components/shadcn-form/Radio/DefaultRadio";
import FormRadio from "src/components/shadcn-form/Radio/FormRadio";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Radio",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Radio" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DefaultRadio />
        </div>
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <FormRadio />
        </div>
      </div>
    </>
  );
};

export default page;
