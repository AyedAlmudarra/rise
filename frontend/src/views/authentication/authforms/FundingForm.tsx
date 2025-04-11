import React, { useState } from 'react';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '../../../types/startupRegistration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/shadcn-ui/Default-Ui/select";
import { Switch } from "../../../components/shadcn-ui/Default-Ui/switch";
import { CircleDollarSign, PiggyBank, Info, CheckCircle, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/shadcn-ui/Default-Ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/shadcn-ui/Default-Ui/tooltip";
import { Alert, AlertDescription } from "../../../components/shadcn-ui/Default-Ui/alert";
import { supabase } from "../../../lib/supabaseClient";
import { Button } from '../../../components/shadcn-ui/Default-Ui/button';

type FundingFormProps = {
  isRegistrationFlow?: boolean;
};

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

const FundingHelp: React.FC<{ description: string }> = ({ description }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-gray-400 hover:text-emerald-500 cursor-help ml-1.5 transition-colors duration-200" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
        <p className="text-sm">{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const FundingForm: React.FC<FundingFormProps> = ({ isRegistrationFlow = false }) => {
  const { control, watch, formState: { errors }, getValues } = useFormContext<StartupRegistrationData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const seekingInvestment = watch('seekingInvestment');

  const saveFundingData = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      const values = getValues();

      const { data: existingStartup, error: fetchError } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!existingStartup && !isRegistrationFlow) {
        console.error('Attempted to save funding for non-existent startup profile (user_id:', user.id, ')');
        setError("Could not find your startup profile. Please ensure you have completed the initial registration or contact support if the issue persists.");
        setLoading(false);
        return;
      }

      if (!existingStartup && isRegistrationFlow) {
        console.log("In registration flow, skipping Supabase update for Funding - will be saved on final submission.");
        setSuccessMessage("Funding information captured. It will be saved when you complete registration.");
        setLoading(false);
        return;
      }

      if (!existingStartup) {
        console.error('Logic error: existingStartup is null despite checks.');
        setError("An unexpected error occurred while trying to save. Please try again.");
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('startups')
        .update({
          current_funding: values.currentFunding || null,
          seeking_investment: values.seekingInvestment || false,
          target_raise_amount: values.targetRaiseAmount || null,
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setSuccessMessage("Funding information saved successfully!");

    } catch (err: any) {
      console.error('Error saving funding data:', err);
      setError(err.message || 'Failed to save funding data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Funding Status</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Share your funding history and current investment goals.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && !isRegistrationFlow && (
        <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <PiggyBank className="h-5 w-5 mr-2 text-emerald-600" />
              Current Funding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name="currentFunding"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm">
                    Funding Status
                    <FundingHelp description="Select the most recent or current funding stage of your startup." />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white">
                        <SelectValue placeholder="Select funding status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-800">
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
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CircleDollarSign className="h-5 w-5 mr-2 text-teal-600" />
              Investment Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={control}
              name="seekingInvestment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">
                      Currently Seeking Investment?
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Are you actively looking to raise funding?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-teal-600"
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
                  <FormItem>
                    <FormLabel className="flex items-center text-sm">
                      Target Raise Amount (SAR)
                      <FundingHelp description="How much are you looking to raise in your next round? (in Saudi Riyal)" />
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 text-sm">
                          SAR
                        </div>
                        <Input
                          type="number"
                          placeholder="e.g., 1,000,000"
                          {...field}
                          value={field.value ?? ''}
                          className="pl-12 border-gray-300 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Save Button (Simplified and Flow-Aware - Only show if NOT in registration flow) */}
        {!isRegistrationFlow && (
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              onClick={saveFundingData}
              disabled={loading} // Button only enabled when !isRegistrationFlow
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span>Save Funding Info</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingForm; 