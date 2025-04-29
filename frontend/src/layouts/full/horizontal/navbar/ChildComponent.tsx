import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";

// Define the structure for a navigation item
export interface NavItem {
  id: string | number; // Assuming an id exists for keys
  title: string;
  icon?: string | React.ReactNode; // Allow string or component type
  href: string;
  children?: NavItem[]; // Optional children for submenus
}

// Define the props for the ChildComponent
interface ChildComponentProps {
  item: NavItem;
  isActive?: boolean; // Prop received but not directly used for rendering logic here, only passed down
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  title?: string; // Used for special positioning class
}

const ChildComponent = ({
  item,
  isActive,
  onClick,
  title
}: ChildComponentProps) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;

  const handleSubMenuEnter = () => {
    setIsSubMenuOpen(true);
  };

  const handleSubMenuLeave = () => {
    setIsSubMenuOpen(false);
  };
  const { t } = useTranslation();

  return (
    <div
      className="relative group"
      onMouseEnter={handleSubMenuEnter}
      onMouseLeave={handleSubMenuLeave}
      onClick={onClick}
    >
      <Link to={item.href}>
        <p
          className={`w-full ${
            item.href === pathname
              ? "text-primary dark:text-primary hover:text-primary"
              : "group-hover/nav:bg-lightprimary group-hover/nav:text-primary"
          } py-1 px-3 rounded-md flex gap-3 items-center text-ld  hover:text-primary`}
        >
          <span className="flex gap-3 items-center w-full">
            {item.icon && (
              typeof item.icon === 'string' ? 
              <Icon icon={item.icon} height={18} /> :
              item.icon
            )}
            <span className="line-clamp-1 max-w-24 overflow-hidden text-nowrap">
              {t(`${item.title}`)}
            </span>
            {item.children && <IconChevronDown size={18} className="ms-auto" />}
          </span>
        </p>
      </Link>
      {isSubMenuOpen && item.children && (
        <div className={`absolute   top-0 mt-0 w-56 bg-white dark:bg-dark rounded-md shadow-lg ${title=="Tables"?"tables-position":"left-full rtl:right-full"}`}>
          <ul className="p-3 flex flex-col gap-2">
            {item.children.map((child: NavItem) => (
              <li key={child.id}>
                {child.children ? (
                  <ChildComponent
                    item={child}
                    isActive={isActive}
                  />
                ) : (
                  <Link to={child.href}>
                    <p
                      className={`group/menu hover:text-primary ${
                        child.href == pathname
                          ? "!text-primary "
                          : "group-hover/nav:bg-lightprimary group-hover/nav:text-primary"
                      } py-1 px-3 rounded-lg flex gap-2 items-center text-ld opacity-80 hover:text-primary`}
                    >
                      <span
                        className={` ${
                          child.href == pathname
                            ? "bg-primary dark:bg-primary"
                            : "bg-dark dark:bg-white"
                        } group-hover/menu:bg-primary  rounded-lg mx-1.5 h-[6px] w-[6px]`}
                      ></span>
                      {t(`${child.title}`)}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChildComponent;


