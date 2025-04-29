import { useState } from 'react'; // Import useState and useEffect
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/layouts/full/shared/logo/Logo';
import LeftSidebarPart from './LeftSidebarPart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn-ui/Default-Ui/tabs"; // Import Tabs
import BasicInfoForm from './authforms/BasicInfoForm';
import CompanyDetailsForm from './authforms/CompanyDetailsForm';
import DocumentsForm from './authforms/DocumentsForm';
import TeamForm from './authforms/TeamForm';
import KeyMetricsForm from './authforms/KeyMetricsForm';
import FundingForm from './authforms/FundingForm';
import AuthInfoForm from './authforms/AuthInfoForm'; // Import new AuthInfoForm
import { Button } from "@/components/shadcn-ui/Default-Ui/button";
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { startupRegistrationSchema, StartupRegistrationData } from '@/types/startupRegistration'; // Import schema and type
import { supabase } from '@/lib/supabaseClient';
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn-ui/Default-Ui/alert";
import {  Send, Info, Building, FileText, Users, BarChart2, CircleDollarSign, FileUp, Check, ChevronLeft, ChevronRight, Lock, Unlock, Mail, Shield, LineChart } from "lucide-react"; // Import more icons
import { Progress } from "@/components/shadcn-ui/Default-Ui/progress";
import { Separator } from "@/components/shadcn-ui/Default-Ui/separator";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/shadcn-ui/Default-Ui/card";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion for animations
import MarketAnalysisForm from './authforms/MarketAnalysisForm';

// Expanded tab order with authentication step first
const tabOrder = ['auth-info', 'basic-info', 'company-details', 'team', 'market-analysis', 'key-metrics', 'funding', 'documents'];

