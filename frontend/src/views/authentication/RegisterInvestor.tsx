import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/layouts/full/shared/logo/Logo';
import LeftSidebarPart from './LeftSidebarPart'; // Reusing the same sidebar component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn-ui/Default-Ui/tabs";
import AuthInfoInvestorForm from './authforms/AuthInfoInvestorForm';
import InvestorProfileForm from './authforms/InvestorProfileForm';
import InvestorPreferencesForm from './authforms/InvestorPreferencesForm';
import { Button } from "@/components/shadcn-ui/Default-Ui/button";
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { investorRegistrationSchema, InvestorRegistrationData } from '@/types/investorRegistration';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn-ui/Default-Ui/alert";
import { Mail, Briefcase, CheckSquare, Send, Check, ChevronLeft, ChevronRight, Shield, Lock, Unlock } from "lucide-react";
import { Progress } from "@/components/shadcn-ui/Default-Ui/progress";
import { Separator } from "@/components/shadcn-ui/Default-Ui/separator";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/shadcn-ui/Default-Ui/card";
import { motion, AnimatePresence } from "framer-motion";

// Investor registration tab order
const tabOrder = ['auth-info', 'profile', 'preferences'];

// Investor tab definitions
const tabDefinitions = [
  { id: 'auth-info', label: 'Account', icon: <Mail className="h-4 w-4" /> },
  { id: 'profile', label: 'Profile', icon: <Briefcase className="h-4 w-4" /> },
  { id: 'preferences', label: 'Preferences', icon: <CheckSquare className="h-4 w-4" /> },
];

