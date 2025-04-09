
import BasicTab from 'src/components/shadcn-ui/Tab/BasicTab';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Tab",
    },
  ];
const page = () => {
  return (
    <>
    <BreadcrumbComp title="Tab" items={BCrumb} />
    <div className="grid grid-cols-12 gap-30">
      {/* Basic */}
      <div className="lg:col-span-6 md:col-span-6 col-span-12">
        <BasicTab/>
      </div>

    </div>
  </>
  )
}

export default page