// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useContext } from "react";
import { Icon } from "@iconify/react";
import MiniSidebarIcons from "./MiniSidebar";
import SimpleBar from "simplebar-react";
import { Button, Tooltip } from "flowbite-react";
import { CustomizerContext } from "src/context/CustomizerContext";
import { useAuth } from "src/context/AuthContext";
import Logo from "../../shared/logo/Logo";

export const IconSidebar = () => {
  const { selectedIconId, setSelectedIconId, setIsCollapse } = useContext(CustomizerContext) || {};
  const { userRole } = useAuth();

  // Filter icons based on user role
  const visibleIcons = MiniSidebarIcons.filter(icon => 
    icon.roles.includes('all') || (userRole && icon.roles.includes(userRole))
  );

  // Handle icon click
  const handleClick = (id: string) => {
    setSelectedIconId(id);
    setIsCollapse("full-sidebar");
  };

  return (
    <>
      <div className="px-4 py-6 pt-7 logo">
        <Logo />
      </div>
      <SimpleBar className="miniicons relative">
        {visibleIcons.map((link, index) => (
          <Tooltip key={link.id} content={link.tooltip} placement="right" className="flowbite-tooltip">
            <Button
              className={`h-12 w-12 hover:text-primary text-darklink hover:bg-lightprimary rounded-full flex justify-center items-center mx-auto mb-2 ${link.id === selectedIconId ? "text-primary bg-lightprimary" : "text-darklink bg-transparent"}`}
              type="button"
              onClick={() => handleClick(link.id)}
            >
              <Icon icon={link.icon} height={24} className="dark:bg-blue" />
            </Button>
          </Tooltip>
        ))}
      </SimpleBar>
    </>
  );
};



