// Add declare module for canvas-confetti at the top
declare module 'canvas-confetti';

import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '../../../types/startupRegistration';
import { BarChart3, DollarSign, Users, Percent, TrendingUp, LineChart, Clock, RefreshCw, TrendingDown, Target, Award, ShoppingCart, Sparkles, CircleDollarSign, BarChart2, Gauge, PieChart, ArrowUpRight, Info, Database, Globe, Loader2, AlertCircle, Save, ChevronUp, ChevronDown, CreditCard, ArrowUp, AreaChart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/shadcn-ui/Default-Ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/shadcn-ui/Default-Ui/tabs";
import { Card, CardContent } from "../../../components/shadcn-ui/Default-Ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/shadcn-ui/Default-Ui/select";
import { Badge } from "../../../components/shadcn-ui/Default-Ui/badge";
import { Button } from "../../../components/shadcn-ui/Default-Ui/button";
import { Alert, AlertDescription } from "../../../components/shadcn-ui/Default-Ui/alert";
import { supabase } from "../../../lib/supabaseClient";
import { Progress } from "../../../components/shadcn-ui/Default-Ui/progress";
import confetti from 'canvas-confetti';

type KeyMetricsFormProps = {
  isRegistrationFlow?: boolean;
};

// Custom tooltip help component
const MetricHelp: React.FC<{ description: string }> = ({ description }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-indigo-500 cursor-help ml-1.5 transition-colors duration-200" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs bg-white/95 dark:bg-gray-800/95 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md backdrop-blur-sm" align="start">
        <p className="text-sm">{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Radar Chart Component for visualizing metrics
const MetricsSummary: React.FC<{
  cacValue?: string | number | null;
  clvValue?: string | number | null;
  retentionRate?: string | number | null;
  conversionRate?: string | number | null;
  monthlyGrowth?: string | number | null;
}> = ({ cacValue, clvValue, retentionRate, conversionRate, monthlyGrowth }) => {
  const metrics = [
    { key: "Customer Acquisition Cost", value: cacValue, icon: <CreditCard className="h-4 w-4 text-indigo-500" /> },
    { key: "Customer Lifetime Value", value: clvValue, icon: <Users className="h-4 w-4 text-blue-500" /> },
    { key: "Retention Rate", value: retentionRate ? `${retentionRate}%` : undefined, icon: <ArrowUp className="h-4 w-4 text-emerald-500" /> },
    { key: "Conversion Rate", value: conversionRate ? `${conversionRate}%` : undefined, icon: <AreaChart className="h-4 w-4 text-violet-500" /> },
    { key: "Monthly Growth", value: monthlyGrowth ? `${monthlyGrowth}%` : undefined, icon: <TrendingUp className="h-4 w-4 text-pink-500" /> },
  ].filter(metric => metric.value);
  
  if (metrics.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Add metrics information to see a summary
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-indigo-100 dark:border-indigo-900 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/30 dark:to-purple-900/30 border-b border-indigo-100 dark:border-indigo-800">
          <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            Key Metrics Summary
          </h3>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-full">
                  {metric.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {metric.key}
                </span>
              </div>
              <Badge variant="outline" className="font-semibold">
                {metric.value}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Progress bar for metric completion
const MetricsProgress: React.FC<{ values: any }> = ({ values }) => {
  // Count how many fields have values
  const filledFields = Object.keys(values).filter(key => 
    key.startsWith('kpi_') && values[key] !== undefined && values[key] !== null && values[key] !== ''
  ).length;
  
  // Total KPI fields
  const totalFields = Object.keys(values).filter(key => key.startsWith('kpi_')).length;
  
  // Calculate completion percentage
  const completionPercentage = (filledFields / totalFields) * 100;
  
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-indigo-100 dark:border-indigo-900/30 p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Metrics Completion</div>
        <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{Math.round(completionPercentage)}%</div>
      </div>
      <Progress value={completionPercentage} className="h-2 bg-indigo-100 dark:bg-indigo-900/30" />
      <div className="flex justify-between mt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {filledFields} of {totalFields} metrics provided
        </div>
        <div className="text-xs text-indigo-500 dark:text-indigo-400">
          {completionPercentage < 50 ? 'Just starting' : completionPercentage < 80 ? 'Good progress' : 'Almost complete'}
        </div>
      </div>
    </div>
  );
};

// Metric card component for consistent styling
const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  important?: boolean;
  color?: string;
}> = ({ icon, title, description, children, important = false, color = "indigo" }) => (
  <div className="relative">
    <div className={`absolute inset-0 bg-gradient-to-r from-${color}-50 to-${color}-50/60 dark:from-${color}-950/20 dark:to-${color}-950/10 rounded-xl blur-sm opacity-80 ${important ? 'from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/20' : ''}`}></div>
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Card 
        className={`relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 overflow-hidden transition-all duration-300 hover:shadow-md rounded-xl border ${
          important 
            ? 'border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700' 
            : `border-${color}-100 dark:border-${color}-900/30 hover:border-${color}-200 dark:hover:border-${color}-800/50`
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-2 rounded-full ${
              important 
                ? 'bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-sm' 
                : `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-500 dark:text-${color}-400`
            }`}>
              {icon}
            </div>
            <div className="flex items-center">
              <h3 className={`text-sm font-medium ${
                important 
                  ? 'text-indigo-700 dark:text-indigo-300' 
                  : `text-${color}-700 dark:text-${color}-300`
              }`}>
                {title}
              </h3>
              <MetricHelp description={description} />
            </div>
            {important && (
              <Badge 
                variant="outline" 
                className="ml-auto bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 text-xs font-normal"
              >
                Key Metric
              </Badge>
            )}
          </div>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

const KeyMetricsForm: React.FC<KeyMetricsFormProps> = ({ isRegistrationFlow = false }) => {
  const { control, formState: { errors }, getValues, watch } = useFormContext<StartupRegistrationData>();
  const [activeTab, setActiveTab] = useState("core-metrics");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showMetricsSummary, setShowMetricsSummary] = useState(false);
  
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

  // Watch key metrics for radar chart
  const cacValue = watch('kpi_cac');
  const clvValue = watch('kpi_clv');
  const retentionRate = watch('kpi_retention_rate');
  const conversionRate = watch('kpi_conversion_rate');
  const monthlyGrowth = watch('kpi_monthly_growth');

  // Function to trigger confetti effect on successful save
  const triggerConfetti = () => {
    const end = Date.now() + 1000;
    
    const colors = ['#818cf8', '#c084fc', '#a78bfa'];
    
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

  // Function to save metrics to Supabase
  const saveMetrics = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // If we're in registration flow, don't actually save to Supabase
      // Just show success and return
      if (isRegistrationFlow || window.location.pathname.includes('register')) {
        console.log("In registration flow, skipping Supabase calls");
        setSuccessMessage("Metrics will be saved with your registration");
        triggerConfetti();
        setLoading(false);
        return;
      }
      
      // Only proceed with Supabase operations if not in registration flow
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        setError("Authentication error. Your session may have expired. Please refresh the page and try again.");
        setLoading(false);
        return;
      }
      
      if (!user) {
        setError("You must be logged in to save metrics. Please refresh the page and try again.");
        setLoading(false);
        return;
      }
      
      // Get current form values for metrics
      const values = getValues();
      
      // Check if startup record exists
      const { data: existingStartup } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (!existingStartup) {
        // This is normal during the initial registration process
        // The metrics will be saved with the complete form submission
        setSuccessMessage("Metrics will be saved with your registration");
        triggerConfetti();
        return;
      }
      
      // Update just the metrics fields
      const { error: updateError } = await supabase
        .from('startups')
        .update({
          kpi_cac: values.kpi_cac || null,
          kpi_clv: values.kpi_clv || null,
          kpi_retention_rate: values.kpi_retention_rate || null,
          kpi_conversion_rate: values.kpi_conversion_rate || null,
          kpi_monthly_growth: values.kpi_monthly_growth || null,
          kpi_payback_period: values.kpi_payback_period || null,
          kpi_churn_rate: values.kpi_churn_rate || null,
          kpi_nps: values.kpi_nps || null,
          kpi_tam_size: values.kpi_tam_size || null,
          kpi_avg_order_value: values.kpi_avg_order_value || null,
          kpi_market_share: values.kpi_market_share || null,
          kpi_yoy_growth: values.kpi_yoy_growth || null,
        })
        .eq('user_id', user.id);
      
      if (updateError) throw updateError;
      
      setSuccessMessage("Metrics saved successfully!");
      triggerConfetti();
      
    } catch (err: any) {
      console.error('Error saving metrics:', err);
      setError(err.message || 'Failed to save metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Key Metrics</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          These metrics help investors understand your business performance and growth potential.
          <span className="text-gray-500 text-sm block mt-1">All fields in this section are optional.</span>
        </p>
      </motion.div>
      
      {error && (
        <Alert variant="destructive" className="animate-in fade-in-50 duration-300">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <Alert className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 animate-in fade-in-50 duration-300">
              <div className="flex items-center">
                <div className="bg-indigo-100 dark:bg-indigo-800/30 p-1 rounded-full mr-2">
                  <Save className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <AlertDescription>{successMessage}</AlertDescription>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl blur-sm opacity-60"></div>
            <div className="relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-indigo-200 dark:border-indigo-800 shadow-sm">
              <div className="flex items-start">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full text-white shadow-md mr-4 flex-shrink-0">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-indigo-800 dark:text-indigo-300 font-medium mb-1">Why metrics matter</h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-400">
                    Sharing your key performance indicators helps investors assess your business model, 
                    traction, and potential for growth. Even approximate values provide valuable context for investment decisions.
                  </p>
                </div>
              </div>
              
              {/* Add metrics progress tracker */}
              <MetricsProgress values={getValues()} />
              
              {/* Toggle for radar chart */}
              <div className="mt-4 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium py-2 px-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                  onClick={() => setShowMetricsSummary(!showMetricsSummary)}
                >
                  {showMetricsSummary ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Hide Metrics Visualization
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show Metrics Visualization
                    </>
                  )}
                </motion.button>
              </div>
              
              <AnimatePresence>
                {showMetricsSummary && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <MetricsSummary 
                      cacValue={cacValue}
                      clvValue={clvValue}
                      retentionRate={retentionRate}
                      conversionRate={conversionRate}
                      monthlyGrowth={monthlyGrowth}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 rounded-xl blur-md opacity-80"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-violet-100 dark:border-violet-900/30 p-6 shadow-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700">
                <TabsTrigger 
                  value="core-metrics" 
                  className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-all duration-300 font-medium"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Core Metrics</span>
                  <span className="sm:hidden">Core</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="growth-metrics" 
                  className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-all duration-300 font-medium"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Growth Metrics</span>
                  <span className="sm:hidden">Growth</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="market-metrics" 
                  className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-all duration-300 font-medium"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Market Metrics</span>
                  <span className="sm:hidden">Market</span>
                </TabsTrigger>
              </TabsList>

              <div className="min-h-[400px]">
                {/* Core Metrics */}
                <TabsContent value="core-metrics" className="mt-0 outline-none">
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key="core-metrics"
                  >
                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<DollarSign className="h-5 w-5" />}
                        title="Customer Acquisition Cost (CAC)"
                        description="The average cost to acquire one new customer, including marketing and sales expenses."
                        important={true}
                      >
                        <FormField
                          control={control}
                          name="kpi_cac"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 font-medium">
                                    SAR
                                  </div>
                                  <Input 
                                    type="number" 
                                    placeholder="e.g., 500" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    className="pl-12 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white/90 dark:bg-gray-950/90"
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="mt-2 text-xs flex items-center">
                                <Info className="h-3.5 w-3.5 text-indigo-500 mr-1.5" />
                                Lower CAC relative to CLV indicates a healthy business model
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<Users className="h-5 w-5" />}
                        title="Customer Lifetime Value (CLV)"
                        description="The total revenue you expect to generate from a single customer throughout their relationship with your business."
                        important={true}
                      >
                        <FormField
                          control={control}
                          name="kpi_clv"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 font-medium">
                                    SAR
                                  </div>
                                  <Input 
                                    type="number" 
                                    placeholder="e.g., 2000" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    className="pl-12 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white/90 dark:bg-gray-950/90"
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="mt-2 text-xs flex items-center">
                                <Info className="h-3.5 w-3.5 text-indigo-500 mr-1.5" />
                                Aim for a CLV at least 3x higher than your CAC
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<RefreshCw className="h-5 w-5" />}
                        title="Customer Retention Rate"
                        description="The percentage of customers who remain after a given period (e.g., monthly, annually)."
                        color="blue"
                      >
                        <FormField
                          control={control}
                          name="kpi_retention_rate"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <Input 
                                    type="number" 
                                    placeholder="e.g., 80" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/90 dark:bg-gray-950/90 pr-8"
                                    min="0"
                                    max="100"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 font-medium">
                                    %
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs mt-2 flex items-center">
                                <Info className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                                Enter a percentage between 0-100
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<Percent className="h-5 w-5" />}
                        title="Conversion Rate"
                        description="The percentage of website visitors or leads who become paying customers."
                        color="blue"
                      >
                        <FormField
                          control={control}
                          name="kpi_conversion_rate"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <Input 
                                    type="number" 
                                    placeholder="e.g., 5" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/90 dark:bg-gray-950/90 pr-8"
                                    min="0"
                                    max="100"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 font-medium">
                                    %
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs mt-2 flex items-center">
                                <Info className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                                Higher conversion rates indicate product-market fit
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>
                  </motion.div>
                </TabsContent>
                
                {/* Growth Metrics */}
                <TabsContent value="growth-metrics" className="mt-0 outline-none">
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key="growth-metrics"
                  >
                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<TrendingUp className="h-5 w-5" />}
                        title="Monthly Growth Rate"
                        description="The percentage at which your revenue, users, or other key metrics increase month-over-month."
                        important={true}
                        color="emerald"
                      >
                        <FormField
                          control={control}
                          name="kpi_monthly_growth"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <Input 
                                    type="number" 
                                    placeholder="e.g., 15" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    className="border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white/90 dark:bg-gray-950/90 pr-8"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 font-medium">
                                    %
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs mt-2 flex items-center">
                                <Info className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
                                For early-stage startups, 15-20% is often considered good
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<Clock className="h-5 w-5" />}
                        title="CAC Payback Period"
                        description="The time it takes to recover the cost of acquiring a new customer."
                        color="emerald"
                      >
                        <FormField
                          control={control}
                          name="kpi_payback_period"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <Input 
                                    type="number" 
                                    placeholder="e.g., 6" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    className="border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white/90 dark:bg-gray-950/90 pr-12"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 font-medium">
                                    Months
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs mt-2 flex items-center">
                                <Info className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
                                Shorter payback periods indicate better unit economics
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<TrendingDown className="h-5 w-5" />}
                        title="Churn Rate"
                        description="The percentage of customers who stop using your product or service over a given time period."
                        color="amber"
                      >
                        <FormField
                          control={control}
                          name="kpi_churn_rate"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <Input 
                                    type="number" 
                                    placeholder="e.g., 5" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    className="border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-white/90 dark:bg-gray-950/90 pr-8"
                                    min="0"
                                    max="100"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 font-medium">
                                    %
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs mt-2 flex items-center">
                                <Info className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                                Lower is better; varies by industry and business model
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<Award className="h-5 w-5" />}
                        title="Net Promoter Score (NPS)"
                        description="A measure of customer satisfaction and loyalty, typically on a scale from -100 to +100."
                        color="amber"
                      >
                        <FormField
                          control={control}
                          name="kpi_nps"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <Input 
                                    type="number" 
                                    placeholder="e.g., 50" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    className="border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-white/90 dark:bg-gray-950/90"
                                    min="-100"
                                    max="100"
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs mt-2 flex items-center">
                                <Info className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                                Above 0 is good, above 50 is excellent, above 70 is world-class
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>
                  </motion.div>
                </TabsContent>
                
                {/* Market Metrics */}
                <TabsContent value="market-metrics" className="mt-0 outline-none">
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key="market-metrics"
                  >
                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<Database className="h-5 w-5" />}
                        title="Total Addressable Market (TAM)"
                        description="The total market demand for your product or service, usually measured in annual revenue."
                        important={true}
                        color="cyan"
                      >
                        <FormField
                          control={control}
                          name="kpi_tam_size"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                    <SelectTrigger className="border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 bg-white/90 dark:bg-gray-950/90">
                                      <SelectValue placeholder="Select TAM size" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-950">
                                      <SelectItem value="<1M">Less than 1M SAR</SelectItem>
                                      <SelectItem value="1M-10M">1M - 10M SAR</SelectItem>
                                      <SelectItem value="10M-100M">10M - 100M SAR</SelectItem>
                                      <SelectItem value="100M-1B">100M - 1B SAR</SelectItem>
                                      <SelectItem value=">1B">Greater than 1B SAR</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs mt-2 flex items-center">
                                <Info className="h-3.5 w-3.5 text-cyan-500 mr-1.5" />
                                Larger TAMs indicate more growth potential but often higher competition
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<ShoppingCart className="h-5 w-5" />}
                        title="Average Order Value (AOV)"
                        description="The average amount spent each time a customer places an order."
                        color="cyan"
                      >
                        <FormField
                          control={control}
                          name="kpi_avg_order_value"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 font-medium">
                                    SAR
                                  </div>
                                  <Input 
                                    type="number" 
                                    placeholder="e.g., 120" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    className="pl-12 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 bg-white/90 dark:bg-gray-950/90"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<PieChart className="h-5 w-5" />}
                        title="Market Share"
                        description="The percentage of total market sales or users captured by your business."
                        color="violet"
                      >
                        <FormField
                          control={control}
                          name="kpi_market_share"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <Input 
                                    type="number" 
                                    placeholder="e.g., 2.5" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    className="border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 bg-white/90 dark:bg-gray-950/90 pr-8"
                                    min="0"
                                    max="100"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 font-medium">
                                    %
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MetricCard
                        icon={<ArrowUpRight className="h-5 w-5" />}
                        title="Year-over-Year Growth"
                        description="The percentage increase in a metric (typically revenue) compared to the same period in the previous year."
                        color="violet"
                      >
                        <FormField
                          control={control}
                          name="kpi_yoy_growth"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative mt-2">
                                  <Input 
                                    type="number" 
                                    placeholder="e.g., 75" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    className="border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 bg-white/90 dark:bg-gray-950/90 pr-8"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 font-medium">
                                    %
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs mt-2 flex items-center">
                                <Info className="h-3.5 w-3.5 text-violet-500 mr-1.5" />
                                Investors typically look for strong, consistent YoY growth
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </MetricCard>
                    </motion.div>
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
            
            {/* Add Save Metrics Button */}
            <div className="mt-8 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={saveMetrics}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md px-4 py-2 rounded-md font-medium text-sm flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving Metrics...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Metrics
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KeyMetricsForm; 