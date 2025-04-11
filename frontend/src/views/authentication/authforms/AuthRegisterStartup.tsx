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
      companyLogo: null,
      pitchDeck: null,
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

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error(`Error uploading ${bucket} file:`, error);
      return null;
    }
  };

  const onSubmit = async (data: StartupRegistrationData) => {
    if (!agreeTerms) {
      setSubmissionError("You must agree to the terms and conditions.");
      return;
    }

    setSubmissionError(null);
    
    try {
      // 1. Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.founderName || '',
            role: 'startup',
          },
        },
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Failed to create user account");
      }
      
      // Handle file uploads
      let logoUrl = null;
      let pitchDeckUrl = null;
      
      if (data.companyLogo) {
        logoUrl = await uploadFile(data.companyLogo, 'logos');
      }
      
      if (data.pitchDeck) {
        pitchDeckUrl = await uploadFile(data.pitchDeck, 'pitchdecks');
      }

      // 2. Insert startup record in database
      const { error: insertError } = await supabase
        .from('startups')
        .insert([
          {
            user_id: authData.user.id,
            name: data.startupName,
            description: data.companyDescription,
            industry: data.industry,
            sector: data.sector,
            operational_stage: data.operationalStage,
            location_city: data.locationCity,
            country: data.countryOfOperation,
            founding_date: data.foundingDate,
            num_employees: data.numEmployees || null,
            num_customers: data.numCustomers || null,
            annual_revenue: data.annualRevenue || null,
            annual_expenses: data.annualExpenses || null,
            team_size: data.teamSize || null,
            has_co_founder: data.hasCoFounder,
            website: data.website || null,
            linkedin_profile: data.linkedinProfile || null,
            twitter_profile: data.twitterProfile || null,
            logo_url: logoUrl,
            pitch_deck_url: pitchDeckUrl,
            kpi_cac: data.kpi_cac || null,
            kpi_clv: data.kpi_clv || null,
            kpi_retention_rate: data.kpi_retention_rate || null,
            kpi_conversion_rate: data.kpi_conversion_rate || null,
            kpi_monthly_growth: data.kpi_monthly_growth || null,
            kpi_payback_period: data.kpi_payback_period || null,
            kpi_churn_rate: data.kpi_churn_rate || null,
            kpi_nps: data.kpi_nps || null,
            kpi_tam_size: data.kpi_tam_size || null,
            kpi_avg_order_value: data.kpi_avg_order_value || null,
            kpi_market_share: data.kpi_market_share || null,
            kpi_yoy_growth: data.kpi_yoy_growth || null,
            market_growth_rate: data.marketGrowthRate || null,
            market_key_trends: data.marketKeyTrends || null,
            target_customer_profile: data.targetCustomerProfile || null,
            customer_pain_points: data.customerPainPoints || null,
            market_barriers: data.marketBarriers || null,
            competitive_advantage: data.competitiveAdvantage || null,
            current_funding: data.currentFunding || null,
            seeking_investment: data.seekingInvestment || false,
            target_raise_amount: data.targetRaiseAmount || null,
            // Add competitor data if available
            competitor_data: data.competitor1Name ? {
              competitor1: {
                name: data.competitor1Name,
                size: data.competitor1Size,
                threat: data.competitor1Threat,
                differentiator: data.competitor1Differentiator
              },
              competitor2: data.competitor2Name ? {
                name: data.competitor2Name,
                size: data.competitor2Size,
                threat: data.competitor2Threat,
                differentiator: data.competitor2Differentiator
              } : null,
              competitor3: data.competitor3Name ? {
                name: data.competitor3Name,
                size: data.competitor3Size,
                threat: data.competitor3Threat,
                differentiator: data.competitor3Differentiator
              } : null
            } : null
          }
        ]);

      if (insertError) throw insertError;
      
      // 3. Show success toast and redirect to dashboard
      toast.success("Registration Successful! Welcome to RISE.");
      
      // Set a timestamp for the registration to show welcome experience
      localStorage.setItem('registration_timestamp', Date.now().toString());
      
      // Redirect to dashboard immediately without waiting for email verification
      // We'll handle the email verification status on the dashboard
      navigate("/startup/dashboard");
    } catch (error: any) {
      console.error("Error during registration:", error);
      setSubmissionError(error.message || "An unexpected error occurred during registration.");
    }
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
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
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
          )}
        </motion.div>
      </form>
    </FormProvider>
  );
};

export default AuthRegisterStartup; 