import React from 'react';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '../../../types/startupRegistration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/shadcn-ui/Default-Ui/select";
import { Switch } from "../../../components/shadcn-ui/Default-Ui/switch";
import { CircleDollarSign, PiggyBank, Info } from 'lucide-react';
import { Card } from "../../../components/shadcn-ui/Default-Ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/shadcn-ui/Default-Ui/tooltip";

type FundingFormProps = {};

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

const FundingForm: React.FC<FundingFormProps> = () => {
  const { control, watch } = useFormContext<StartupRegistrationData>();
  const seekingInvestment = watch('seekingInvestment');

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Funding Status</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Share your funding history and current investment goals.
        </p>
      </div>

      <div className="space-y-8">
        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-emerald-100 dark:border-emerald-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-3">
                <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Current Funding</h3>
            </div>

            <FormField
              control={control}
              name="currentFunding"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    Funding Status
                    <InfoTooltip description="Select the most recent or current funding stage of your startup." />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white dark:bg-gray-950">
                        <SelectValue placeholder="Select funding status" />
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
                  <FormMessage />
                </FormItem>
              )}
            />
        </Card>

        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-teal-100 dark:border-teal-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-full mr-3">
                <CircleDollarSign className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Investment Goals</h3>
            </div>
            <div className="space-y-5">
              <FormField
                control={control}
                name="seekingInvestment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-800/50 shadow-inner">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Currently Seeking Investment?
                      </FormLabel>
                      <FormDescription className="text-xs text-gray-600 dark:text-gray-400">
                        Are you actively looking to raise funding?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-teal-600 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700 focus-visible:ring-teal-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {seekingInvestment && (
                <FormField
                  control={control}
                  name="targetRaiseAmount"
                  render={({ field }) => (
                    <FormItem className="space-y-1 mt-4">
                      <FormLabel className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        Target Raise Amount (SAR)
                        <InfoTooltip description="How much are you looking to raise in your next round? (in Saudi Riyal)" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 text-sm font-medium">
                            SAR
                          </div>
                          <Input
                            type="number"
                            placeholder="e.g., 1,000,000"
                            {...field}
                            value={field.value ?? ''}
                            onChange={e => {
                                const value = e.target.value;
                                field.onChange(value === '' ? null : parseFloat(value));
                            }}
                            className="pl-12 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 bg-white dark:bg-gray-950"
                            min="0"
                            step="any"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default FundingForm; 