// Tab definition with icons and labels
const tabDefinitions = [
  { id: 'auth-info', label: 'Account', icon: <Mail className="h-4 w-4" /> },
  { id: 'basic-info', label: 'Basic Info', icon: <Building className="h-4 w-4" /> },
  { id: 'company-details', label: 'Company', icon: <FileText className="h-4 w-4" /> },
  { id: 'team', label: 'Team', icon: <Users className="h-4 w-4" /> },
  { id: 'market-analysis', label: 'Market', icon: <LineChart className="h-4 w-4" /> },
  { id: 'key-metrics', label: 'Metrics', icon: <BarChart2 className="h-4 w-4" /> },
  { id: 'funding', label: 'Funding', icon: <CircleDollarSign className="h-4 w-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileUp className="h-4 w-4" /> },
];

const RegisterStartup = () => {
  const [currentTab, setCurrentTab] = useState(tabOrder[0]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const navigate = useNavigate();
  
  
  // Calculate progress percentage based on completed steps and current tab
  const progressPercentage = Math.max(
    ((completedSteps.length + (completedSteps.includes(currentTab) ? 0 : 0.5)) / tabOrder.length) * 100,
    (tabOrder.indexOf(currentTab) / (tabOrder.length - 1)) * 100
  );

  const methods = useForm<StartupRegistrationData>({
    resolver: zodResolver(startupRegistrationSchema),
    mode: 'onTouched',
    defaultValues: {
      // Authentication
      email: '',
      password: '',
      confirmPassword: '',
      
      // Founder Background
      founderName: '',
      founderTitle: '',
      founderEducation: '',
      previousStartupExperience: '',
      founderBio: '',
      techSkills: {
        programming: false,
        data_analysis: false,
        design: false,
        marketing: false,
        ai_ml: false,
      },
      
      // Basic Info
      startupName: '',
      industry: '',
      sector: '',
      locationCity: '',
      countryOfOperation: '',
      
      // Company Details
      companyDescription: '',
      operationalStage: '',
      numEmployees: '',
      numCustomers: '',
      annualRevenue: '',
      annualExpenses: '',
      foundingDate: '',
      
      // Team Information
      teamSize: '',
      hasCoFounder: false,
      
      // Market Analysis
      marketGrowthRate: '',
      marketKeyTrends: '',
      targetCustomerProfile: '',
      customerPainPoints: '',
      marketBarriers: '',
      competitiveAdvantage: '',
      competitor1Name: '',
      competitor1Size: '',
      competitor1Threat: '',
      competitor1Differentiator: '',
      competitor2Name: '',
      competitor2Size: '',
      competitor2Threat: '',
      competitor2Differentiator: '',
      competitor3Name: '',
      competitor3Size: '',
      competitor3Threat: '',
      competitor3Differentiator: '',
      
      // Key Metrics
      kpi_cac: '',
      kpi_clv: '',
      kpi_retention_rate: '',
      kpi_conversion_rate: '',
      // Additional Growth Metrics
      kpi_monthly_growth: '',
      kpi_payback_period: '',
      kpi_churn_rate: '',
      kpi_nps: '',
      // Market Metrics
      kpi_tam_size: '',
      kpi_avg_order_value: '',
      kpi_market_share: '',
      kpi_yoy_growth: '',
      
      // Funding Status
      currentFunding: '',
      seekingInvestment: false,
      targetRaiseAmount: '',
      
      // Documents & Links
      website: '',
      linkedinProfile: '',
      twitterProfile: '',
    },
  });

  const { handleSubmit, trigger, formState: { isSubmitting } } = methods;

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const getFieldsToValidate = (tab: string): (keyof StartupRegistrationData)[] => {
    switch(tab) {
      case 'auth-info':
        return ['email', 'password', 'confirmPassword'];
      case 'basic-info':
        return ['startupName', 'industry', 'sector', 'locationCity', 'countryOfOperation'];
      case 'company-details':
        return ['companyDescription', 'operationalStage', 'foundingDate'];
      case 'team':
        return ['teamSize'];
      case 'key-metrics':
        return []; // All optional
      case 'funding':
        return []; // All optional
      case 'documents':
        return []; // Optional but will validate URL formats
      default:
        return [];
    }
  };

  const goToNextTab = async () => {
    const fieldsToValidate = getFieldsToValidate(currentTab);
    
    const isValid = fieldsToValidate.length > 0 
      ? await trigger(fieldsToValidate)
      : true;
      
    if (isValid) {
      // Mark current tab as completed
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

  const onSubmit: SubmitHandler<StartupRegistrationData> = async (data) => {
    setSubmissionError(null);
    
    console.log('Form Submitted', data);
    
    try {
      // 1. Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Failed to create user account");
      }
      
      const userId = authData.user.id; // Get the new user ID

      // Get URLs from form data (set by DocumentsForm)
      const logoUrl = methods.getValues('logo_url'); 
      const pitchDeckUrl = methods.getValues('pitch_deck_url');

      // --- Prepare the data object FOR THE RPC FUNCTION ---
      const profileDataForRPC = {
          // Basic Info
          name: data.startupName,
          industry: data.industry,
          sector: data.sector || null,
          location_city: data.locationCity,
          country_of_operation: data.countryOfOperation,
          // Company Details
          description: data.companyDescription || null,
          operational_stage: data.operationalStage || null,
          founding_date: data.foundingDate || null, // Ensure valid date string or null
          // Founder Background
          founder_name: data.founderName || null,
          founder_title: data.founderTitle || null,
          founder_education: data.founderEducation || null,
          previous_startup_experience: data.previousStartupExperience || null,
          founder_bio: data.founderBio || null,
          tech_skills: data.techSkills || null, // Pass as object
          // Team Information
          team_size: data.teamSize && !isNaN(Number(String(data.teamSize))) ? parseInt(String(data.teamSize), 10) : null,
          has_co_founder: data.hasCoFounder ?? null,
          // Documents & Links
          website: data.website || null,
          linkedin_profile: data.linkedinProfile || null,
          twitter_profile: data.twitterProfile || null,
          logo_url: logoUrl, // From getValues
          pitch_deck_url: pitchDeckUrl, // From getValues
          // Company Size/Financials (Parsed)
          num_employees: data.numEmployees && !isNaN(Number(String(data.numEmployees))) ? parseInt(String(data.numEmployees), 10) : null,
          num_customers: data.numCustomers && !isNaN(Number(String(data.numCustomers))) ? parseInt(String(data.numCustomers), 10) : null,
          annual_revenue: data.annualRevenue && !isNaN(Number(String(data.annualRevenue))) ? parseFloat(String(data.annualRevenue)) : null,
          annual_expenses: data.annualExpenses && !isNaN(Number(String(data.annualExpenses))) ? parseFloat(String(data.annualExpenses)) : null,
          // Key Metrics (Parsed)
          kpi_cac: data.kpi_cac && !isNaN(Number(String(data.kpi_cac))) ? parseFloat(String(data.kpi_cac)) : null,
          kpi_clv: data.kpi_clv && !isNaN(Number(String(data.kpi_clv))) ? parseFloat(String(data.kpi_clv)) : null,
          kpi_retention_rate: data.kpi_retention_rate && !isNaN(Number(String(data.kpi_retention_rate))) ? parseFloat(String(data.kpi_retention_rate)) : null,
          kpi_conversion_rate: data.kpi_conversion_rate && !isNaN(Number(String(data.kpi_conversion_rate))) ? parseFloat(String(data.kpi_conversion_rate)) : null,
          kpi_monthly_growth: data.kpi_monthly_growth && !isNaN(Number(String(data.kpi_monthly_growth))) ? parseFloat(String(data.kpi_monthly_growth)) : null,
          kpi_payback_period: data.kpi_payback_period && !isNaN(Number(String(data.kpi_payback_period))) ? parseFloat(String(data.kpi_payback_period)) : null,
          kpi_churn_rate: data.kpi_churn_rate && !isNaN(Number(String(data.kpi_churn_rate))) ? parseFloat(String(data.kpi_churn_rate)) : null,
          kpi_nps: data.kpi_nps && !isNaN(Number(String(data.kpi_nps))) ? parseFloat(String(data.kpi_nps)) : null,
          kpi_tam_size: data.kpi_tam_size || null,
          kpi_avg_order_value: data.kpi_avg_order_value && !isNaN(Number(String(data.kpi_avg_order_value))) ? parseFloat(String(data.kpi_avg_order_value)) : null,
          kpi_market_share: data.kpi_market_share && !isNaN(Number(String(data.kpi_market_share))) ? parseFloat(String(data.kpi_market_share)) : null,
          kpi_yoy_growth: data.kpi_yoy_growth && !isNaN(Number(String(data.kpi_yoy_growth))) ? parseFloat(String(data.kpi_yoy_growth)) : null,
          // Market Analysis
          market_growth_rate: data.marketGrowthRate || null,
          market_key_trends: data.marketKeyTrends || null,
          target_customer_profile: data.targetCustomerProfile || null,
          customer_pain_points: data.customerPainPoints || null,
          market_barriers: data.marketBarriers || null,
          competitive_advantage: data.competitiveAdvantage || null,
          // Competitors
          competitor1_name: data.competitor1Name || null,
          competitor1_size: data.competitor1Size || null,
          competitor1_threat: data.competitor1Threat || null,
          competitor1_differentiator: data.competitor1Differentiator || null,
           // Add other competitors
          // Funding Status
          current_funding: data.currentFunding || null,
          seeking_investment: data.seekingInvestment ?? null,
          target_raise_amount: data.targetRaiseAmount && !isNaN(Number(String(data.targetRaiseAmount))) ? parseFloat(String(data.targetRaiseAmount)) : null,
      };

      console.log("Calling RPC function with:", { user_id: userId, profile_data: profileDataForRPC });

      // --- REPLACE the direct .insert() call with .rpc() ---
      // const { error: insertError } = await supabase
      //   .from('startups')
      //   .insert([ ... profileData object ... ]); 
      // 
      // if (insertError) {
      //   throw insertError;
      // }
      const { error: rpcError } = await supabase.rpc('register_startup_profile', {
         p_user_id: userId,
         profile_data: profileDataForRPC
      });

       // Check for errors from the RPC call
       if (rpcError) {
          console.error("RPC Error:", rpcError); // Log the specific RPC error
           // Attempt to provide a more specific error message if possible
          let errorMessage = `Registration failed during profile creation: ${rpcError.message}`;
          if (rpcError.details) {
              errorMessage += ` Details: ${rpcError.details}`;
          }
          if (rpcError.hint) {
               errorMessage += ` Hint: ${rpcError.hint}`;
          }
          // You might also check rpcError.code here for specific handling
           setSubmissionError(errorMessage);
           // Stop execution here, do not proceed to success message/redirect
           return; 
       }

      console.log('Startup registered successfully via RPC!'); // Updated log

      // Show success message before redirecting
      setTimeout(() => {
        navigate('/auth/auth1/login');
      }, 2000);

    } catch (error: any) {
      console.error('Error registering startup:', error);
      setSubmissionError(`Registration failed: ${error.message || 'Please try again.'}`);
    }
  };

  // Function to render tab status (completed, current, or future)
  const getTabStatus = (tabId: string) => {
    if (completedSteps.includes(tabId)) return 'completed';
    if (tabId === currentTab) return 'current';
    return 'future';
  };

  // Help text for each section
  const getSectionHelpText = () => {
    switch(currentTab) {
      case 'auth-info':
        return "Create your account credentials. This will be used to log in to the RISE platform.";
      case 'basic-info':
        return "Start by providing your basic company information. These details help us understand who you are.";
      case 'company-details':
        return "Tell us more about your company's operations, size, and current stage.";
      case 'team':
        return "Share details about your founding team - this is critical information for investors.";
      case 'key-metrics':
        return "Key performance indicators help investors understand your business health.";
      case 'funding':
        return "Let investors know about your funding status and requirements.";
      case 'documents':
        return "Upload important documents and provide links to your online presence.";
      default:
        return "";
    }
  };

  // Animation variants for tab content
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative overflow-hidden min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-12 gap-0">
            {/* Sidebar */} 
            <div className="xl:col-span-4 lg:col-span-4 col-span-12 bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-900 dark:to-indigo-950 lg:block hidden relative overflow-hidden min-h-screen">
              <div className="absolute inset-0 bg-pattern opacity-10"></div>
              <LeftSidebarPart />
            </div>
            
            {/* Main Content */} 
            <div className="xl:col-span-8 lg:col-span-8 col-span-12 overflow-y-auto flex flex-col bg-white dark:bg-gray-900">
              <div className="flex flex-col flex-grow py-10 px-8 max-w-[950px] mx-auto w-full">
                <div className="w-full">
                  {/* Header */}
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
                      Join the RISE Platform
                    </motion.h2>
                    <motion.p 
                      className="text-gray-600 dark:text-gray-300 text-base font-medium max-w-md mx-auto"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      Register your startup to connect with investors and access resources to help you grow.
                    </motion.p>
                    <Separator className="my-6" />
                  </div>
                  
                  {/* Progress Section */}
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
                    
                    {/* Step Counter Pills */}
                    <div className="flex justify-between px-1">
                      {tabOrder.map((step, index) => (
                        <motion.div 
                          key={step}
                          className={`flex items-center justify-center rounded-full w-7 h-7 text-xs font-medium shadow-sm ${
                            getTabStatus(step) === 'completed' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 ring-1 ring-green-400/30' 
                              : getTabStatus(step) === 'current'
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 ring-1 ring-indigo-400/30'
                                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ring-1 ring-gray-300 dark:ring-gray-700'
                          }`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                        >
                          {getTabStatus(step) === 'completed' ? <Check className="h-3.5 w-3.5" /> : index + 1}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Form Section */}
                  <div className="space-y-6">
                    {/* Navigation Tabs */} 
                    <Card className="shadow-lg border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                      <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-800/40">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
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
                                          tab.icon
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
                      
                      {/* Form Content */}
                      <div className="flex-grow overflow-visible">
                        <CardContent className="p-6 pt-5 min-h-[450px] flex flex-col">
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
                                  <AuthInfoForm />
                                </TabsContent>
                                <TabsContent value="basic-info" className="h-full">
                                  <BasicInfoForm />
                                </TabsContent>
                                <TabsContent value="company-details" className="h-full">
                                  <CompanyDetailsForm />
                                </TabsContent>
                                <TabsContent value="team" className="h-full">
                                  <TeamForm />
                                </TabsContent>
                                <TabsContent value="market-analysis" className="h-full">
                                  <MarketAnalysisForm />
                                </TabsContent>
                                <TabsContent value="key-metrics" className="h-full">
                                  <KeyMetricsForm />
                                </TabsContent>
                                <TabsContent value="funding" className="h-full">
                                  <FundingForm />
                                </TabsContent>
                                <TabsContent value="documents" className="h-full">
                                  <DocumentsForm />
                                </TabsContent>
                              </Tabs>
                            </motion.div>
                          </AnimatePresence>
                        </CardContent>
                      </div>
                      
                      {/* Navigation Buttons in Card Footer */}
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
                            disabled={isSubmitting}
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

                    {/* Info Alert for specific sections */}
                    {currentTab === 'documents' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 rounded-lg">
                          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <AlertTitle>Additional Documents</AlertTitle>
                          <AlertDescription>
                            You can add more documents to your profile after registration through your dashboard.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    {/* Submission Error Alert */} 
                    {submissionError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert variant="destructive" className="mb-6 border-red-200 dark:border-red-800 rounded-lg">
                          <Shield className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{submissionError}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    {/* Section Tracker */}
                    <div className="grid grid-cols-7 gap-2 mb-6">
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
                                  <Unlock className="h-4 w-4" />
                                )
                              )}
                            </div>
                            <span className="text-xs mt-1 text-center">{tabDef?.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Sign In Link */} 
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
        </div>
      </form>
    </FormProvider>
  );
};

export default RegisterStartup; 