import { Link } from "react-router-dom";
import CardBox from "@/components/shared/CardBox";
import Logo from "@/layouts/full/shared/logo/Logo";



const Register = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen bg-muted dark:bg-dark">
        <div className="flex h-full justify-center items-center px-4">
          <CardBox className="md:w-[450px] w-full border-none">
            <div className="mx-auto">
              <Logo />
            </div>
            <div className="flex gap-2 text-base text-ld font-medium mt-6 items-center justify-start">
                  <p>Already have an Account?</p>
                  <Link
                    to={"/auth/auth2/login"}
                    className="text-primary text-sm font-medium"
                  >
                    Sign in
                  </Link>
                </div>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default Register;
