import { Link } from "react-router-dom";
import Logo from "src/layouts/full/shared/logo/Logo";
import AuthRegisterInvestor from "./authforms/AuthRegisterInvestor"; // Corrected import
import LeftSidebarPart from "./LeftSidebarPart";

const RegisterInvestor = () => {
  return (
    <>
      <div className="relative overflow-hidden min-h-screen">
        <div className="grid grid-cols-12 gap-3 bg-white dark:bg-darkgray">
          {/* Left Sidebar (visible on large screens) */}
          <div className="xl:col-span-4 lg:col-span-4 col-span-12 bg-dark lg:block hidden relative overflow-hidden min-h-screen">
            <LeftSidebarPart />
          </div>

          {/* Registration Form Section */}
          <div className="xl:col-span-8 lg:col-span-8 col-span-12 sm:px-12 px-4 overflow-y-auto flex flex-col">
            <div className="flex flex-grow items-center py-10 px-3 max-w-[600px] mx-auto w-full">
              <div className="w-full">
                <Logo />
                <h3 className="text-2xl font-bold my-3">Register as an Investor</h3>
                <p className="text-darklink text-sm font-medium mb-6">
                  Join RISE to connect with promising startups.
                </p>
                
                {/* Render the investor registration form */}
                <AuthRegisterInvestor /> 

                {/* Link to Sign In */}
                <div className="flex gap-2 text-base text-ld font-medium mt-6 items-center justify-start">
                  <p>Already have an Account?</p>
                  <Link
                    to={"/auth/auth1/login"} // Link to the login page
                    className="text-primary text-sm font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterInvestor; 