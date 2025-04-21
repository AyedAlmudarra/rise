import React from 'react';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { Textarea } from '../../../components/shadcn-ui/Default-Ui/textarea';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/shadcn-ui/Default-Ui/form";
import { InvestorRegistrationData, InvestorTypeEnum } from '../../../types/investorRegistration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/shadcn-ui/Default-Ui/select";
import { Briefcase, Building, Link as LinkIcon, Linkedin, Info, Type } from 'lucide-react';
import { Card } from "../../../components/shadcn-ui/Default-Ui/card";
import { Badge } from "../../../components/shadcn-ui/Default-Ui/badge";
import { motion } from "framer-motion";

const InvestorProfileForm: React.FC = () => {
  const { control } = useFormContext<InvestorRegistrationData>();

  // Animation variants (can be reused or customized)
  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Investor Profile</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Provide details about your professional role and company.
        </p>
      </motion.div>

      <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-violet-100 dark:border-violet-900/30 p-6 shadow-sm">
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* Job Title & Company Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={formItemVariants} custom={0}>
              <FormField
                control={control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Briefcase className="h-4 w-4 text-violet-500" />
                      Job Title
                      <Badge variant="outline" className="ml-2 text-xs font-normal bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800">Required</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Investment Manager"
                        {...field}
                        className="border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 bg-white dark:bg-gray-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={formItemVariants} custom={1}>
              <FormField
                control={control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Building className="h-4 w-4 text-violet-500" />
                      Company Name
                       <Badge variant="outline" className="ml-2 text-xs font-normal bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800">Required</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., RISE Capital"
                        {...field}
                        className="border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 bg-white dark:bg-gray-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          {/* Investor Type */}
          <motion.div variants={formItemVariants} custom={2}>
            <FormField
              control={control}
              name="investor_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Type className="h-4 w-4 text-violet-500" />
                    Investor Type
                    <Badge variant="outline" className="ml-2 text-xs font-normal bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800">Required</Badge>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 bg-white dark:bg-gray-950">
                        <SelectValue placeholder="Select your primary investor role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-950">
                      {InvestorTypeEnum.options.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the category that best describes your investment activity.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Website & LinkedIn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={formItemVariants} custom={3}>
              <FormField
                control={control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <LinkIcon className="h-4 w-4 text-violet-500" />
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://yourcompany.com"
                        {...field}
                         value={field.value ?? ''} // Handle null/undefined for optional field
                        className="border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 bg-white dark:bg-gray-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={formItemVariants} custom={4}>
              <FormField
                control={control}
                name="linkedinProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Linkedin className="h-4 w-4 text-violet-500" />
                      LinkedIn Profile
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        {...field}
                         value={field.value ?? ''} // Handle null/undefined for optional field
                        className="border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 bg-white dark:bg-gray-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          {/* Company Description */}
          <motion.div variants={formItemVariants} custom={5}>
            <FormField
              control={control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Info className="h-4 w-4 text-violet-500" />
                    About / Investment Thesis
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe your company or your investment focus (optional, max 500 characters)."
                      rows={4}
                      className="resize-none border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 bg-white dark:bg-gray-950"
                      {...field}
                      value={field.value ?? ''} // Handle null/undefined for optional field
                    />
                  </FormControl>
                  <FormDescription>
                    You can share your firm's mission, focus areas, or your personal investment thesis.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </motion.div>
      </Card>
    </div>
  );
};

export default InvestorProfileForm; 