import DefaultPagination from "src/components/ui-components/Pagination/DefaultPagination";
import PaginationControl from "src/components/ui-components/Pagination/PaginationControl";
import PaginationWithIcon from "src/components/ui-components/Pagination/PaginationWithIcon";
import PrevNextPagiantion from "src/components/ui-components/Pagination/PrevNextPagiantion";
import PrevNextPagiantionIcon from "src/components/ui-components/Pagination/PrevNextPagiantionIcon";
import TableDataPaginationIcon from "src/components/ui-components/Pagination/TableDataPaginationIcon";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Pagination",
  },
];
const FlowbitePagination = () => {
  return (
    <>
      <BreadcrumbComp title="Pagination" items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">
        {/* Default */}
        <div className="lg:col-span-6 col-span-12">
          <DefaultPagination />
        </div>
        {/* With Icons */}
        <div className="lg:col-span-6 col-span-12">
          <PaginationWithIcon />
        </div>
        {/* Prev Next Pagiantion */}
        <div className="lg:col-span-4 col-span-12">
          <PrevNextPagiantion />
        </div>
        {/* Prev Next Pagiantion Icon */}
        <div className="lg:col-span-4 col-span-12">
          <PrevNextPagiantionIcon />
        </div>
        {/* Table Data PaginationIcon */}
        <div className="lg:col-span-4 col-span-12">
          <TableDataPaginationIcon />
        </div>
        {/* Table Data PaginationIcon */}
        <div className="col-span-12">
          <PaginationControl />
        </div>
      </div>
    </>
  );
};

export default FlowbitePagination;
