import DefaultList from "src/components/ui-components/ListGroup/DefaultList";
import LinkList from "src/components/ui-components/ListGroup/LinkList";
import ListButton from "src/components/ui-components/ListGroup/ListButton";
import ListIcon from "src/components/ui-components/ListGroup/ListIcon";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "List Group",
  },
];
const FlowbiteListgroup = () => {
  return (
    <>
      <BreadcrumbComp title="List Group" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <DefaultList />
        </div>
        {/* LinkList */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <LinkList />
        </div>
        {/* ListButton */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ListButton />
        </div>
        {/* ListIcon */}
        <div className="lg:col-span-6 md:col-span-6 col-span-12">
          <ListIcon />
        </div>
      </div>
    </>
  );
};

export default FlowbiteListgroup;
