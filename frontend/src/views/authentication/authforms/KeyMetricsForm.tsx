import React, { useState } from 'react';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '../../../types/startupRegistration';
import { DollarSign, Users, Percent, TrendingUp, Clock, RefreshCw, TrendingDown, Award, ShoppingCart, BarChart2, Globe, Loader2, AlertCircle, Save, Info, Database, PieChart, ArrowUpRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/shadcn-ui/Default-Ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/shadcn-ui/Default-Ui/tabs";
import { Card, CardContent } from "../../../components/shadcn-ui/Default-Ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/shadcn-ui/Default-Ui/select";
import { Button } from "../../../components/shadcn-ui/Default-Ui/button";
import { Alert, AlertDescription } from "../../../components/shadcn-ui/Default-Ui/alert";
import { supabase } from "../../../lib/supabaseClient";

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
      <TooltipContent className="max-w-xs bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
        <p className="text-sm">{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const KeyMetricsForm: React.FC<KeyMetricsFormProps> = ({ isRegistrationFlow = false }) => {
  const { control, formState: { errors }, getValues } = useFormContext<StartupRegistrationData>();
  const [activeTab, setActiveTab] = useState("core-metrics");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Function to save metrics to Supabase
  const saveMetrics = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Only proceed with Supabase operations if not in registration flow
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      // Get current form values for metrics
      const values = getValues();

      // Check if startup record exists
      const { data: existingStartup, error: fetchError } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // If NOT in registration flow and no profile exists, show error.
      if (!existingStartup && !isRegistrationFlow) {
        console.error('Attempted to save metrics for non-existent startup profile (user_id:', user.id, ')');
        setError("Could not find your startup profile. Please ensure you have completed the initial registration or contact support if the issue persists.");
        setLoading(false);
        return;
      }

      // If profile doesn't exist BUT we are in registration flow, just exit (data saved on final submit)
      if (!existingStartup && isRegistrationFlow) {
          console.log("In registration flow, skipping Supabase update for Key Metrics - will be saved on final submission.");
          setSuccessMessage("Key metrics details captured. They will be saved when you complete registration.");
          setLoading(false);
          return;
      }

      // Proceed with update only if existingStartup is found
      if (!existingStartup) {
          console.error('Logic error: existingStartup is null despite checks.');
          setError("An unexpected error occurred while trying to save. Please try again.");
          setLoading(false);
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

    } catch (err: any) {
      console.error('Error saving metrics:', err);
      setError(err.message || 'Failed to save metrics');
    } finally {
      setLoading(false);
    }
  };

  // Helper to render form fields consistently
  const renderFormField = ({ field, placeholder, type = "number", description, icon: Icon, currency = false, percent = false, min, max }: any) => (
     <FormItem className="space-y-2">
       <FormLabel className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
         {Icon && <Icon className="h-4 w-4 mr-2 text-indigo-500" />}
         {field.name.split('_').slice(1).map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
         <MetricHelp description={description} />
       </FormLabel>
       <FormControl>
         <div className="relative">
           {currency && (
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 text-sm">
               SAR
             </div>
           )}
           <Input
             type={type}
             placeholder={placeholder}
             {...field}
             value={field.value ?? ''}
             className={`w-full ${currency ? 'pl-12' : ''} ${percent ? 'pr-8' : ''} border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white`}
             min={min}
             max={max}
           />
           {percent && (
             <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 text-sm">
               %
             </div>
           )}
         </div>
       </FormControl>
       {/* Optional: Can add back simple form descriptions if needed */}
       {/* <FormDescription className="text-xs text-gray-500">{field.name} description...</FormDescription> */}
       <FormMessage />
     </FormItem>
   );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Key Metrics</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Provide key performance indicators for your startup. All fields are optional.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && !isRegistrationFlow && ( // Only show success outside registration flow
        <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300">
          <Save className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 shadow-sm">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
              <TabsTrigger
                value="core-metrics"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-colors duration-200 py-1.5 text-sm font-medium flex items-center justify-center gap-2"
              >
                <BarChart2 className="h-4 w-4" /> Core
              </TabsTrigger>
              <TabsTrigger
                value="growth-metrics"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-colors duration-200 py-1.5 text-sm font-medium flex items-center justify-center gap-2"
              >
                <TrendingUp className="h-4 w-4" /> Growth
              </TabsTrigger>
              <TabsTrigger
                value="market-metrics"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm rounded-md transition-colors duration-200 py-1.5 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Globe className="h-4 w-4" /> Market
              </TabsTrigger>
            </TabsList>

            <TabsContent value="core-metrics" className="mt-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                  control={control}
                  name="kpi_cac"
                  render={({ field }) => renderFormField({
                    field,
                    placeholder: "e.g., 500",
                    description: "The average cost to acquire one new customer, including marketing and sales expenses.",
                    icon: DollarSign,
                    currency: true
                  })}
                />
                <FormField
                  control={control}
                  name="kpi_clv"
                  render={({ field }) => renderFormField({
                    field,
                    placeholder: "e.g., 2000",
                    description: "The total revenue you expect to generate from a single customer throughout their relationship with your business.",
                    icon: Users,
                    currency: true
                  })}
                />
                <FormField
                  control={control}
                  name="kpi_retention_rate"
                  render={({ field }) => renderFormField({
                    field,
                    placeholder: "e.g., 80",
                    description: "The percentage of customers who remain after a given period (e.g., monthly, annually).",
                    icon: RefreshCw,
                    percent: true,
                    min: 0,
                    max: 100
                  })}
                />
                <FormField
                  control={control}
                  name="kpi_conversion_rate"
                  render={({ field }) => renderFormField({
                    field,
                    placeholder: "e.g., 5",
                    description: "The percentage of website visitors or leads who become paying customers.",
                    icon: Percent,
                    percent: true,
                    min: 0,
                    max: 100
                  })}
                />
              </div>
            </TabsContent>

            <TabsContent value="growth-metrics" className="mt-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                  control={control}
                  name="kpi_monthly_growth"
                  render={({ field }) => renderFormField({
                    field,
                    placeholder: "e.g., 15",
                    description: "The percentage at which your revenue, users, or other key metrics increase month-over-month.",
                    icon: TrendingUp,
                    percent: true
                  })}
                />
                <FormField
                  control={control}
                  name="kpi_payback_period"
                  render={({ field }) => (
                     <FormItem className="space-y-2">
                       <FormLabel className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                         <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                         CAC Payback Period
                         <MetricHelp description="The time it takes to recover the cost of acquiring a new customer." />
                       </FormLabel>
                       <FormControl>
                         <div className="relative">
                           <Input
                             type="number"
                             placeholder="e.g., 6"
                             {...field}
                             value={field.value ?? ''}
                             className="w-full pr-16 border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                             min="0"
                           />
                           <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 text-sm">
                             Months
                           </div>
                         </div>
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                  )}
                />
                 <FormField
                  control={control}
                  name="kpi_churn_rate"
                  render={({ field }) => renderFormField({
                    field,
                    placeholder: "e.g., 5",
                    description: "The percentage of customers who stop using your product or service over a given time period.",
                    icon: TrendingDown,
                    percent: true,
                    min: 0,
                    max: 100
                  })}
                />
                 <FormField
                  control={control}
                  name="kpi_nps"
                  render={({ field }) => renderFormField({
                    field,
                    placeholder: "e.g., 50",
                    description: "A measure of customer satisfaction and loyalty, typically on a scale from -100 to +100.",
                    icon: Award,
                    min: -100,
                    max: 100
                  })}
                />
              </div>
            </TabsContent>

            <TabsContent value="market-metrics" className="mt-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                 <FormField
                  control={control}
                  name="kpi_tam_size"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Database className="h-4 w-4 mr-2 text-indigo-500" />
                        Total Addressable Market (TAM)
                        <MetricHelp description="The total market demand for your product or service, usually measured in annual revenue." />
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                          <SelectTrigger className="w-full border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white">
                            <SelectValue placeholder="Select TAM size (SAR)" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800">
                            <SelectItem value="<1M">Less than 1M</SelectItem>
                            <SelectItem value="1M-10M">1M - 10M</SelectItem>
                            <SelectItem value="10M-100M">10M - 100M</SelectItem>
                            <SelectItem value="100M-1B">100M - 1B</SelectItem>
                            <SelectItem value=">1B">Greater than 1B</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="kpi_avg_order_value"
                  render={({ field }) => renderFormField({
                    field,
                    placeholder: "e.g., 120",
                    description: "The average amount spent each time a customer places an order.",
                    icon: ShoppingCart,
                    currency: true
                  })}
                />
                <FormField
                  control={control}
                  name="kpi_market_share"
                  render={({ field }) => renderFormField({
                    field,
                    placeholder: "e.g., 2.5",
                    description: "The percentage of total market sales or users captured by your business.",
                    icon: PieChart,
                    percent: true,
                    min: 0,
                    max: 100
                  })}
                />
                <FormField
                  control={control}
                  name="kpi_yoy_growth"
                  render={({ field }) => renderFormField({
                    field,
                    placeholder: "e.g., 75",
                    description: "The percentage increase in a metric (typically revenue) compared to the same period in the previous year.",
                    icon: ArrowUpRight,
                    percent: true
                  })}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button (Only show if NOT in registration flow) */}
          {!isRegistrationFlow && (
            <div className="mt-8 flex justify-end">
              <Button
                onClick={saveMetrics}
                disabled={loading} // Button only enabled when !isRegistrationFlow
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {/* Text is simplified as it only shows when not in registration */}
                    <span>Save Metrics</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetricsForm; 