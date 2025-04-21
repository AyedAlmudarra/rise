import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/shadcn-ui/Default-Ui/form";
import { Checkbox } from "../../../components/shadcn-ui/Default-Ui/checkbox";
import { InvestorRegistrationData, Industries, Geographies, Stages } from '../../../types/investorRegistration';
import { Factory, MapPin, TrendingUp, Info } from 'lucide-react';
import { Card } from "../../../components/shadcn-ui/Default-Ui/card";
import { Badge } from "../../../components/shadcn-ui/Default-Ui/badge";
import { motion } from "framer-motion";

// Helper component for rendering checkbox groups
const CheckboxGroup = ({
  name,
  label,
  options,
  icon: Icon,
  description
}: {
  name: keyof InvestorRegistrationData;
  label: string;
  options: string[];
  icon: React.ElementType;
  description: string;
}) => {
  const { control } = useFormContext<InvestorRegistrationData>();

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-200">
              <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
              {label}
               <Badge variant="outline" className="ml-2 text-xs font-normal bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">Optional</Badge>
            </FormLabel>
            <FormDescription className="mt-1 flex items-start text-sm">
                 <Info className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                 {description}
            </FormDescription>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {options.map((option) => (
              <FormField
                key={option}
                control={control}
                name={name}
                render={({ field }) => {
                  // Ensure field.value is always an array for checking
                  const fieldValue = Array.isArray(field.value) ? field.value : [];
                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                      <FormControl>
                        <Checkbox
                          checked={fieldValue.includes(option)}
                          onCheckedChange={(checked) => {
                            const currentValues = Array.isArray(field.value) ? field.value : [];
                            return checked
                              ? field.onChange([...currentValues, option])
                              : field.onChange(currentValues.filter((value) => value !== option));
                          }}
                          className="border-gray-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-gray-700 dark:text-gray-300 cursor-pointer">
                        {option}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const InvestorPreferencesForm: React.FC = () => {
  return (
    <div className="space-y-8">
       <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Investment Preferences</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Specify your preferred investment areas to help us match you with relevant startups.
        </p>
      </motion.div>

      <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-green-100 dark:border-green-900/30 p-6 shadow-sm space-y-8">
        <CheckboxGroup
          name="preferred_industries"
          label="Preferred Industries"
          options={Industries}
          icon={Factory}
          description="Select the industries you are most interested in investing in."
        />

        <CheckboxGroup
          name="preferred_geography"
          label="Preferred Geography"
          options={Geographies}
          icon={MapPin}
          description="Select the geographic regions you focus on."
        />

        <CheckboxGroup
          name="preferred_stage"
          label="Preferred Stage"
          options={Stages}
          icon={TrendingUp}
          description="Select the startup stages you typically invest in."
        />
      </Card>
    </div>
  );
};

export default InvestorPreferencesForm; 