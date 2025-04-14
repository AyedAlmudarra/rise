import React, { useState, useEffect } from "react";
import { supabase } from "src/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/shadcn-ui/Default-Ui/button";
import { Input } from "../../../components/shadcn-ui/Default-Ui/input";
import { Label } from "../../../components/shadcn-ui/Default-Ui/label";
import { Textarea } from "../../../components/shadcn-ui/Default-Ui/textarea";
import { Checkbox } from "../../../components/shadcn-ui/Default-Ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "../../../components/shadcn-ui/Default-Ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/shadcn-ui/Default-Ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/shadcn-ui/Default-Ui/tabs";
import { Loader2, AlertCircle, UserCircle, Building, Info, CheckCircle2, Key, DollarSign, Tags, Users, Target, Mail, FileText, FileUp, LineChart, CircleDollarSign, ChevronLeft, ChevronRight, BarChart2 } from "lucide-react";
import FormSectionCard from "../../../components/shared/FormSectionCard";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startupRegistrationSchema, StartupRegistrationData } from "../../../types/startupRegistration";
import { Progress } from "../../../components/shadcn-ui/Default-Ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// Import all form components
import AuthInfoForm from "./AuthInfoForm";
import BasicInfoForm from "./BasicInfoForm";
import CompanyDetailsForm from "./CompanyDetailsForm";
import TeamForm from "./TeamForm";
import MarketAnalysisForm from "./MarketAnalysisForm";
import KeyMetricsForm from "./KeyMetricsForm";
import FundingForm from "./FundingForm";
import DocumentsForm from "./DocumentsForm";

// Define the structure for the startup profile data we want to insert
// Based on StartupProfile type in database.ts, focusing on registration fields
interface StartupProfileData {
  user_id: string;
  name: string;
  description: string;
  industry: string;
  sector?: string | null;
  operational_stage: string;
  location_city: string;
  website?: string | null; // Added website field
  num_employees?: number | null;
  annual_revenue?: number | null;
  // logo_url and pitch_deck_url will likely be handled post-registration
  business_model?: string | null;
  target_market?: string | null;
}

// Dropdown options (can be moved to constants file later)
const INDUSTRIES = [
  { value: "fintech", label: "FinTech" },
  { value: "healthtech", label: "HealthTech" },
  { value: "edtech", label: "EdTech" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "saas", label: "SaaS" },
  { value: "other", label: "Other" }
];

