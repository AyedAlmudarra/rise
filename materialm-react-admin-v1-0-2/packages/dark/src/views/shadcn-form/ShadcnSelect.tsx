
import DefaultSelect from "src/components/shadcn-form/Select/DefaultSelect";
import ScrollableSelect from "src/components/shadcn-form/Select/ScrollableSelect";
import FormSelect from "src/components/shadcn-form/Select/FormSelect";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Select",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Select" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <DefaultSelect />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <ScrollableSelect />
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <FormSelect />
        </div>
      </div>
    </>
  );
};

export default page;
