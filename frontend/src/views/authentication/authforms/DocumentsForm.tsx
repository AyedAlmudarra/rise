import React, { useState, useRef } from 'react';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '../../../types/startupRegistration';
import { Button } from '../../../components/shadcn-ui/Default-Ui/button';
import { FileUp, Trash2, Link, Linkedin, Twitter, Upload, Check, AlertTriangle, FileType, Info, Image, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "../../../components/shadcn-ui/Default-Ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/shadcn-ui/Default-Ui/tooltip";
import { Progress } from '../../../components/shadcn-ui/Default-Ui/progress';
import { Alert, AlertDescription, AlertTitle } from "../../../components/shadcn-ui/Default-Ui/alert";

// File type definitions
const ALLOWED_LOGO_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
const ALLOWED_PITCH_TYPES = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PITCH_SIZE = 10 * 1024 * 1024; // 10MB

const DocumentsForm: React.FC = () => {
  const { control, setValue, watch } = useFormContext<StartupRegistrationData>();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const pitchDeckInputRef = useRef<HTMLInputElement>(null);
  
  // For simulating upload progress
  const [logoUploadProgress, setLogoUploadProgress] = useState(0);
  const [pitchUploadProgress, setPitchUploadProgress] = useState(0);
  const [logoUploading, setLogoUploading] = useState(false);
  const [pitchUploading, setPitchUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [pitchError, setPitchError] = useState<string | null>(null);
  
  // Current file values
  const companyLogo = watch('companyLogo');
  const pitchDeck = watch('pitchDeck');
  const website = watch('website');
  const linkedinProfile = watch('linkedinProfile');
  const twitterProfile = watch('twitterProfile');
  
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  // File upload handlers
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Reset previous error
    setLogoError(null);
    
    // Validate file type
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setLogoError(`Invalid file type. Please upload ${ALLOWED_LOGO_TYPES.map(t => t.split('/')[1]).join(', ')}`);
      return;
    }
    
    // Validate file size
    if (file.size > MAX_LOGO_SIZE) {
      setLogoError(`File is too large. Maximum size is ${MAX_LOGO_SIZE / (1024 * 1024)}MB`);
      return;
    }
    
    // Simulate upload
    setLogoUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        clearInterval(interval);
        setLogoUploadProgress(100);
        setValue('companyLogo', file);
        setTimeout(() => {
          setLogoUploading(false);
        }, 500);
      } else {
        setLogoUploadProgress(progress);
      }
    }, 200);
  };
  
  const handlePitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Reset previous error
    setPitchError(null);
    
    // Validate file type
    if (!ALLOWED_PITCH_TYPES.includes(file.type)) {
      setPitchError(`Invalid file type. Please upload ${ALLOWED_PITCH_TYPES.map(t => t.split('/')[1].replace('vnd.ms-powerpoint', 'ppt').replace('vnd.openxmlformats-officedocument.presentationml.presentation', 'pptx')).join(', ')}`);
      return;
    }
    
    // Validate file size
    if (file.size > MAX_PITCH_SIZE) {
      setPitchError(`File is too large. Maximum size is ${MAX_PITCH_SIZE / (1024 * 1024)}MB`);
      return;
    }
    
    // Simulate upload
    setPitchUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        clearInterval(interval);
        setPitchUploadProgress(100);
        setValue('pitchDeck', file);
        setTimeout(() => {
          setPitchUploading(false);
        }, 500);
      } else {
        setPitchUploadProgress(progress);
      }
    }, 200);
  };
  
  const removeLogo = () => {
    setValue('companyLogo', null);
    setLogoUploadProgress(0);
    if (logoInputRef.current) logoInputRef.current.value = '';
  };
  
  const removePitch = () => {
    setValue('pitchDeck', null);
    setPitchUploadProgress(0);
    if (pitchDeckInputRef.current) pitchDeckInputRef.current.value = '';
  };
  
  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Documents & Online Presence</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Upload important documents and link your online profiles to complete your startup profile.
        </p>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* File uploads section */}
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl blur-md opacity-80"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-amber-100 dark:border-amber-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mr-3">
                <FileUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Documents</h3>
            </div>
            
            <div className="space-y-6">
              {/* Company Logo Upload */}
              <div>
                <FormField
                  control={control}
                  name="companyLogo"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Image className="h-4 w-4 text-amber-500" />
                        Company Logo
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-white/95 dark:bg-gray-800/95 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md backdrop-blur-sm max-w-xs">
                              <p className="text-sm">Your logo will be displayed on your startup profile. Recommended size: 500x500px.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      
                      <div className="mt-2">
                        <input
                          type="file"
                          id="logo-upload"
                          className="sr-only"
                          accept={ALLOWED_LOGO_TYPES.join(',')}
                          onChange={handleLogoChange}
                          ref={logoInputRef}
                        />
                        
                        {!companyLogo && !logoUploading ? (
                          <div 
                            className="border-2 border-dashed border-amber-200 dark:border-amber-800 rounded-lg p-8 text-center hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors cursor-pointer group"
                            onClick={() => logoInputRef.current?.click()}
                          >
                            <div className="mx-auto flex flex-col items-center">
                              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                <Upload className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                              </div>
                              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Upload your company logo</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Drag and drop or click to browse
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                PNG, JPG, GIF, SVG (max. {MAX_LOGO_SIZE / (1024 * 1024)}MB)
                              </p>
                            </div>
                          </div>
                        ) : logoUploading ? (
                          <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-6 bg-amber-50 dark:bg-amber-900/10">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Uploading...</span>
                                <span className="text-xs text-amber-600 dark:text-amber-400">{Math.round(logoUploadProgress)}%</span>
                              </div>
                              <Progress value={logoUploadProgress} className="h-2" />
                            </div>
                          </div>
                        ) : (
                          <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded border border-amber-200 dark:border-amber-800">
                                  <FileType className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                                    {companyLogo?.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {companyLogo ? formatFileSize(companyLogo.size) : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Check className="h-5 w-5 text-green-500 mr-2" />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeLogo}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {logoError && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{logoError}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Pitch Deck Upload */}
              <div>
                <FormField
                  control={control}
                  name="pitchDeck"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <FileUp className="h-4 w-4 text-amber-500" />
                        Pitch Deck
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-white/95 dark:bg-gray-800/95 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md backdrop-blur-sm max-w-xs">
                              <p className="text-sm">Your pitch deck will be available to potential investors. Keep it concise and impactful.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      
                      <div className="mt-2">
                        <input
                          type="file"
                          id="pitch-upload"
                          className="sr-only"
                          accept={ALLOWED_PITCH_TYPES.join(',')}
                          onChange={handlePitchChange}
                          ref={pitchDeckInputRef}
                        />
                        
                        {!pitchDeck && !pitchUploading ? (
                          <div 
                            className="border-2 border-dashed border-amber-200 dark:border-amber-800 rounded-lg p-8 text-center hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors cursor-pointer group"
                            onClick={() => pitchDeckInputRef.current?.click()}
                          >
                            <div className="mx-auto flex flex-col items-center">
                              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                <Upload className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                              </div>
                              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Upload your pitch deck</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Drag and drop or click to browse
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                PDF, PPT, PPTX (max. {MAX_PITCH_SIZE / (1024 * 1024)}MB)
                              </p>
                            </div>
                          </div>
                        ) : pitchUploading ? (
                          <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-6 bg-amber-50 dark:bg-amber-900/10">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Uploading...</span>
                                <span className="text-xs text-amber-600 dark:text-amber-400">{Math.round(pitchUploadProgress)}%</span>
                              </div>
                              <Progress value={pitchUploadProgress} className="h-2" />
                            </div>
                          </div>
                        ) : (
                          <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded border border-amber-200 dark:border-amber-800">
                                  <FileType className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                                    {pitchDeck?.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {pitchDeck ? formatFileSize(pitchDeck.size) : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Check className="h-5 w-5 text-green-500 mr-2" />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removePitch}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {pitchError && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{pitchError}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      
                      <FormDescription>
                        A pitch deck helps investors understand your vision, business model, and growth potential.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Online Presence Section */}
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl blur-md opacity-80"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-blue-100 dark:border-blue-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Online Presence</h3>
            </div>
            
            <div className="grid gap-6">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <FormField
                    control={control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Globe className="h-4 w-4 text-blue-500" />
                          Website URL
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              <Globe className="h-4 w-4" />
                            </div>
                            <Input 
                              placeholder="https://yourstartup.com" 
                              {...field} 
                              className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-10"
                            />
                            {website && (
                              <a 
                                href={website.startsWith('http') ? website : `https://${website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                              >
                                <Link className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your startup's official website.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <FormField
                    control={control}
                    name="linkedinProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Linkedin className="h-4 w-4 text-blue-500" />
                          LinkedIn Profile
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              <Linkedin className="h-4 w-4" />
                            </div>
                            <Input 
                              placeholder="https://linkedin.com/company/yourstartup" 
                              {...field} 
                              className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-10"
                            />
                            {linkedinProfile && (
                              <a 
                                href={linkedinProfile.startsWith('http') ? linkedinProfile : `https://${linkedinProfile}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                              >
                                <Link className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your company's LinkedIn page.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FormField
                    control={control}
                    name="twitterProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Twitter className="h-4 w-4 text-blue-500" />
                          Twitter Profile
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              <Twitter className="h-4 w-4" />
                            </div>
                            <Input 
                              placeholder="https://twitter.com/yourstartup" 
                              {...field} 
                              className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-10"
                            />
                            {twitterProfile && (
                              <a 
                                href={twitterProfile.startsWith('http') ? twitterProfile : `https://${twitterProfile}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                              >
                                <Link className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your company's Twitter/X handle.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="mt-5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your online presence provides investors with additional context about your startup's activities and public image.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DocumentsForm; 