import { Link } from "react-router-dom";
import Logo from "src/layouts/full/shared/logo/Logo";
import AuthLogin from "../authforms/AuthLogin";
import SocialButtons from "../authforms/SocialButtons";
import LeftSidebarPart from "../LeftSidebarPart";
import { Card, Button } from "flowbite-react";

const Login = () => {
  return (
    <>
      <div className="relative overflow-hidden min-h-screen">
        <div className="grid grid-cols-12 gap-3 bg-white dark:bg-darkgray">
          <div className="xl:col-span-4 lg:col-span-4 col-span-12 bg-dark lg:block hidden relative overflow-hidden min-h-screen">
            <LeftSidebarPart />
          </div>
          <div className="xl:col-span-8 lg:col-span-8 col-span-12 sm:px-12 px-4 flex items-center justify-center">
            <Card className="max-w-md w-full p-6 lg:p-8 shadow-lg dark:bg-gray-800">
              <div className="mb-6 text-center">
                <Logo />
                <h3 className="text-2xl font-bold my-3 text-gray-900 dark:text-white">Sign In to RISE</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your credentials to continue
                </p>
              </div>

              <AuthLogin />

              <div className="text-sm text-right mt-4">
                 <Link
                   to="/auth/auth1/forgot-password"
                   className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                 >
                   Forgot password?
                 </Link>
               </div>

              <hr className="my-6 border-gray-300 dark:border-gray-600" />
              <div className="text-center mb-2 text-sm text-gray-600 dark:text-gray-400">
                New to RISE? Join as:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Button 
                    as={Link} 
                    to="/auth/register/startup"
                    color="light"
                    className="w-full"
                  >
                    Startup
                  </Button>
                  <Button 
                    as={Link} 
                    to="/auth/register/investor" 
                    color="light"
                    className="w-full"
                  >
                    Investor
                  </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
