import { Breadcrumb } from "flowbite-react";
import { Link } from "react-router-dom";
import CardBox from "@/components/shared/CardBox";

interface BreadcrumbItemType {
  title: string;
  to?: string;
}

interface BreadCrumbType {
  items?: BreadcrumbItemType[];
  title: string;
}

const BreadcrumbComp = ({ items = [], title }: BreadCrumbType) => {
  return (
    <>
      <CardBox className={`mb-[30px]`}>
        <Breadcrumb aria-label="breadcrumb">
          <div className="flex justify-between items-center">
            <h6 className="text-base font-semibold">{title}</h6>
            <div className="flex items-center gap-1.5 text-sm">
              {items.map((item, index) => (
                <Breadcrumb.Item key={item.title}>
                  {item.to && index < items.length - 1 ? (
                    <Link to={item.to} className="text-primary hover:underline">
                      {item.title}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">
                      {item.title}
                    </span>
                  )}
                </Breadcrumb.Item>
              ))}
            </div>
          </div>
        </Breadcrumb>
      </CardBox>
    </>
  );
};

export default BreadcrumbComp;
