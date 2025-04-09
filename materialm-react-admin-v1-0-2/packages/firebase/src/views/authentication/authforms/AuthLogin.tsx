import { Alert, Button, Checkbox, Label, TextInput } from "flowbite-react";

import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import useMounted from "src/guards/authGuard/UseMounted";
import useAuth from "src/guards/authGuard/UseAuth";
import { Link } from "react-router";


const AuthLogin = () => {
  
  const mounted = useMounted();
  const { signin } = useAuth();
  const [_isAlert, SetIsAlert] = useState(true);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: 'demo@demo.com',
      password: 'demo123',
      submit: null,
    },

    validationSchema: LoginSchema,

    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        await signin(values.email, values.password);

        if (mounted.current) {
          setStatus({ success: true });
          setSubmitting(true);
        }
      } catch (err: any) {
        if (mounted.current) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }
    },
  });
  const { errors, touched, handleSubmit,  getFieldProps } = formik;
  
  if(errors.submit){
    setTimeout(() => {
      SetIsAlert(false)
    }, 3000);
  }

  return (
    <>
          {errors.submit && (
    <Alert className="fixed top-10 z-[9999] start-1/2" color="failure" icon={() => <Icon className="text-lg" icon="solar:info-circle-bold" />}>
    <span className="font-medium ms-2 text-base">Login attempt failed</span> 
  </Alert>
      )}
    <FormikProvider value={formik}>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email" />
          </div>
          <TextInput
            id="email"
            type="text"
            sizing="md"
            {...getFieldProps('email')}
            className={`form-control ${touched.email && errors.email?'error-bordered':null}`}
          />
          {touched.email && errors.email?<p className="text-sm font-medium mt-1 text-error" >Enter valid email</p>:null}
          
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password" />
          </div>
          <TextInput
            id="password"
            type="password"
            sizing="md"
            {...getFieldProps('password')}
            className={`form-control ${touched.password && errors.password?'error-bordered':null}`}
          />
           {touched.password && errors.password?<p className="text-sm font-medium mt-1 text-error" >Enter valid password</p>:null}
        </div>
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept" 
              className="opacity-90 font-normal cursor-pointer"
            >
              Remeber this Device
            </Label>
          </div>
          <Link to={"/auth/auth1/forgot-password"} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link>
        </div>
        <Button color={"primary"} type="submit" className="!rounded-full w-full">
          Sign in
        </Button>
      </form>
      </FormikProvider>
    </>
  );
};

export default AuthLogin;
