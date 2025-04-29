import React from 'react';
import { Input } from '@/components/shadcn-ui/Default-Ui/input';
import { Textarea } from '@/components/shadcn-ui/Default-Ui/textarea';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '@/types/startupRegistration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn-ui/Default-Ui/select";
import { Calendar, Building, BarChart, DollarSign, Users, FileText, Clock, LayoutGrid, CalendarDays, Info } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/shadcn-ui/Default-Ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/Default-Ui/popover";
import { Button } from "@/components/shadcn-ui/Default-Ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/shadcn-ui/Default-Ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn-ui/Default-Ui/tooltip";
import { Card } from "@/components/shadcn-ui/Default-Ui/card";

// Define operational stages options
const operationalStages = [
  { value: "Idea", label: "Idea Stage" },
  { value: "Pre-seed", label: "Pre-seed" },
  { value: "Seed", label: "Seed" },
  { value: "Series A", label: "Series A" },
  { value: "Series B+", label: "Series B+" },
  { value: "Growth", label: "Growth Stage" },
  { value: "Established", label: "Established" },
];

const CompanyDetailsForm: React.FC = () => {
  const { control, setValue } = useFormContext<StartupRegistrationData>();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Company Details</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Help us understand your company's stage, operations, and growth trajectory.
        </p>
      </div>
      
      <div className="space-y-8">
        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-violet-100 dark:border-violet-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full mr-3">
                <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Company Overview</h3>
            </div>
            
            <FormField
              control={control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FileText className="h-4 w-4 text-violet-500" />
                    Company Description
                    <Badge variant="outline" className="ml-2 text-xs font-normal bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800">Required</Badge>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your company, its mission, and value proposition."
                      rows={5}
                      className="resize-none border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 bg-white dark:bg-gray-950"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <span className="mt-2 flex items-start text-sm">
                      <Info className="h-4 w-4 text-violet-500 mt-0.5 mr-2 flex-shrink-0" />
                      Share your company's vision, mission, and what sets you apart from competitors. This is your opportunity to make a compelling first impression. (20-500 characters)
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-indigo-100 dark:border-indigo-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3">
                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Stage & Timeline</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="operationalStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <BarChart className="h-4 w-4 text-indigo-500" />
                      Operational Stage
                      <Badge variant="outline" className="ml-2 text-xs font-normal bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">Required</Badge>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950">
                          <SelectValue placeholder="Select the current stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-950">
                        {operationalStages.map((stage) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Current funding or development stage of your startup.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="foundingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <CalendarDays className="h-4 w-4 text-indigo-500" />
                      Founding Date
                      <Badge variant="outline" className="ml-2 text-xs font-normal bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">Required</Badge>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal border-gray-300 bg-white dark:bg-gray-950 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:bg-gray-50 dark:hover:bg-gray-900 ${!field.value ? "text-gray-500" : ""}`}
                          >
                            {field.value ? (
                              <span className="flex items-center">
                                <CalendarDays className="mr-2 h-4 w-4 text-indigo-500" />
                                {format(new Date(field.value), "PPP")}
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                                Pick a date
                              </span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => setValue("foundingDate", date ? date.toISOString() : "")}
                          disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                          initialFocus
                          className="rounded-md border-indigo-200 dark:border-indigo-800"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When was your company officially founded?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                <LayoutGrid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                Company Size & Financials
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white/95 dark:bg-gray-800/95 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md backdrop-blur-sm max-w-xs">
                      <p className="text-sm">This information helps investors understand the scale and financial position of your startup. All financial details will be kept confidential.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <FormField
                control={control}
                name="numEmployees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Users className="h-4 w-4 text-blue-500" />
                      Number of Employees
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Users className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder="e.g., 10" 
                          {...field} 
                          value={field.value ?? ''} 
                          className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-10 bg-white dark:bg-gray-950"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Total number of full-time employees
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="numCustomers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Users className="h-4 w-4 text-blue-500" />
                      Number of Customers
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Building className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder="e.g., 100" 
                          {...field} 
                          value={field.value ?? ''} 
                          className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-10 bg-white dark:bg-gray-950"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Approximate number of active customers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField
                control={control}
                name="annualRevenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <DollarSign className="h-4 w-4 text-blue-500" />
                      Annual Revenue (SAR)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                          SAR
                        </div>
                        <Input 
                          type="number" 
                          placeholder="e.g., 500000" 
                          {...field} 
                          value={field.value ?? ''} 
                          className="pl-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-950"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Approximate annual revenue in Saudi Riyals
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="annualExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <DollarSign className="h-4 w-4 text-blue-500" />
                      Annual Expenses (SAR)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                          SAR
                        </div>
                        <Input 
                          type="number" 
                          placeholder="e.g., 300000" 
                          {...field} 
                          value={field.value ?? ''} 
                          className="pl-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-950"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Approximate annual expenses in Saudi Riyals
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Financial information helps investors understand your business model and growth potential. All financial data is kept confidential and only shared with verified investors after matching.
                </p>
              </div>
            </div>
          </Card>
      </div>
    </div>
  );
};

export default CompanyDetailsForm; 