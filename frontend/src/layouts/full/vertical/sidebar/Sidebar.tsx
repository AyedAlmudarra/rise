import React, { useContext, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { IconSidebar } from "./IconSidebar";
import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SimpleBar from "simplebar-react";
import { CustomizerContext } from "@/context/CustomizerContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router";
import SideProfile from "./SideProfile/SideProfile";

// Type guard to check if a role is valid
const isValidRole = (role: string | null): role is 'startup' | 'investor' => {
  return role === 'startup' || role === 'investor';
};

const SidebarLayout = () => {
  const { selectedIconId, setSelectedIconId } = useContext(CustomizerContext);
  const { userRole } = useAuth();

  // --- Role-Based Filtering Logic ---
  const filterByRole = <T extends { roles?: ('startup' | 'investor' | 'all')[] }>(item: T): boolean => {
    if (!item.roles) return true; // If no roles defined, show to all
    if (item.roles.includes('all')) return true; // If 'all' is present, show to all
    if (userRole && isValidRole(userRole) && item.roles.includes(userRole)) return true; // If user has a valid role and it's included, show
    return false; // Otherwise, hide
  };

  // 1. Filter the entire SidebarContent based on role first
  const roleFilteredSidebarContent = SidebarContent.filter(filterByRole);

  // 2. Find the content matching the selected icon ID from the filtered list
  const selectedContent = roleFilteredSidebarContent.find(
    (data) => data.id === selectedIconId
  );

  // --- Active URL Logic (to select the correct icon on page load) ---
  const location = useLocation();
  const pathname = location.pathname;

  // Refactored function to find the top-level icon ID
  function findActiveIconId(content: any[], targetUrl: string, currentRole: 'startup' | 'investor' | null): string | null {
    // Define filter function based on role
    const filterFn = (item: any): boolean => {
        if (!item?.roles) return true; // Allow items without roles defined
        if (item.roles.includes('all')) return true;
        if (currentRole && isValidRole(currentRole) && item.roles.includes(currentRole)) return true;
        return false;
    };

    // Recursive helper to search within children or items arrays
    function searchChildren(items: any[]): boolean {
        for (const item of items) {
            if (!filterFn(item)) continue; // Skip invisible items

            // Direct match at this level
            if (item.url === targetUrl) {
                return true;
            }
            // Recursively search in children array
            if (item.children && searchChildren(item.children)) {
                return true;
            }
            // Recursively search in items array (for top-level structure)
            if (item.items && searchChildren(item.items)) {
                return true;
            }
        }
        return false; // Not found in this branch
    }

    // Iterate through top-level items only
    for (const topLevelItem of content) {
        if (!filterFn(topLevelItem)) continue; // Skip invisible top-level items

        // Check if the target URL exists within the descendants of this top-level item
        if (topLevelItem.items && searchChildren(topLevelItem.items)) {
            return topLevelItem.id ?? null;
        }
    }

    return null; // URL not found in any visible top-level item's descendants
  }

  useEffect(() => {
    // Pass the original unfiltered SidebarContent and userRole to find the correct icon
    const activeIconId = findActiveIconId(SidebarContent, pathname, userRole);
    // Check if activeIconId is found AND it's different from the currently selected one
    // This prevents unnecessary updates if the URL matches the already selected section
    if (activeIconId && activeIconId !== selectedIconId) { 
      setSelectedIconId(activeIconId);
    }
    // Only trigger effect based on pathname and userRole changes
    // setSelectedIconId is stable and doesn't need to be listed if using React hooks lint rules
  }, [pathname, userRole, setSelectedIconId]); // Removed selectedIconId

  return (
    <>
      <div className="xl:block hidden">
        <div className="minisidebar-icon border-e border-ld bg-white dark:bg-darkgray fixed start-0 z-[1]">
          <IconSidebar />
          <SideProfile />
        </div>
        <Sidebar
          className="fixed menu-sidebar pt-8 bg-white dark:bg-darkgray ps-4 rtl:pe-4 rtl:ps-0"
          aria-label="Sidebar with multi-level dropdown example"
        >
          <SimpleBar className="h-[calc(100vh_-_85px)]">
            <Sidebar.Items className="pe-4 rtl:pe-0 rtl:ps-4">
              <Sidebar.ItemGroup className="sidebar-nav hide-menu ">
                {selectedContent &&
                  selectedContent.items
                    ?.filter(filterByRole)
                    .map((item, index) => (
                      <React.Fragment key={item.heading ?? index}>
                        <h5 className="text-link font-semibold text-sm caption ">
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

export default SidebarLayout;
