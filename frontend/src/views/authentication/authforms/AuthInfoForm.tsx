import React, { useState } from 'react';
import { Input } from '@/components/shadcn-ui/Default-Ui/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '@/types/startupRegistration';
import { Mail, Lock, Eye, EyeOff, User, Briefcase, GraduationCap, Calendar, Code, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/shadcn-ui/Default-Ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn-ui/Default-Ui/select";
import { Textarea } from '@/components/shadcn-ui/Default-Ui/textarea';
import { Checkbox } from "@/components/shadcn-ui/Default-Ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn-ui/Default-Ui/tooltip";
import { motion } from "framer-motion";
import { Badge } from "@/components/shadcn-ui/Default-Ui/badge";

const educationLevels = [
  { value: "high_school", label: "High School" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "phd", label: "PhD/Doctorate" },
  { value: "other", label: "Other" },
];

const experienceLevels = [
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10+", label: "10+ years" },
];

const techSkills = [
  { id: "programming", label: "Programming" },
  { id: "data_analysis", label: "Data Analysis" },
  { id: "design", label: "Design/UX" },
  { id: "marketing", label: "Digital Marketing" },
  { id: "ai_ml", label: "AI/Machine Learning" },
];

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  // Calculate strength based on length, special chars, numbers, uppercase
  const getStrength = () => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
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

const AuthInfoForm: React.FC = () => {
  const { control, watch } = useFormContext<StartupRegistrationData>();
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Account Information</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Create your RISE platform account and tell us about your background.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {/* Account Information Section */}
        <div className="md:col-span-2 mb-2">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl blur-md opacity-80"></div>
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-blue-100 dark:border-indigo-900/30 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Login Credentials
              </h3>
              
              <motion.div 
                className="space-y-6"
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
                <motion.div variants={formItemVariants} custom={0}>
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
                              placeholder="your.email@company.com" 
                              {...field} 
                              className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950 pl-10"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              <Mail className="h-4 w-4" />
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          This will be your login email and where we'll send important updates.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={formItemVariants} custom={1}>
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
                          Password must include uppercase, lowercase, number, and special character.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={formItemVariants} custom={2}>
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
                              placeholder="Confirm your password" 
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
          </motion.div>
        </div>

        {/* Founder Background Section */}
        <div className="md:col-span-2 mt-2">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl blur-md opacity-80"></div>
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-900/30 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
                  <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                Founder Background
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2 h-6 w-6 rounded-full">
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">?</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-white/95 dark:bg-gray-800/95 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md backdrop-blur-sm">
                      <p className="text-sm">
                        This information helps us understand your expertise and connect you with relevant investors and resources.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
              
              <motion.div 
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.3
                    }
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <motion.div variants={formItemVariants} custom={0}>
                    <FormField
                      control={control}
                      name="founderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <User className="h-4 w-4 text-purple-500" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <User className="h-4 w-4" />
                              </div>
                              <Input 
                                placeholder="Ayed Almudarra" 
                                {...field} 
                                className="border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-950 pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={formItemVariants} custom={1}>
                    <FormField
                      control={control}
                      name="founderTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Briefcase className="h-4 w-4 text-purple-500" />
                            Job Title
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <Briefcase className="h-4 w-4" />
                              </div>
                              <Input 
                                placeholder="CEO / CTO / Co-Founder" 
                                {...field} 
                                className="border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-950 pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <motion.div variants={formItemVariants} custom={2}>
                    <FormField
                      control={control}
                      name="founderEducation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <GraduationCap className="h-4 w-4 text-purple-500" />
                            Education
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-950">
                                <SelectValue placeholder="Select your education level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-gray-950">
                              {educationLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={formItemVariants} custom={3}>
                    <FormField
                      control={control}
                      name="previousStartupExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Calendar className="h-4 w-4 text-purple-500" />
                            Previous Startup Experience
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-950">
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-gray-950">
                              {experienceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <motion.div variants={formItemVariants} custom={4}>
                  <FormField
                    control={control}
                    name="founderBio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <User className="h-4 w-4 text-purple-500" />
                          Short Bio
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share a brief professional background..." 
                            className="resize-none min-h-[120px] border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-950"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Briefly describe your professional background (500 characters max)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={formItemVariants} custom={5}>
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Code className="h-4 w-4 text-purple-500" />
                      Technical Skills
                    </FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {techSkills.map((skill) => (
                        <FormField
                          key={skill.id}
                          control={control}
                          name={`techSkills.${skill.id}` as any}
                          render={({ field }) => (
                            <FormItem key={skill.id} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {skill.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      Select all that apply to you
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthInfoForm; 