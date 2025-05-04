import React from 'react';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '../../../types/startupRegistration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/shadcn-ui/Default-Ui/select";
import { Building, MapPin, Globe, Hash, Building2, Briefcase, Map } from 'lucide-react';
import { motion } from "framer-motion";
import { Badge } from "../../../components/shadcn-ui/Default-Ui/badge";

// Industries options
const industries = [
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Finance", label: "Finance" },
  { value: "Education", label: "Education" },
  { value: "Retail", label: "Retail" },
  { value: "Energy", label: "Energy" },
  { value: "Transportation", label: "Transportation" },
  { value: "Hospitality", label: "Hospitality" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Agriculture", label: "Agriculture" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Other", label: "Other" },
];

// Countries options (showing just a few for the example)
const countries = [
  { value: "Saudi Arabia", label: "Saudi Arabia" },
  { value: "Other", label: "Other" },
];

const BasicInfoForm: React.FC = () => {
  const { control, watch } = useFormContext<StartupRegistrationData>();
  
  // Watch the industry value to potentially filter sectors
  const selectedIndustry = watch('industry');

  // Animation variants for form items
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

  // Different sectors based on industry (simplified example)
  const getSectors = () => {
    switch (selectedIndustry) {
      case 'Technology':
        return [
          { value: "SaaS", label: "Software as a Service (SaaS)" },
          { value: "AI/ML", label: "Artificial Intelligence / Machine Learning" },
          { value: "Cybersecurity", label: "Cybersecurity" },
          { value: "Blockchain", label: "Blockchain / Web3" },
          { value: "Mobile Apps", label: "Mobile Applications" },
          { value: "IoT", label: "Internet of Things (IoT)" },
          { value: "E-commerce", label: "E-commerce" },
          { value: "Other", label: "Other Tech" },
        ];
      case 'Healthcare':
        return [
          { value: "Digital Health", label: "Digital Health" },
          { value: "Biotech", label: "Biotechnology" },
          { value: "Medical Devices", label: "Medical Devices" },
          { value: "Healthcare Services", label: "Healthcare Services" },
          { value: "Mental Health", label: "Mental Health" },
          { value: "Other", label: "Other Healthcare" },
        ];
      case 'Finance':
        return [
          { value: "Fintech", label: "Financial Technology (Fintech)" },
          { value: "Banking", label: "Banking" },
          { value: "Insurance", label: "Insurance" },
          { value: "Investment", label: "Investment" },
          { value: "Payments", label: "Payments" },
          { value: "Blockchain Finance", label: "Blockchain / Crypto" },
          { value: "Other", label: "Other Finance" },
        ];
      // Add more industries as needed
      default:
        return [
          { value: "General", label: "General" },
          { value: "Specialized", label: "Specialized" },
          { value: "Other", label: "Other" },
        ];
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Basic Information</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Tell us about your startup's identity and location.
        </p>
      </motion.div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="space-y-8"
      >
        {/* Startup Identity Section */}
        <motion.div
          variants={formItemVariants}
          custom={0}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-950/20 dark:to-green-950/20 rounded-xl blur-md opacity-80"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-teal-100 dark:border-teal-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-full mr-3">
                <Building className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Startup Identity</h3>
            </div>
            
            <div className="space-y-6">
              <FormField
                control={control}
                name="startupName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Building className="h-4 w-4 text-teal-500" />
                      Startup Name
                      <Badge variant="outline" className="ml-2 text-xs font-normal bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800">Required</Badge>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <Input 
                          placeholder="Enter your startup's name" 
                          {...field} 
                          className="border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Your official company name or current project name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Briefcase className="h-4 w-4 text-teal-500" />
                        Industry
                        <Badge variant="outline" className="ml-2 text-xs font-normal bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800">Required</Badge>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10">
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {industries.map((industry) => (
                            <SelectItem key={industry.value} value={industry.value}>
                              {industry.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Hash className="h-4 w-4 text-teal-500" />
                        Sector
                        <Badge variant="outline" className="ml-2 text-xs font-normal bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800">Required</Badge>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10">
                            <SelectValue placeholder="Select your sector" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {getSectors().map((sector) => (
                            <SelectItem key={sector.value} value={sector.value}>
                              {sector.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Location Section */}
        <motion.div
          variants={formItemVariants}
          custom={1}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 rounded-xl blur-md opacity-80"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-blue-100 dark:border-blue-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Location</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="locationCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      City
                      <Badge variant="outline" className="ml-2 text-xs font-normal bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">Required</Badge>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <Input 
                          placeholder="e.g., Riyadh, Jeddah" 
                          {...field} 
                          className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="countryOfOperation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Globe className="h-4 w-4 text-blue-500" />
                      Country
                      <Badge variant="outline" className="ml-2 text-xs font-normal bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">Required</Badge>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-start">
                <Map className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your location information helps connect you with relevant investors and resources in your region.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BasicInfoForm; 