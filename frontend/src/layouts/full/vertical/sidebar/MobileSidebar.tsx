import React, { useContext } from "react";
import { Sidebar } from "flowbite-react";
import { IconSidebar } from "./IconSidebar";
import SidebarContent, { MenuItem, ChildItem } from "./Sidebaritems";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SimpleBar from "simplebar-react";
import { CustomizerContext } from "../../../../context/CustomizerContext";
import { useAuth } from "src/context/AuthContext";

const MobileSidebar = () => {
  const { selectedIconId } = useContext(CustomizerContext) || {};
  const { userRole } = useAuth();

  const filterByRole = <T extends { roles?: ('startup' | 'investor' | 'all')[] }>(item: T): boolean => {
    if (!item.roles) return true;
    if (item.roles.includes('all')) return true;
    if (userRole && (userRole === 'startup' || userRole === 'investor') && item.roles.includes(userRole)) return true;
    return false;
  };

  const roleFilteredSidebarContent = SidebarContent.filter(filterByRole);

  const selectedContent = roleFilteredSidebarContent.find(
    (data) => data.id === selectedIconId
  );

  return (
    <>
      <div>
        <div className="minisidebar-icon border-e border-ld bg-white dark:bg-darkgray fixed start-0 z-[1] ">
          <IconSidebar />
        </div>
        <Sidebar
          className="fixed menu-sidebar pt-8 bg-white dark:bg-darkgray transition-all"
          aria-label="Sidebar with multi-level dropdown example"
        >
          <SimpleBar className="h-[calc(100vh_-_85px)]">
            <Sidebar.Items className="ps-4 pe-4">
              <Sidebar.ItemGroup className="sidebar-nav">
                {selectedContent &&
                  selectedContent.items
                    ?.filter(filterByRole)
                    .map((item, index) => (
                      <React.Fragment key={item.heading ?? index}>
                        <h5 className="text-link font-semibold text-sm caption">
                          {item.heading}
                        </h5>
                        {item.children
                          ?.filter(filterByRole)
                          .map((child) => (
                            <React.Fragment key={child.id ?? child.name}>
                              {child.children ? (
                                <NavCollapse item={child} />
                              ) : (
                                <NavItems item={child} />
                              )}
                            </React.Fragment>
                          ))}
                      </React.Fragment>
                    ))}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </SimpleBar>
        </Sidebar>
      </div>
    </>
  );
};

export default MobileSidebar;
