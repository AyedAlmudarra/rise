import { Button } from "flowbite-react";
import CardBox from "@/components/shared/CardBox";
import Logo from "@/layouts/full/shared/logo/Logo";
import AuthForgotPassword from "../authforms/AuthForgotPassword";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen bg-muted dark:bg-dark">
        <div className="flex h-full justify-center items-center px-4">
          <CardBox className="md:w-[450px] w-full border-none">
            <div className="mx-auto pt-3">
              <Logo />
            </div>
            <p className="text-darklink text-sm text-center my-4">Please enter the email address associated with your account and We will email you a link to reset your password.</p>
            <AuthForgotPassword />
            <Button
                  color={"lightprimary"}
                  as={Link}
                  to="/auth/auth2/login"
                  className="rounded-md w-full mt-3"
                >
                  Back to Login
                </Button>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