const RegisterInvestor = () => {
  const [currentTab, setCurrentTab] = useState(tabOrder[0]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const navigate = useNavigate();
  const { user } = useAuth(); // Check if user is already logged in

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/investor/dashboard'); // Redirect logged-in users away
    }
  }, [user, navigate]);

  const progressPercentage = Math.max(
    ((completedSteps.length + (completedSteps.includes(currentTab) ? 0 : 0.5)) / tabOrder.length) * 100,
    (tabOrder.indexOf(currentTab) / (tabOrder.length - 1)) * 100
  );

  const methods = useForm<InvestorRegistrationData>({
    resolver: zodResolver(investorRegistrationSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      jobTitle: '',
      companyName: '',
      investor_type: 'Personal', // Default value
      website: '',
      linkedinProfile: '',
      companyDescription: '',
      preferred_industries: [],
      preferred_geography: [],
      preferred_stage: [],
    },
  });

  const { handleSubmit, trigger, formState: { isSubmitting, isDirty } } = methods;

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const getFieldsToValidate = (tab: string): (keyof InvestorRegistrationData)[] => {
    switch(tab) {
      case 'auth-info':
        return ['email', 'password', 'confirmPassword', 'fullName'];
      case 'profile':
        return ['jobTitle', 'companyName', 'investor_type', 'website', 'linkedinProfile']; // Website/LinkedIn only validate format if provided
      case 'preferences':
        // Array validation happens in the Zod schema if min(1) is used
        return []; // For now, treat as optional for navigation
      default:
        return [];
    }
  };

  const goToNextTab = async () => {
    const fieldsToValidate = getFieldsToValidate(currentTab);
    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate) : true;

    if (isValid) {
      if (!completedSteps.includes(currentTab)) {
        setCompletedSteps(prev => [...prev, currentTab]);
      }
      const currentIndex = tabOrder.indexOf(currentTab);
      if (currentIndex < tabOrder.length - 1) {
        setCurrentTab(tabOrder[currentIndex + 1]);
      }
    }
  };

  const goToPreviousTab = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabOrder[currentIndex - 1]);
    }
  };

  const onSubmit: SubmitHandler<InvestorRegistrationData> = async (data) => {
    setSubmissionError(null);
    console.log('Investor Form Submitted', data);

    try {
      // 1. Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            // Store initial role and full name in auth metadata if needed
            role: 'investor',
            full_name: data.fullName,
          }
        }
      });

      if (authError) {
        // Handle specific auth errors
        if (authError.message.includes("User already registered")) {
            setSubmissionError("An account with this email already exists. Please log in.");
        } else {
            setSubmissionError(`Authentication error: ${authError.message}`);
        }
        console.error("Auth Error:", authError);
        return; // Stop execution if auth fails
      }

      if (!authData.user) {
        throw new Error("Failed to create user account after sign up. User data missing.");
      }

      const userId = authData.user.id; // Get the new user ID

      // 2. Prepare data for the RPC function
      const profileDataForRPC = {
        p_user_id: userId,
        profile_data: {
          job_title: data.jobTitle,
          company_name: data.companyName,
          investor_type: data.investor_type,
          website: data.website || null,
          linkedin_profile: data.linkedinProfile || null,
          company_description: data.companyDescription || null,
          preferred_industries: data.preferred_industries || [],
          preferred_geography: data.preferred_geography || [],
          preferred_stage: data.preferred_stage || [],
          full_name: data.fullName // Pass fullName too if needed in investors table
        }
      };

      console.log('Calling RPC register_investor_profile with:', profileDataForRPC);

      // 3. Call the Supabase RPC function to create the investor profile
      const { error: rpcError } = await supabase.rpc('register_investor_profile', profileDataForRPC);

      if (rpcError) {
        console.error("RPC Error creating investor profile:", rpcError);
        setSubmissionError(`Failed to save investor profile: ${rpcError.message}. Please contact support if the issue persists.`);
        // Consider adding user cleanup logic here if critical
         // e.g., await supabase.auth.admin.deleteUser(userId); // Requires admin privileges
        return; 
      }

      // 4. Success: Navigate to login or confirmation page
      console.log('Investor registration successful!');
      navigate('/auth/auth1/login?message=Registration successful! Please check your email to verify your account and log in.'); // Redirect to login with success message

    } catch (error: any) {
      console.error('Investor Registration Error:', error);
      setSubmissionError(error.message || 'An unexpected error occurred during registration.');
    }
  };

  // Function to render tab status (completed, current, or future)
  const getTabStatus = (tabId: string) => {
    if (completedSteps.includes(tabId)) return 'completed';
    if (tabId === currentTab) return 'current';
    return 'future'; // Matching Startup registration status naming
  };

  // Help text for each section (Investor specific)
  const getSectionHelpText = () => {
    switch(currentTab) {
      case 'auth-info':
        return "Create your account credentials. This will be used to log in to the RISE platform.";
      case 'profile':
        return "Provide details about your professional role and company.";
      case 'preferences':
        return "Specify your preferred investment areas to help us match you with relevant startups.";
      default:
        return "";
    }
  };

  // Animation variants for tab content (Copied from Startup)
  const contentVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      } 
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 1, 1]
      } 
    }
  };

  return (
    // Structure matching RegisterStartup.tsx
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative overflow-hidden min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-12 gap-0">
            {/* Sidebar - Matching RegisterStartup.tsx */}
            <div className="xl:col-span-4 lg:col-span-4 col-span-12 bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-900 dark:to-indigo-950 lg:block hidden relative overflow-hidden min-h-screen">
              <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <LeftSidebarPart />
          </div>

            {/* Main Content - Matching RegisterStartup.tsx */}
            <div className="xl:col-span-8 lg:col-span-8 col-span-12 overflow-y-auto flex flex-col bg-white dark:bg-gray-900">
              <div className="flex flex-col flex-grow py-10 px-8 max-w-[950px] mx-auto w-full">
              <div className="w-full">
                  {/* Header - Matching RegisterStartup.tsx */} 
                  <div className="text-center mb-10">
                    <div className="mb-3 flex justify-center">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                <Logo />
                      </motion.div>
                    </div>
                    <motion.h2 
                      className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      Investor Registration
                    </motion.h2>
                    <motion.p 
                      className="text-gray-600 dark:text-gray-300 text-base font-medium max-w-md mx-auto"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                     Join RISE to discover and connect with promising startups in the ecosystem.
                    </motion.p>
                    <Separator className="my-6" />
                  </div>
                  
                  {/* Progress Section - Matching RegisterStartup.tsx */} 
                  <motion.div 
                    className="mb-8 space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {completedSteps.length === tabOrder.length ? (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <Check className="mr-1 h-5 w-5" />
                            <span className="text-sm font-medium">All sections completed</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                            <span className="text-sm font-medium">
                              {Math.round(progressPercentage)}% complete
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Step {tabOrder.indexOf(currentTab) + 1} of {tabOrder.length}
                        </span>
                      </div>
                    </div>
                    <Progress value={progressPercentage} className="h-2.5 bg-gray-200/70 dark:bg-gray-700/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-400 rounded-full transition-all duration-500 ease-out shadow-sm"></div>
                    </Progress>
                  </motion.div>

                  {/* Form Section - Using Card like RegisterStartup.tsx */} 
                  <Card className="shadow-lg border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                    <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-800/40 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center">
                            {/* Use appropriate icon based on current tab */}
                            {React.createElement(tabDefinitions.find(t => t.id === currentTab)?.icon.type || Shield, { className: "h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" })}
                            {tabDefinitions.find(t => t.id === currentTab)?.label} Information
                          </CardTitle>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <span>{completedSteps.length} of {tabOrder.length} completed</span>
                          </div>
                        </div>
                        <CardDescription className="mt-2 text-sm">
                          {getSectionHelpText()}
                        </CardDescription>
                    </CardHeader>
                    
                    {/* Tabs Navigation - Matching RegisterStartup.tsx */} 
                    <div className="border-t border-gray-200 dark:border-gray-700">
                        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                           <TabsList className="flex w-full rounded-none bg-white dark:bg-gray-800 p-0 h-auto">
                              <div className="w-full overflow-x-auto scrollbar-hide flex">
                              {tabDefinitions.map((tab) => {
                                const status = getTabStatus(tab.id);
                                return (
                                  <TabsTrigger 
                                    key={tab.id} 
                                    value={tab.id}
                                    disabled={status === 'future' && !completedSteps.includes(tabOrder[tabOrder.indexOf(tab.id) - 1])}
                                    className={`flex-1 min-w-[120px] data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 rounded-none px-3 py-3.5 relative border-b-2 transition-all duration-300 ${ 
                                      status === 'completed' 
                                        ? 'border-green-500 text-green-600 dark:text-green-400 font-medium hover:bg-green-50 dark:hover:bg-green-900/10' 
                                        : status === 'current' 
                                          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/10' 
                                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80'
                                    }`}
                                  >
                                    <div className="flex items-center justify-center gap-2">
                                      <div className={`p-1.5 rounded-full ${ 
                                        status === 'completed' 
                                          ? 'bg-green-100 dark:bg-green-900/30' 
                                          : status === 'current' 
                                            ? 'bg-indigo-100 dark:bg-indigo-900/30' 
                                            : 'bg-gray-100 dark:bg-gray-700'
                                      }`}> 
                                        {status === 'completed' ? (
                                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        ) : (
                                          tab.icon // Use the defined icon
                                        )}
                                      </div>
                                      <span className="text-sm">{tab.label}</span>
                                    </div>
                                  </TabsTrigger>
                                );
                              })}
                            </div>
                          </TabsList>
                        </Tabs>
                      </div>
                      
                      {/* Form Content Area - Matching RegisterStartup.tsx */} 
                      <div className="flex-grow overflow-visible">
                        <CardContent className="p-6 pt-5 min-h-[450px] flex flex-col"> 
                          {/* Submission Error Alert */} 
                          {submissionError && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mb-6"
                            >
                              <Alert variant="destructive">
                                <Shield className="h-4 w-4" />
                                <AlertTitle>Registration Failed</AlertTitle>
                                <AlertDescription>{submissionError}</AlertDescription>
                              </Alert>
                            </motion.div>
                          )}
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentTab}
                              variants={contentVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="flex-grow"
                            >
                              <Tabs value={currentTab} className="w-full h-full">
                                <TabsContent value="auth-info" className="h-full">
                                  <AuthInfoInvestorForm />
                                </TabsContent>
                                <TabsContent value="profile" className="h-full">
                                  <InvestorProfileForm />
                                </TabsContent>
                                <TabsContent value="preferences" className="h-full">
                                  <InvestorPreferencesForm />
                                </TabsContent>
                              </Tabs>
                            </motion.div>
                          </AnimatePresence>
                        </CardContent>
                      </div>
                      
                      {/* Footer with Navigation Buttons - Matching RegisterStartup.tsx */} 
                      <CardFooter className="flex justify-between items-center p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-800/40 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={goToPreviousTab}
                          disabled={tabOrder.indexOf(currentTab) === 0 || isSubmitting}
                          className="flex items-center gap-2 px-4 py-2 transition-all duration-200 shadow-sm hover:shadow bg-white dark:bg-gray-800"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>Previous</span>
                        </Button>

                        {currentTab !== tabOrder[tabOrder.length - 1] ? (
                          <Button 
                            type="button" 
                            onClick={goToNextTab} 
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-5 py-2 transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            <span>Continue</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            type="submit" 
                            disabled={!isDirty || isSubmitting} // Only enable submit if form is dirty and not submitting
                            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-5 py-2 transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                              </>
                            ) : (
                              <>
                                Complete Registration
                                <Send className="h-4 w-4 ml-1" />
                              </>
                            )}
                          </Button>
                        )}
                      </CardFooter>
                  </Card>
                  
                  {/* Section Tracker (like Startup) - Optional but good for consistency */} 
                  <div className="grid grid-cols-3 gap-2 my-6"> {/* Adjusted grid-cols-3 for fewer steps */} 
                      {tabOrder.map((tab) => {
                        const status = getTabStatus(tab);
                        const tabDef = tabDefinitions.find(t => t.id === tab);
                        
                        return (
                          <div 
                            key={tab} 
                            className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${ 
                              status === 'current' 
                                ? 'bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800' 
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                            }`}
                            onClick={() => {
                              if (status !== 'future' || completedSteps.includes(tabOrder[tabOrder.indexOf(tab) - 1])) {
                                setCurrentTab(tab);
                              }
                            }}
                          >
                            <div className={`p-1.5 rounded-full ${ 
                              status === 'completed' 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                : status === 'current'
                                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                  : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                            }`}> 
                              {status === 'completed' ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                status === 'future' ? (
                                  <Lock className="h-4 w-4" />
                                ) : (
                                  <Unlock className="h-4 w-4" /> // Using Unlock for current step
                                )
                              )}
                            </div>
                            <span className="text-xs mt-1 text-center">{tabDef?.label}</span>
                          </div>
                        );
                      })}
                    </div>

                  {/* Sign In Link - Matching RegisterStartup.tsx */} 
                  <div className="flex gap-2 text-base font-medium mt-8 items-center justify-center">
                    <p className="text-gray-600 dark:text-gray-300">Already have an Account?</p>
                  <Link
                      to={'/auth/auth1/login'}
                      className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    Sign In
                  </Link>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default RegisterInvestor; 