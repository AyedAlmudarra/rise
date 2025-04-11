import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '../../../types/startupRegistration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/shadcn-ui/Default-Ui/select";
import { Switch } from "../../../components/shadcn-ui/Default-Ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { CircleDollarSign, Coins, Banknote, Wallet, DollarSign, CreditCard, PiggyBank, ArrowUpRight, TrendingUp, BarChart3, Info, Sparkles, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from "../../../components/shadcn-ui/Default-Ui/card";
import { Badge } from "../../../components/shadcn-ui/Default-Ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/shadcn-ui/Default-Ui/tooltip";
import { Alert, AlertDescription } from "../../../components/shadcn-ui/Default-Ui/alert";
import { supabase } from "../../../lib/supabaseClient";
// Import Slider from react-slick but comment it out as we're not using it anymore
// import Slider from 'react-slick';

type FundingFormProps = {
  isRegistrationFlow?: boolean;
};

// CSS class styles
const styles = {
  shimmer: 'after:content-[""] after:absolute after:inset-0 after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:animate-[shimmer_1.5s_infinite] after:skew-x-12',
};

// Safer way to handle canvas-confetti import
type ConfettiFunction = (options?: any) => any;
let confetti: ConfettiFunction = () => {}; // Default no-op function

// We'll load confetti dynamically when needed
const loadConfetti = async () => {
  try {
    const confettiModule = await import('canvas-confetti');
    confetti = confettiModule.default;
    return true;
  } catch (err) {
    console.error('Failed to load confetti:', err);
    return false;
  }
};

// Funding stage/status options
const fundingOptions = [
  { value: "Bootstrapped", label: "Bootstrapped" },
  { value: "Friends and Family", label: "Friends and Family" },
  { value: "Angel", label: "Angel Investment" },
  { value: "Pre-seed", label: "Pre-seed Round" },
  { value: "Seed", label: "Seed Round" },
  { value: "Series A", label: "Series A" },
  { value: "Series B+", label: "Series B or Later" },
  { value: "Debt", label: "Debt Financing" },
  { value: "Grant", label: "Grant/Non-dilutive" },
  { value: "No funding yet", label: "No External Funding Yet" },
];

// Average funding amounts by stage (in SAR)
const averageFundingByStage: Record<string, { min: number; max: number }> = {
  "Bootstrapped": { min: 0, max: 100000 },
  "Friends and Family": { min: 50000, max: 300000 },
  "Angel": { min: 100000, max: 1000000 },
  "Pre-seed": { min: 300000, max: 2000000 },
  "Seed": { min: 1000000, max: 5000000 },
  "Series A": { min: 5000000, max: 20000000 },
  "Series B+": { min: 10000000, max: 100000000 },
  "Debt": { min: 500000, max: 10000000 },
  "Grant": { min: 50000, max: 3000000 },
  "No funding yet": { min: 0, max: 0 },
};

