import { useState } from 'react';
import { Navbar } from 'flowbite-react';
import { IconChevronDown } from '@tabler/icons-react';
import ChildComponent, { NavItem } from './ChildComponent';
import { Icon } from "@iconify/react";
import Menuitems from '../MenuData';
import { Link, useLocation } from 'react-router';

type ItemId = string | number;

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState<ItemId | null>(null);
  const [active, setActive] = useState<ItemId>(Menuitems[0]?.id);

  const location = useLocation();
  const pathname = location.pathname;

  const handleDropdownEnter = (itemId: ItemId) => {
    setActiveDropdown(itemId);
    setActive(itemId);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const handleChildClick = (parentId: ItemId) => {
    setActive(parentId);
  };

  return (
    <Navbar fluid={true} rounded={true} className="horizontal-nav bg-transparent dark:bg-transparent sm:px-0 xl:py-4 py-0">
      <Navbar.Collapse className="xl:block">
        <ul className="flex items-center space-x-3">
          {Menuitems.map((item) => {
            let isActive = false;
            if (item.children) {
                item.children.find((childItem: NavItem) => {
                  if(childItem?.children){
                    let nestedValue = childItem.children.find((value: NavItem) => value.href === pathname);
                    if(nestedValue) { isActive = true; return true; }
                  } else {
                    if (childItem.href === pathname) { isActive = true; return true; }
                  }
                  return false;
                })
            } else {
                 if (item.href === pathname) { isActive = true; }
            }

            return (
              <li key={item.id} className="relative group">
              {item.children ? (
                <div
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter(item.id)}
                >
                  <p
                    className={`w-full ${isActive
                      ? 'text-primary bg-lightprimary dark:bg-lightprimary dark:text-primary'
                      : 'group-hover:bg-lightprimary group-hover:text-primary'
                      } py-2.5 px-5 rounded-lg flex gap-3 items-center text-ld`}
                  >
                    <Link to={item.href}>
                      <span className="flex gap-2 items-center w-full ">
                        {item.icon && (
                          typeof item.icon === 'string' ? 
                          <Icon icon={item.icon} height={18} /> :
                          item.icon
                        )}
                        <span className='text-nowrap' >{item.title}</span>
                        {item.children && <IconChevronDown size={18} className='ms-auto' />}
                      </span>
                    </Link>
                  </p>
                  {activeDropdown === item.id && (
                    <div
                      className={`absolute left-0 rtl:right-0 mt-2  bg-white dark:bg-dark rounded-md shadow-lg ${(item as any).column == 4 ? 'w-screen max-w-[800px]' : 'w-52'}`}
                      onMouseEnter={() => handleDropdownEnter(item.id)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <ul className={`p-3 text-sm  gap-2  ${(item as any).column == 4 ? 'two-cols' : 'flex flex-col'} `}>
                        {item.children.map((child) => (
                          <li key={child.id} className={` ${(item as any).column == 4 ? 'mb-2' : ''} `}>
                            <ChildComponent
                              item={child as any}
                              title={item.title}
                              isActive={activeDropdown === item.id}
                              onClick={() => handleChildClick(item.id)}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link to={item.href}>
                  <p className={`py-2 px-3 rounded-lg flex gap-3 items-center ${active === item.id ? 'bg-error text-white' : 'group-hover/nav:bg-primary group-hover/nav:text-primary'}`}>
                    {item.icon && (
                      typeof item.icon === 'string' ? 
                      <Icon icon={item.icon} height={18} /> :
                      item.icon
                    )}
                    <span>{(`${item.title}`)}</span>
                  </p>
                </Link>
              )}
            </li>
            )
          })}
        </ul>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
