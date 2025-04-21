import React, { useState } from 'react';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../components/shadcn-ui/Default-Ui/form";
import { InvestorRegistrationData } from '../../../types/investorRegistration';
import { Mail, Lock, Eye, EyeOff, User, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/shadcn-ui/Default-Ui/button';
import { motion } from "framer-motion";
import { Badge } from "../../../components/shadcn-ui/Default-Ui/badge";

// Reusable Password Strength Indicator (Copied from AuthInfoForm.tsx)
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Matches special chars
    return strength;
  };
  const strength = getStrength();
  const getColor = () => {
    switch (strength) {
      case 0: return "bg-gray-200 dark:bg-gray-700";
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-green-500";
      default: return "bg-gray-200 dark:bg-gray-700";
    }
  };
  const getMessage = () => {
    switch (strength) {
      case 0: return { text: "Enter a password", color: "text-gray-500" };
      case 1: return { text: "Weak", color: "text-red-500" };
      case 2: return { text: "Fair", color: "text-orange-500" };
      case 3: return { text: "Good", color: "text-yellow-500" };
      case 4: return { text: "Strong", color: "text-green-500" };
      default: return { text: "", color: "" };
    }
  };
  return (
    <div className="mt-2 space-y-2">
      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className={getMessage().color}>{getMessage().text}</span>
        {strength === 4 && (
          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 px-2 py-0 text-xs gap-1">
            <CheckCircle className="h-3 w-3" />
            Secure
          </Badge>
        )}
      </div>
    </div>
  );
};


const AuthInfoInvestorForm: React.FC = () => {
  const { control, watch } = useFormContext<InvestorRegistrationData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  // Get password for strength indicator
  const password = watch('password');

  // Animation variants for form items
  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <div className="space-y-8">
      {/* Title and Description */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Account & Personal Info</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Create your investor account and provide your basic contact details.
        </p>
      </motion.div>

      {/* Form Fields in a Card-like structure */}
      <motion.div
        className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-blue-100 dark:border-indigo-900/30 p-6 shadow-sm space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {/* Full Name */}
        <motion.div variants={formItemVariants} custom={0}>
          <FormField
            control={control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4 text-indigo-500" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Email Address */}
        <motion.div variants={formItemVariants} custom={1}>
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-indigo-500" />
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="your.email@investmentfirm.com"
                      {...field}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950"
                    />
                  </div>
                </FormControl>
                 <FormDescription>
                  This will be your login email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Password */}
        <motion.div variants={formItemVariants} custom={2}>
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Lock className="h-4 w-4 text-indigo-500" />
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Shield className="h-4 w-4" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter a secure password"
                      {...field}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 pr-10 pl-10 bg-white dark:bg-gray-950"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide" : "Show"} password</span>
                    </Button>
                  </div>
                </FormControl>
                <PasswordStrengthIndicator password={password} />
                <FormDescription>
                  Must be 8+ characters with uppercase, lowercase, number, and special character.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Confirm Password */}
        <motion.div variants={formItemVariants} custom={3}>
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Lock className="h-4 w-4 text-indigo-500" />
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Shield className="h-4 w-4" />
                    </div>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      {...field}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 pr-10 pl-10 bg-white dark:bg-gray-950"
                    />
                     <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showConfirmPassword ? "Hide" : "Show"} password</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthInfoInvestorForm; 