// Tooltip help component
const FundingHelp: React.FC<{ description: string }> = ({ description }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-gray-400 hover:text-emerald-500 cursor-help ml-1.5 transition-colors duration-200" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs bg-white/95 dark:bg-gray-800/95 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md backdrop-blur-sm" align="start">
        <p className="text-sm">{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// New component for interactive funding stage selector
const FundingStageSelector: React.FC<{
  stages: { value: string; label: string }[];
  currentStage: string | undefined;
  onChange: (stage: string) => void;
}> = ({ stages, currentStage, onChange }) => {
  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-3 mt-2">
        {stages.map((stage, index) => (
          <motion.button
            key={stage.value}
            type="button"
            onClick={() => onChange(stage.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentStage === stage.value
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {stage.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const FundingForm: React.FC<FundingFormProps> = ({ isRegistrationFlow = false }) => {
  const { control, watch, setValue, formState: { errors } } = useFormContext<StartupRegistrationData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [suggestedAmount, setSuggestedAmount] = useState<number | null>(null);
  
  // Watch values for conditional rendering and suggestions
  const seekingInvestment = watch('seekingInvestment');
  const currentFunding = watch('currentFunding');
  const targetRaiseAmount = watch('targetRaiseAmount');
  
  // Calculate recommended funding amount based on current stage
  useEffect(() => {
    if (currentFunding && seekingInvestment) {
      const fundingInfo = averageFundingByStage[currentFunding];
      if (fundingInfo) {
        // Suggest the average of min and max as a starting point
        const suggested = Math.round((fundingInfo.min + fundingInfo.max) / 2);
        setSuggestedAmount(suggested);
      }
    } else {
      setSuggestedAmount(null);
    }
  }, [currentFunding, seekingInvestment]);

  // Function to trigger confetti effect on successful save
  const triggerConfetti = async () => {
    // First load the confetti library
    const isLoaded = await loadConfetti();
    if (!isLoaded) return;
    
    const end = Date.now() + 1000;
    
    const colors = ['#4ade80', '#10b981', '#34d399'];
    
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.7 },
        colors: colors,
        shapes: ['square', 'circle'],
        scalar: 0.8,
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.7 },
        colors: colors,
        shapes: ['square', 'circle'],
        scalar: 0.8,
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Function to save current funding data to Supabase
  const saveFundingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // If we're in registration flow, don't actually save to Supabase
      // Just show success and return
      if (isRegistrationFlow || window.location.pathname.includes('register')) {
        console.log("In registration flow, skipping Supabase calls");
        setSuccessMessage("Funding information will be saved with your registration");
        await triggerConfetti();
        setLoading(false);
        return;
      }
      
      // Only proceed with Supabase operations if not in registration flow
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Handle auth error specifically
      if (userError) {
        console.error('Auth error:', userError);
        setError("Authentication error. Your session may have expired. Please refresh the page and try again.");
        setLoading(false);
        return;
      }
      
      if (!user) {
        setError("You must be logged in to save funding information. Please refresh the page and try again.");
        setLoading(false);
        return;
      }
    
      // Check if startup record exists for this user
      const { data: existingStartup, error: fetchError } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching startup data:', fetchError);
        setError("Failed to retrieve your startup data. Please try again.");
        setLoading(false);
        return;
      }
      
      if (!existingStartup) {
        // If no startup profile exists yet, we'll return as the full form submission
        // will create the entire record
        setSuccessMessage("Funding information will be saved with your registration");
        await triggerConfetti();
        setLoading(false);
        return;
      }
      
      // Update just the funding fields
      const { error: updateError } = await supabase
        .from('startups')
        .update({
          current_funding: currentFunding || null,
          seeking_investment: seekingInvestment || false,
          target_raise_amount: targetRaiseAmount || null,
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error updating funding data:', updateError);
        setError("Failed to save funding information: " + updateError.message);
        setLoading(false);
        return;
      }
      
      setSuccessMessage("Funding information saved successfully!");
      await triggerConfetti();
      
    } catch (err: any) {
      console.error('Error saving funding data:', err);
      setError(err.message || 'Failed to save funding data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Apply suggested amount
  const applySuggestedAmount = () => {
    if (suggestedAmount) {
      setValue('targetRaiseAmount', suggestedAmount);
    }
  };
  
  // Get filtered stages for the stage selector
  const filteredStages = fundingOptions.filter(stage => 
    ['Bootstrapped', 'Pre-seed', 'Seed', 'Series A'].includes(stage.value)
  );
  
  // Get min/max funding amount for the slider
  const getSliderRange = () => {
    if (!currentFunding || !seekingInvestment) return { min: 0, max: 10000000 };
    
    const fundingInfo = averageFundingByStage[currentFunding];
    if (!fundingInfo) return { min: 0, max: 10000000 };
    
    return { 
      min: fundingInfo.min, 
      max: fundingInfo.max * 1.5 // Allow some flexibility above the typical range
    };
  };
  
  const { min, max } = getSliderRange();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Funding Status</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Share your funding history and current investment goals to help investors understand your needs.
        </p>
      </motion.div>
      
      {error && (
        <Alert variant="destructive" className="animate-in fade-in-50 duration-300">
          <AlertDescription className="flex items-center">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-green-400/20 dark:bg-green-400/10 blur-xl rounded-lg"></div>
            <Alert className="bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/60 dark:to-emerald-900/60 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 backdrop-blur-sm shadow-md animate-in fade-in-50 duration-300">
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
                  className="bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-800/50 dark:to-emerald-700/50 p-2 rounded-full"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </motion.div>
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-medium text-green-800 dark:text-green-300">Success!</h4>
                    <AlertDescription className="text-green-700 dark:text-green-400">{successMessage}</AlertDescription>
                  </motion.div>
                </div>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Current Funding Status */}
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl blur-md opacity-80"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-emerald-100 dark:border-emerald-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full text-white shadow-sm mr-3">
                <PiggyBank className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Current Funding</h3>
            </div>
            
            <FormField
              control={control}
              name="currentFunding"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Coins className="h-4 w-4 text-emerald-500" />
                    Current Funding Status
                    <FundingHelp description="Select the most recent or current funding stage of your startup." />
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // If changing funding status, check if we should adjust the target amount
                      if (seekingInvestment && !targetRaiseAmount) {
                        // Suggest a reasonable amount based on the selected funding stage
                        const fundingInfo = averageFundingByStage[value];
                        if (fundingInfo) {
                          const suggested = Math.round((fundingInfo.min + fundingInfo.max) / 2);
                          setSuggestedAmount(suggested);
                        }
                      }
                    }}
                    defaultValue={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white/90 dark:bg-gray-950/90">
                        <SelectValue placeholder="Select your current funding status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-950">
                      {fundingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="focus:bg-emerald-50 dark:focus:bg-emerald-900/20">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                    <Info className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
                    Your funding stage helps us match you with appropriate investors
                  </FormDescription>
                  {errors.currentFunding && (
                    <FormMessage>{errors.currentFunding.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            
            {/* Interactive Funding Stage Selector */}
            <FundingStageSelector 
              stages={filteredStages}
              currentStage={currentFunding}
              onChange={(stage) => setValue('currentFunding', stage)}
            />
          </div>
        </motion.div>

        {/* Investment Goals */}
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-xl blur-md opacity-80"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-teal-100 dark:border-teal-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full text-white shadow-sm mr-3">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Investment Goals</h3>
            </div>
          
            <FormField
              control={control}
              name="seekingInvestment"
              render={({ field }) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="overflow-hidden border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50/80 to-cyan-50/80 dark:from-teal-900/20 dark:to-cyan-900/20 backdrop-blur-sm shadow-sm mb-6">
                    <CardContent className="p-0">
                      <FormItem className="flex flex-row items-center justify-between p-4">
                        <div className="space-y-1">
                          <FormLabel className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                            <CircleDollarSign className="h-4 w-4 text-teal-500" />
                            Seeking Investment
                          </FormLabel>
                          <FormDescription className="text-gray-600 dark:text-gray-400">
                            Are you currently looking to raise funding?
                          </FormDescription>
                        </div>
                        <div className="relative">
                          <div className="absolute -inset-4 bg-teal-200/20 dark:bg-teal-700/20 blur-md rounded-full opacity-70"></div>
                          <FormControl>
                            <Switch
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-teal-600 relative"
                            />
                          </FormControl>
                        </div>
                        {errors.seekingInvestment && (
                          <FormMessage>{errors.seekingInvestment.message}</FormMessage>
                        )}
                      </FormItem>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            />

            <AnimatePresence>
              {seekingInvestment && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="relative overflow-hidden mt-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-100/50 to-cyan-100/50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-lg blur-sm"></div>
                    <Card className="relative border-teal-200 dark:border-teal-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                      <CardContent className="p-5">
                        <FormField
                          control={control}
                          name="targetRaiseAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Banknote className="h-4 w-4 text-teal-500" />
                                Target Raise Amount
                                <Badge variant="outline" className="ml-2 text-xs font-normal bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800">Important</Badge>
                              </FormLabel>
                              
                              {/* Interactive Slider for funding amount */}
                              <div className="mt-4 mb-4">
                                <Controller
                                  control={control}
                                  name="targetRaiseAmount"
                                  render={({ field: sliderField }) => (
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          SAR {min.toLocaleString()}
                                        </span>
                                        <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
                                          Amount: SAR {parseInt(sliderField.value?.toString() || '0').toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          SAR {max.toLocaleString()}
                                        </span>
                                      </div>
                                      
                                      <input 
                                        type="range"
                                        min={min}
                                        max={max}
                                        step={min < 1000000 ? 10000 : 100000}
                                        value={sliderField.value?.toString() || '0'}
                                        onChange={(e) => {
                                          sliderField.onChange(parseInt(e.target.value));
                                        }}
                                        className="w-full h-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg appearance-none cursor-pointer"
                                      />
                                      
                                      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                                        {sliderField.value && parseInt(sliderField.value.toString()) >= 5000000 ? 
                                          "Series A or later stage" : 
                                          sliderField.value && parseInt(sliderField.value.toString()) >= 1000000 ? 
                                          "Seed stage" : "Pre-seed stage"}
                                      </div>
                                    </div>
                                  )}
                                />
                              </div>
                              
                              <div className="flex items-start gap-3 mt-2">
                                <div className="flex-1">
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 font-medium">
                                        SAR
                                      </div>
                                      <Input 
                                        type="number" 
                                        placeholder="e.g., 1000000" 
                                        {...field} 
                                        value={field.value ?? ''} 
                                        className="pl-12 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 bg-white/90 dark:bg-gray-950/90"
                                      />
                                    </div>
                                  </FormControl>
                                </div>
                                
                                {suggestedAmount && !targetRaiseAmount && (
                                  <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={applySuggestedAmount}
                                    className="inline-flex items-center px-3 py-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-medium rounded-md border border-teal-200 dark:border-teal-800 whitespace-nowrap"
                                  >
                                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                                    <span>Use Suggested ({suggestedAmount.toLocaleString('en-US')} SAR)</span>
                                  </motion.button>
                                )}
                              </div>
                              <FormDescription className="mt-2 text-sm flex items-center">
                                <Info className="h-3.5 w-3.5 text-teal-500 mr-1.5" />
                                How much are you looking to raise in your next round? (SAR)
                              </FormDescription>
                              {errors.targetRaiseAmount && (
                                <FormMessage>{errors.targetRaiseAmount.message}</FormMessage>
                              )}
                            </FormItem>
                          )}
                        />
                        
                        <div className="mt-4 pt-4 border-t border-teal-100 dark:border-teal-800/50">
                          <h4 className="text-sm font-medium flex items-center text-teal-700 dark:text-teal-400 mb-2">
                            <Sparkles className="h-4 w-4 mr-1.5" />
                            Typical Round Sizes
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="h-3.5 w-3.5 text-teal-500" />
                              <span>Pre-seed: 100K-500K SAR</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="h-3.5 w-3.5 text-teal-500" />
                              <span>Seed: 500K-3M SAR</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="h-3.5 w-3.5 text-teal-500" />
                              <span>Series A: 3M-15M+ SAR</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Investor Network */}
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl blur-md opacity-80"></div>
          <Card className="relative border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-green-400/20 to-emerald-400/20 dark:from-green-400/10 dark:to-emerald-400/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-t from-emerald-400/20 to-green-400/10 dark:from-emerald-400/10 dark:to-green-400/5 rounded-full -ml-16 -mb-16 blur-xl"></div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-5">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full text-white shadow-md flex-shrink-0 relative">
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse blur-sm"></div>
                  <CircleDollarSign className="h-7 w-7 relative z-10" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 flex items-center">
                      RISE Investor Network
                    </h3>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none shadow-sm flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        Premium
                      </Badge>
                    </motion.div>
                  </div>
                  <p className="text-green-700 dark:text-green-500 text-sm mb-3">
                    Completing this section helps RISE match you with potential investors from our network who align with your needs.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        icon: <DollarSign className="h-4 w-4 text-green-500" />,
                        title: "Industry Alignment",
                        description: "Investors who focus on your sector or industry",
                        delay: 0.1
                      },
                      {
                        icon: <ArrowUpRight className="h-4 w-4 text-green-500" />,
                        title: "Stage Match",
                        description: "Investors focused on your current growth stage",
                        delay: 0.2
                      },
                      {
                        icon: <CreditCard className="h-4 w-4 text-green-500" />,
                        title: "Check Size",
                        description: "Investors with typical check sizes matching your needs",
                        delay: 0.3
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: item.delay, duration: 0.3 }}
                        whileHover={{ 
                          scale: 1.03, 
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="relative overflow-hidden group cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg blur-sm"></div>
                        <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-4 rounded-lg border border-green-100 dark:border-green-900/30 shadow-sm h-full transition-all duration-300 group-hover:border-green-300 dark:group-hover:border-green-700">
                          <div className="absolute right-0 top-0 h-12 w-12 bg-gradient-to-bl from-green-200/40 to-transparent dark:from-green-700/20 rounded-bl-xl"></div>
                          <div className="flex items-start mb-2">
                            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full mr-2 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors duration-300">
                              {item.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.title}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center md:justify-end">
                    <motion.button
                      type="button"
                      onClick={saveFundingData}
                      disabled={loading}
                      className="relative overflow-hidden inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-md shadow-sm hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="relative flex items-center">
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            <span>Save Funding Information</span>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FundingForm; 