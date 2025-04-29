import { Icon } from "@iconify/react";
import { useState } from "react";
import * as AppsData from "./Data";
import Quicklinks from "./Quicklinks";
import { IconHelp } from "@tabler/icons-react";
import { Drawer } from "flowbite-react";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";

const AppLinks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <>
      <div className="relative z-[50]">
        <span
          onClick={handleOpen}
          className="h-10 w-10 hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer xl:flex hidden"
        >
          <Icon icon="solar:widget-3-line-duotone" height={20} />
        </span>

        <span
          className="xl:hidden h-10 w-10 hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer"
          onClick={handleOpen}
        >
          <Icon icon="solar:widget-3-line-duotone" height={20} />
        </span>

        <Drawer
          open={isOpen}
          onClose={handleClose}
          position="right"
          className="w-64 sm:w-[900px]"
        >
          <SimpleBar className="md:h-auto h-[calc(100vh_-_50px)]">
            <div className="grid grid-cols-12 w-full">
              <div className="xl:col-span-8 col-span-12 flex items-stretch xl:pr-0 xl:px-3 rtl:pr-3 px-5 py-5">
                <div className="grid grid-cols-12 gap-3 w-full">
                  {AppsData.appsLink.map((links) => (
                    <div
                      className="col-span-12 xl:col-span-6 flex items-stretch"
                      key={links.href}
                    >
                      <ul>
                        <li>
                          <Link
                            to={links.href}
                            className="flex gap-3 items-center hover:text-primary group relative"
                          >
                            <span className="bg-lighthover dark:bg-darkgray  h-10 w-10 flex justify-center items-center rounded-full">
                              <img
                                src={links.avatar}
                                width={20}
                                height={20}
                                alt="materialm"
                              />
                            </span>
                            <div>
                              <h6 className="font-semibold text-sm text-ld hover:text-primary mb-1 ">
                                {links.title}
                              </h6>
                              <p className="text-xs text-link dark:text-darklink opacity-90 font-medium">
                                {links.subtext}
                              </p>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  ))}
                  <div className="col-span-12 md:col-span-12 border-t border-border dark:border-darkborder hidden xl:flex items-stretch pt-4 pr-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center text-dark dark:text-darklink">
                        <i className="ti ti-help text-lg "></i>
                        <Link
                          to={"/theme-pages/faq"}
                          className="text-sm font-semibold hover:text-primary ml-2 flex gap-2 items-center"
                        >
                          <IconHelp width={20} />
                          Frequently Asked Questions
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xl:col-span-4 col-span-12  flex items-strech">
                <Quicklinks />
              </div>
            </div>
          </SimpleBar>
        </Drawer>
      </div>
    </>
  );
};

export default AppLinks;
