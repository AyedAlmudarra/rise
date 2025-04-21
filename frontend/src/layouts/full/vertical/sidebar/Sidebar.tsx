import React, { useContext, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { IconSidebar } from "./IconSidebar";
import SidebarContent, { MenuItem, ChildItem } from "./Sidebaritems";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SimpleBar from "simplebar-react";
import { CustomizerContext } from "src/context/CustomizerContext";
import { useAuth } from "src/context/AuthContext";
import { useLocation } from "react-router";
import SideProfile from "./SideProfile/SideProfile";

// Type guard to check if a role is valid
const isValidRole = (role: string | null): role is 'startup' | 'investor' => {
  return role === 'startup' || role === 'investor';
};

const SidebarLayout = () => {
  const { selectedIconId, setSelectedIconId } = useContext(CustomizerContext) || {};
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

  // Function to find the top-level icon ID based on the active child URL
  function findActiveIconId(content: MenuItem[], targetUrl: string, currentRole: 'startup' | 'investor' | null): string | null {
    for (const topLevelItem of content) {
      // Check if top-level item is visible for the role
      if (!filterByRole(topLevelItem)) {
        continue; // Skip if not visible
      }
      
      if (topLevelItem.items) {
        for (const section of topLevelItem.items) {
          // Check if section is visible for the role
          if (!filterByRole(section)) {
            continue; // Skip section if not visible
          }
          
          if (section.children) {
            for (const child of section.children) {
              // Check if child item is visible for the role
              if (!filterByRole(child)) {
                continue; // Skip child if not visible
              }
              
              if (child.url === targetUrl) {
                return topLevelItem.id ?? null;
              }
              // Recursive check for nested children (if applicable)
              // if (child.children && findNestedActiveIconId(child.children, targetUrl, currentRole)) {
              //   return topLevelItem.id ?? null;
              // }
            }
          }
        }
      }
    }
    return null; // URL not found or no matching icon
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
