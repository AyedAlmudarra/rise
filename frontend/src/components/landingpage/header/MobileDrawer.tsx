
import { useState } from "react";
import { Button, Drawer } from "flowbite-react";
import { IconMenu2 } from "@tabler/icons-react";
import MobileDemosMenu from "./MobileDemoMenus";
import FullLogo from "src/layouts/full/shared/logo/FullLogo";
import { Link } from "react-router";

const MobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  return (
    <>
      <div className="xl:hidden flex">
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center text-dark  h-10 w-10 rounded-full bg-transparent hover:bg-lightprimary"
        >
          <IconMenu2 />
        </Button>
      </div>
      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Items className="p-6">
          <FullLogo />
          <MobileDemosMenu />
          <Link
            className="block py-3 text-base text-ld font-semibold"
            to={""}
          >
            Documentation
          </Link>
          <Link
            className="block py-3 text-base text-ld font-semibold"
            to={"https://support.wrappixel.com/"}
          >
            Support
          </Link>
          <Button color={"primary"} className="mt-2" as={Link} to="/auth/auth1/login">Login</Button>
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default MobileDrawer;