const OPERATIONAL_STAGES = [
  { value: "idea", label: "Idea Stage" },
  { value: "pre-seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "growth", label: "Growth Stage" },
  { value: "other", label: "Other" }
];

const SAUDI_CITIES = [
  { value: "riyadh", label: "Riyadh" },
  { value: "jeddah", label: "Jeddah" },
  { value: "dammam", label: "Dammam" },
  { value: "khobar", label: "Khobar" },
  { value: "other-sa", label: "Other Saudi City" },
  { value: "outside-sa", label: "Outside Saudi Arabia" }
];

// Tab order and definitions
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

const AuthRegisterStartup = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(tabOrder[0]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Calculate progress percentage
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
      kpi_monthly_growth: '',
      kpi_payback_period: '',
      kpi_churn_rate: '',
      kpi_nps: '',
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
      logo_url: null,
      pitch_deck_url: null,
    }
  });

  const { handleSubmit, trigger, formState: { isSubmitting, errors } } = methods;

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
      case 'market-analysis':
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

  const getTabStatus = (tabId: string) => {
    if (completedSteps.includes(tabId)) return 'completed';
    if (tabId === currentTab) return 'current';
    return 'pending';
  };

  const uploadFile = async (file: File, bucketName: string): Promise<string | null> => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(`Uploading ${filePath} to ${bucketName}...`);
    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file);

        if (error) {
            throw error;
        }
        console.log("Upload successful:", data);
        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        return urlData?.publicUrl || null;
    } catch (error: any) {
        console.error("Error uploading file:", error.message);
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
        return null;
    }
  };

  const onSubmit = async (data: StartupRegistrationData) => {
    setSubmissionError(null);
    // console.log("Form Data:", data); // Keep for debugging if needed

    // 1. Sign up the user first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    // 2. Handle Authentication Error
    if (authError) {
      console.error("Auth signup error:", authError);
      setSubmissionError(`Registration failed: ${authError.message}`);
      toast.error(`Registration failed: ${authError.message}`);
      return; // Stop execution if auth fails
    }

    // 3. Check if user object exists (should always exist if no error, but good practice)
    if (!authData || !authData.user) {
        console.error("Auth signup success but no user data returned.");
        setSubmissionError("Registration partially failed: User account created, but profile setup encountered an issue. Please contact support.");
        toast.error("Registration error: User account created, but profile setup failed.");
        return;
    }

    // 4. Extract User ID
    const userId = authData.user.id;

    // 5. Prepare Startup Profile Data for Insertion
    // Map form data (data) to the columns in the 'startups' table
    const startupProfileData: Partial<StartupProfile> = { // Use Partial<StartupProfile> from types/database
      user_id: userId,
      name: data.startupName,
      description: data.companyDescription,
      industry: data.industry,
      sector: data.sector || null, // Use null if empty
      operational_stage: data.operationalStage,
      location_city: data.locationCity,
      website: data.website || null,
      num_employees: data.numEmployees ? parseInt(data.numEmployees, 10) : null, // Parse to int or null
      num_customers: data.numCustomers ? parseInt(data.numCustomers, 10) : null, // Parse to int or null
      annual_revenue: data.annualRevenue ? parseFloat(data.annualRevenue) : null, // Parse to float or null
      annual_expenses: data.annualExpenses ? parseFloat(data.annualExpenses) : null, // Parse to float or null
      // Map other relevant fields from 'data' to 'startupProfileData' as needed
      // Example: kpi_cac: data.kpi_cac ? parseFloat(data.kpi_cac) : null,
      // ... map all relevant fields collected by the form ...
      // Note: logo_url and pitch_deck_url are handled separately (if implemented)
    };

    // 6. Insert Startup Profile Data into Supabase
    console.log("Attempting to insert profile data for user:", userId);
    const { error: insertError } = await supabase
      .from('startups') // Ensure 'startups' matches your table name
      .insert([startupProfileData]); // Insert requires an array

    // 7. Handle Insertion Error
    if (insertError) {
      console.error("Startup profile insertion error:", insertError);
      // Attempt to provide a more specific error if possible
      let userMessage = `Profile creation failed: ${insertError.message}. Your account was created, but we couldn't save your company details. Please try updating your profile later or contact support.`;
      if (insertError.message.includes('duplicate key value violates unique constraint')) {
          userMessage = "Profile creation failed: It seems a profile might already exist for this account.";
      } else if (insertError.message.includes('violates row-level security policy')) {
          userMessage = "Profile creation failed due to a permission issue. Please contact support.";
      }
      setSubmissionError(userMessage);
      toast.error(userMessage, { duration: 6000 }); // Longer duration for important errors
      // Consider if you need to delete the auth user here if profile creation is critical
      // await supabase.auth.admin.deleteUser(userId); // Requires admin privileges - handle with care!
      return;
    }

    // 8. Success
    console.log("Startup profile inserted successfully for user:", userId);
    toast.success("Registration successful! Please check your email to confirm your account.", { duration: 5000 });
    setSubmissionError(null); // Ensure error is cleared on success
    // Optionally clear form state here if needed: methods.reset();
    navigate("/login"); // Redirect to login or a confirmation page

  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {submissionError && (
          <Alert variant="destructive" className="mb-4 animate-in fade-in-50 duration-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        )}

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl blur-xl opacity-70"></div>
            <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 dark:border-indigo-900 shadow-md">
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
                Register Your Startup
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Join the RISE platform to connect with investors and grow your business.
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-2 px-2">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Getting Started</span>
              <span>Complete Profile</span>
            </div>
            <div className="relative">
              <Progress value={progressPercentage} className="h-3 rounded-full bg-gray-100 dark:bg-gray-800" />
              <motion.div 
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-indigo-400 dark:to-blue-400 opacity-30 blur-sm"
                style={{ width: `${progressPercentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Tab navigation */}
        <div className="overflow-x-auto pb-2 px-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TabsList className="w-full grid grid-cols-4 lg:grid-cols-8 mb-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-900/60 p-1.5 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
              {tabDefinitions.map((tab, index) => (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <TabsTrigger
                    value={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm 
                      py-2.5 relative rounded-lg transition-all duration-300
                      ${getTabStatus(tab.id) === 'completed' ? 'text-primary-600 dark:text-primary-light' : ''}
                      ${getTabStatus(tab.id) === 'current' ? 'data-[state=active]:border-b-2 data-[state=active]:border-indigo-500' : ''}
                      hover:bg-white/80 dark:hover:bg-gray-800/80`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className={`p-1 rounded-full ${getTabStatus(tab.id) === 'completed' ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''}`}>
                        {tab.icon}
                      </div>
                      <span className="text-xs hidden sm:inline font-medium">{tab.label}</span>
                      {getTabStatus(tab.id) === 'completed' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute top-0 right-0 translate-x-1 -translate-y-1"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                        </motion.div>
                      )}
                    </div>
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
          </motion.div>
        </div>

        {/* Form content with glass effect for tabs */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-blue-50/40 dark:from-gray-900/40 dark:to-blue-950/20 rounded-xl blur-sm"></div>
          <div className="relative backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 15 }}
                  className="min-h-[400px]"
                >
                  <TabsContent value="auth-info" className="mt-0 outline-none">
                    <AuthInfoForm />
                  </TabsContent>

                  <TabsContent value="basic-info" className="mt-0 outline-none">
                    <BasicInfoForm />
                  </TabsContent>

                  <TabsContent value="company-details" className="mt-0 outline-none">
                    <CompanyDetailsForm />
                  </TabsContent>

                  <TabsContent value="team" className="mt-0 outline-none">
                    <TeamForm />
                  </TabsContent>

                  <TabsContent value="market-analysis" className="mt-0 outline-none">
                    <MarketAnalysisForm isRegistrationFlow={true} />
                  </TabsContent>

                  <TabsContent value="key-metrics" className="mt-0 outline-none">
                    <KeyMetricsForm isRegistrationFlow={true} />
                  </TabsContent>

                  <TabsContent value="funding" className="mt-0 outline-none">
                    <FundingForm isRegistrationFlow={true} />
                  </TabsContent>

                  <TabsContent value="documents" className="mt-0 outline-none">
                    <DocumentsForm />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>

        {/* Terms and conditions checkbox (on the last tab) */}
        {currentTab === 'documents' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center space-x-3 mt-8 p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <Checkbox 
              id="terms" 
              checked={agreeTerms}
              onCheckedChange={(checked) => {
                  const newState = checked as boolean;
                  console.log("Terms agreed state changed:", newState);
                  setAgreeTerms(newState);
              }}
              className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-colors">terms and conditions</a> and <a href="#" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-colors">privacy policy</a>.
            </label>
          </motion.div>
        )}

        {/* Navigation buttons */}
        <motion.div 
          className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousTab}
            disabled={currentTab === tabOrder[0]}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentTab !== tabOrder[tabOrder.length - 1] ? (
            <Button
              type="button"
              onClick={goToNextTab}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            (() => {
              console.log("Rendering final button - isSubmitting:", isSubmitting, "agreeTerms:", agreeTerms);
              return (
                <Button
                  type="submit"
                  disabled={isSubmitting || !agreeTerms}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.1 }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </motion.div>
                  )}
                  {isSubmitting ? "Registering..." : "Complete Registration"}
                </Button>
              );
            })()
          )}
        </motion.div>
      </form>
    </FormProvider>
  );
};

export default AuthRegisterStartup; 