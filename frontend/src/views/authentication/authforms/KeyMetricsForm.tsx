import React, { useState } from 'react';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '../../../types/startupRegistration';
import { DollarSign, Users, Percent, TrendingUp, Clock, RefreshCw, TrendingDown, Award, ShoppingCart, BarChart2, Globe, Info, Database, PieChart, ArrowUpRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/shadcn-ui/Default-Ui/tooltip";
import { Card } from "../../../components/shadcn-ui/Default-Ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/shadcn-ui/Default-Ui/select";
import { Badge } from "../../../components/shadcn-ui/Default-Ui/badge";

type KeyMetricsFormProps = {
  isRegistrationFlow?: boolean;
};

const InfoTooltip: React.FC<{ description: string }> = ({ description }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500 cursor-help ml-1.5 transition-colors duration-200" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs bg-white/95 dark:bg-gray-800/95 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md backdrop-blur-sm">
        <p className="text-sm">{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const KeyMetricsForm: React.FC<KeyMetricsFormProps> = ({ isRegistrationFlow = true }) => {
  const { control, formState: { errors } } = useFormContext<StartupRegistrationData>();

  const renderFormField = ({ field, label, placeholder, type = "number", description, icon: Icon, currency = false, percent = false, min, max }: any) => (
     <FormItem className="space-y-1">
       <FormLabel className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
         {Icon && <Icon className="h-4 w-4 mr-2 text-indigo-500" />}
         {label}
         <InfoTooltip description={description} />
       </FormLabel>
       <FormControl>
         <div className="relative">
           {currency && (
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 text-sm font-medium">
               SAR
             </div>
           )}
           <Input
             type={type}
             placeholder={placeholder}
             {...field}
             value={field.value === null || typeof field.value === 'undefined' ? '' : field.value}
             onChange={e => {
                const value = e.target.value;
                field.onChange(value === '' ? null : parseFloat(value));
             }}
             className={`w-full border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950 ${currency ? 'pl-12' : 'pl-4'} ${percent ? 'pr-8' : 'pr-4'}`}
             min={min}
             max={max}
             step={type === 'number' ? 'any' : undefined}
           />
           {percent && (
             <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 text-sm">
               %
             </div>
           )}
         </div>
       </FormControl>
       <FormMessage />
     </FormItem>
   );

  return (
    <div className="space-y-8">
       <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Key Metrics</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Provide key performance indicators (KPIs) for your startup. All fields are optional but recommended.
        </p>
      </div>

      <div className="space-y-8">
        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-indigo-100 dark:border-indigo-900/30 p-6 shadow-sm">
             <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3">
                <BarChart2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Core Metrics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
              <FormField
                control={control}
                name="kpi_cac"
                render={({ field }) => renderFormField({
                  field,
                  label: "Customer Acquisition Cost (CAC)",
                  placeholder: "e.g., 500",
                  description: "The average cost to acquire one new customer.",
                  icon: DollarSign,
                  currency: true
                })}
              />
              <FormField
                control={control}
                name="kpi_clv"
                render={({ field }) => renderFormField({
                  field,
                  label: "Customer Lifetime Value (CLV)",
                  placeholder: "e.g., 2000",
                  description: "The total revenue expected from a customer over their lifetime.",
                  icon: Users,
                  currency: true
                })}
              />
              <FormField
                control={control}
                name="kpi_retention_rate"
                render={({ field }) => renderFormField({
                  field,
                  label: "Customer Retention Rate",
                  placeholder: "e.g., 80",
                  description: "The percentage of customers retained over a period.",
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
                  label: "Conversion Rate",
                  placeholder: "e.g., 5",
                  description: "The percentage of leads or visitors who convert.",
                  icon: Percent,
                  percent: true,
                  min: 0,
                  max: 100
                })}
              />
            </div>
        </Card>

        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-purple-100 dark:border-purple-900/30 p-6 shadow-sm">
             <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Growth Metrics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
              <FormField
                control={control}
                name="kpi_monthly_growth"
                render={({ field }) => renderFormField({
                  field,
                  label: "Monthly Growth Rate",
                  placeholder: "e.g., 15",
                  description: "Month-over-month percentage growth (e.g., revenue, users).",
                  icon: TrendingUp,
                  percent: true
                })}
              />
              <FormField
                control={control}
                name="kpi_payback_period"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                      CAC Payback Period
                      <InfoTooltip description="The time (in months) it takes to recover the cost of acquiring a new customer." />
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="e.g., 6"
                          {...field}
                          value={field.value ?? ''}
                          onChange={e => {
                            const value = e.target.value;
                            field.onChange(value === '' ? null : parseFloat(value));
                          }}
                          className="w-full border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950 pr-16 pl-4"
                          min="0"
                          step="any"
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
                  label: "Churn Rate",
                  placeholder: "e.g., 5",
                  description: "The percentage of customers lost over a period.",
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
                  label: "Net Promoter Score (NPS)",
                  placeholder: "e.g., 50",
                  description: "Customer satisfaction/loyalty score (-100 to +100).",
                  icon: Award,
                  min: -100,
                  max: 100
                })}
              />
            </div>
        </Card>

        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-cyan-100 dark:border-cyan-900/30 p-6 shadow-sm">
             <div className="flex items-center mb-4">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-full mr-3">
                <Globe className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Market Metrics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <FormField
                control={control}
                name="kpi_tam_size"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Database className="h-4 w-4 mr-2 text-indigo-500" />
                      Total Addressable Market (TAM)
                      <InfoTooltip description="Estimated total market size for your product/service (annual revenue)." />
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950">
                          <SelectValue placeholder="Select TAM size (SAR)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-950">
                        <SelectItem value="<1M">Less than 1M SAR</SelectItem>
                        <SelectItem value="1M-10M">1M - 10M SAR</SelectItem>
                        <SelectItem value="10M-100M">10M - 100M SAR</SelectItem>
                        <SelectItem value="100M-1B">100M - 1B SAR</SelectItem>
                        <SelectItem value=">1B">Greater than 1B SAR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="kpi_avg_order_value"
                render={({ field }) => renderFormField({
                  field,
                  label: "Average Order Value (AOV)",
                  placeholder: "e.g., 120",
                  description: "The average amount spent per customer order.",
                  icon: ShoppingCart,
                  currency: true
                })}
              />
              <FormField
                control={control}
                name="kpi_market_share"
                render={({ field }) => renderFormField({
                  field,
                  label: "Market Share",
                  placeholder: "e.g., 2.5",
                  description: "Your percentage of the total market sales or users.",
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
                  label: "Year-over-Year (YoY) Growth",
                  placeholder: "e.g., 75",
                  description: "Percentage growth compared to the previous year.",
                  icon: ArrowUpRight,
                  percent: true
                })}
              />
            </div>
        </Card>
      </div>
    </div>
  );
};

export default KeyMetricsForm; 