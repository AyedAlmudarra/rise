import React, { useState, useRef } from 'react';
import { Input } from '@/components/shadcn-ui/Default-Ui/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '@/types/startupRegistration';
import { Button } from '@/components/shadcn-ui/Default-Ui/button';
import { FileUp, Trash2, Link, Linkedin, Twitter, Upload, Check, AlertTriangle, FileType, Info, Image, Globe, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn-ui/Default-Ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn-ui/Default-Ui/alert";
import { Card } from "@/components/shadcn-ui/Default-Ui/card";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

// File type definitions
const ALLOWED_LOGO_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
const ALLOWED_PITCH_TYPES = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PITCH_SIZE = 10 * 1024 * 1024; // 10MB

const DocumentsForm: React.FC = () => {
  const { control, setValue, watch, setError, clearErrors } = useFormContext<StartupRegistrationData>();
  const { user } = useAuth();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const pitchDeckInputRef = useRef<HTMLInputElement>(null);
  
  const [logoUploading, setLogoUploading] = useState(false);
  const [pitchUploading, setPitchUploading] = useState(false);

  const logoUrl = watch('logo_url');
  const pitchDeckUrl = watch('pitch_deck_url');
  const website = watch('website');
  const linkedinProfile = watch('linkedinProfile');
  const twitterProfile = watch('twitterProfile');
  
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>, 
    fileType: 'logo' | 'pitch',
    allowedTypes: string[],
    maxSize: number,
    setUploading: React.Dispatch<React.SetStateAction<boolean>>,
    urlFieldName: keyof StartupRegistrationData,
    errorFieldName: keyof StartupRegistrationData
  ) => {
    if (!user) {
      setError(errorFieldName, { type: 'manual', message: 'User not authenticated.' });
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;
    
    clearErrors(errorFieldName);
    
    if (!allowedTypes.includes(file.type)) {
      setError(errorFieldName, { type: 'manual', message: `Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}` });
      return;
    }
    
    if (file.size > maxSize) {
       setError(errorFieldName, { type: 'manual', message: `File too large. Max size: ${maxSize / (1024 * 1024)}MB` });
      return;
    }
    
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `public/${user.id}/${fileType}-${Date.now()}.${fileExt}`; 

    try {
      const { error: uploadError } = await supabase.storage
        .from('startup')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage.from('startup').getPublicUrl(filePath);
      
      if (!urlData || !urlData.publicUrl) {
          throw new Error("Could not get public URL for uploaded file.");
      }

      setValue(urlFieldName, urlData.publicUrl, { shouldValidate: true, shouldDirty: true }); 
      clearErrors(errorFieldName);

    } catch (error: any) {
      console.error(`Error uploading ${fileType}:`, error);
      setError(errorFieldName, { type: 'manual', message: error.message || `Failed to upload ${fileType}. Please try again.` });
      setValue(urlFieldName, null); 
    } finally {
      setUploading(false);
      if (event.target) {
         event.target.value = '';
      }
    }
  };

  const handleFileRemove = async (
      urlFieldName: keyof StartupRegistrationData,
      url: string | null | undefined,
      setUploading: React.Dispatch<React.SetStateAction<boolean>>,
      inputRef: React.RefObject<HTMLInputElement>,
      errorFieldName: keyof StartupRegistrationData
  ) => {
      if (!url) return;

      try {
          const urlObject = new URL(url);
          const pathSegments = urlObject.pathname.split('/');
          const bucketNameIndex = pathSegments.indexOf('startup'); 
          if (bucketNameIndex === -1 || bucketNameIndex + 1 >= pathSegments.length) {
              throw new Error("Could not extract file path from URL.");
          }
          const filePath = pathSegments.slice(bucketNameIndex + 1).join('/');

          setUploading(true);
          clearErrors(errorFieldName);

          const { error: removeError } = await supabase.storage
              .from('startup')
              .remove([filePath]);

          if (removeError) {
              throw removeError;
          }

          setValue(urlFieldName, null, { shouldValidate: true, shouldDirty: true });
          if (inputRef.current) {
              inputRef.current.value = '';
          }

      } catch (error: any) {
          console.error(`Error removing file ${url}:`, error);
          setError(errorFieldName, { type: 'manual', message: error.message || "Failed to remove file." });
      } finally {
          setUploading(false);
      }
  };
  
  const getFilenameFromUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    try {
      const decodedUrl = decodeURIComponent(url);
      return decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1);
    } catch (e) {
      return url.substring(url.lastIndexOf('/') + 1); 
    }
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
      
      <div className="space-y-8">
        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-amber-100 dark:border-amber-900/30 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mr-3">
              <FileUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Documents</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <FormField
                control={control}
                name="logo_url"
                render={({ fieldState }) => (
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
                        onChange={(e) => handleFileUpload(e, 'logo', ALLOWED_LOGO_TYPES, MAX_LOGO_SIZE, setLogoUploading, 'logo_url', 'logo_url')}
                        ref={logoInputRef}
                        disabled={logoUploading}
                      />
                      
                      {!logoUrl && !logoUploading ? (
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
                        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-6 bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center space-x-3">
                           <Loader2 className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-spin" />
                           <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Uploading...</span>
                        </div>
                      ) : logoUrl ? (
                        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img src={logoUrl} alt="Logo Preview" className="h-10 w-10 rounded object-cover bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800" />
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                                  {getFilenameFromUrl(logoUrl)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Check className="h-5 w-5 text-green-500 mr-2" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFileRemove('logo_url', logoUrl, setLogoUploading, logoInputRef, 'logo_url')}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      
                      {fieldState.error && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{fieldState.error.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormField
                control={control}
                name="pitch_deck_url"
                render={({ fieldState }) => (
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
                        onChange={(e) => handleFileUpload(e, 'pitch', ALLOWED_PITCH_TYPES, MAX_PITCH_SIZE, setPitchUploading, 'pitch_deck_url', 'pitch_deck_url')}
                        ref={pitchDeckInputRef}
                        disabled={pitchUploading}
                      />
                      
                      {!pitchDeckUrl && !pitchUploading ? (
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
                         <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-6 bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center space-x-3">
                           <Loader2 className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-spin" />
                           <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Uploading...</span>
                        </div>
                      ) : pitchDeckUrl ? (
                        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white dark:bg-gray-800 rounded border border-amber-200 dark:border-amber-800">
                                <FileType className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                                   {getFilenameFromUrl(pitchDeckUrl)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Check className="h-5 w-5 text-green-500 mr-2" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFileRemove('pitch_deck_url', pitchDeckUrl, setPitchUploading, pitchDeckInputRef, 'pitch_deck_url')}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                       ) : null}
                      
                      {fieldState.error && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{fieldState.error.message}</AlertDescription>
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
        </Card>
        
        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Online Presence</h3>
          </div>
          
          <div className="grid gap-6">
            <div>
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
            </div>
            
            <div>
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
            </div>
            
            <div>
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
            </div>
          </div>
          
          <div className="mt-5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your online presence provides investors with additional context about your startup's activities and public image.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocumentsForm; 