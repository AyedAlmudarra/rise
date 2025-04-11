import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '../../../types/startupRegistration';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { Textarea } from '../../../components/shadcn-ui/Default-Ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/shadcn-ui/Default-Ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/shadcn-ui/Default-Ui/tooltip";
import { HelpCircle, Users, Search, TrendingUp, Briefcase, LineChart, ChevronRight, ArrowUpRight, Building, Target, BarChart3, Sparkles, Activity, PieChart, ShieldCheck, Zap, Lightbulb, AlignCenterHorizontal, AlertCircle, Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from "../../../components/shadcn-ui/Default-Ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/shadcn-ui/Default-Ui/tabs";
import { Badge } from "../../../components/shadcn-ui/Default-Ui/badge";
import { Button } from "../../../components/shadcn-ui/Default-Ui/button";
import { Alert, AlertDescription } from "../../../components/shadcn-ui/Default-Ui/alert";
import { supabase } from "../../../lib/supabaseClient";

type MarketAnalysisFormProps = {
  isRegistrationFlow?: boolean;
};

// Help tooltip component
const InfoTooltip: React.FC<{ content: string }> = ({ content }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-indigo-500 cursor-help ml-1.5 transition-colors duration-200" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs bg-white/95 dark:bg-gray-800/95 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md backdrop-blur-sm" align="start">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Industry growth levels
const industryGrowthLevels = [
  { value: "declining", label: "Declining (negative growth)" },
  { value: "stable", label: "Stable (0-2% growth)" },
  { value: "growing", label: "Growing (3-10% growth)" },
  { value: "rapid", label: "Rapid (10-20% growth)" },
  { value: "exponential", label: "Exponential (>20% growth)" },
];

// Enhanced CompetitorCard with animations and interactive elements
const CompetitorCard: React.FC<{
  number: number;
  title: string;
}> = ({ number, title }) => {
  const { control, watch } = useFormContext<StartupRegistrationData>();
  
  const threatLevel = watch(`competitor${number}Threat` as any);
  
  const getThreatColor = () => {
    switch (threatLevel) {
      case 'high': return 'bg-red-500 dark:bg-red-600';
      case 'medium': return 'bg-amber-500 dark:bg-amber-600';
      case 'low': return 'bg-green-500 dark:bg-green-600';
      default: return 'bg-gray-300 dark:bg-gray-600';
    }
  };
  
  return (
    <div className="relative">
      <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 overflow-hidden rounded-xl">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold flex items-center text-gray-800 dark:text-gray-200">
              <Building className="h-4 w-4 mr-2 text-blue-500" />
              {title}
            </h3>
            <div className="flex items-center gap-2">
              {threatLevel && (
                <div className={`w-2 h-2 rounded-full ${getThreatColor()}`}></div>
              )}
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-semibold shadow-sm">
                {number}
              </div>
            </div>
          </div>
          
          <div className="space-y-5">
            <FormField
              control={control}
              name={`competitor${number}Name` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 dark:text-gray-400">Company Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Building className="h-4 w-4" />
                      </div>
                      <Input 
                        placeholder="Competitor name" 
                        {...field} 
                        className="border-gray-300 bg-white/90 dark:bg-gray-900/90 focus:ring-blue-500 focus:border-blue-500 pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4 overflow-hidden">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`competitor${number}Size` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600 dark:text-gray-400">Company Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 bg-white/90 dark:bg-gray-900/90 focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-gray-900">
                          <SelectItem value="startup">Startup</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name={`competitor${number}Threat` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-600 dark:text-gray-400">Threat Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 bg-white/90 dark:bg-gray-900/90 focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-gray-900">
                          <SelectItem value="low">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                              Low
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                              Medium
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                              High
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={control}
                name={`competitor${number}Differentiator` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        Your Competitive Advantage
                        <InfoTooltip content="How does your solution differ from this competitor?" />
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <Textarea 
                          placeholder="What makes your solution better?" 
                          className="resize-none min-h-[80px] border-gray-300 bg-white/90 dark:bg-gray-900/90 focus:ring-blue-500 focus:border-blue-500 pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MarketAnalysisForm: React.FC<MarketAnalysisFormProps> = ({ isRegistrationFlow = false }) => {
  const { control, formState: { errors }, getValues, watch } = useFormContext<StartupRegistrationData>();
  const [activeTab, setActiveTab] = React.useState("market-overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Function to save market analysis data to Supabase
  const saveMarketAnalysis = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (isRegistrationFlow || window.location.pathname.includes('register')) {
        console.log("In registration flow, skipping Supabase calls for Market Analysis");
        setSuccessMessage("Market analysis noted (will be saved with registration)");
        setLoading(false);
        return;
      }
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        setError("Authentication error. Your session may have expired. Please refresh the page and try again.");
        setLoading(false);
        return;
      }
      
      if (!user) {
        setError("You must be logged in to save market analysis. Please refresh the page and try again.");
        setLoading(false);
        return;
      }
      
      const values = getValues();
      
      const { data: existingStartup, error: fetchError } = await supabase
        .from('startups')
        .select('id, competitor_data')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (fetchError) {
        console.error('Error fetching startup data:', fetchError);
        setError("Failed to retrieve your startup data. Please try again.");
        setLoading(false);
        return;
      }
        
      if (!existingStartup && !isRegistrationFlow) {
        console.error('Attempted to save market analysis for non-existent startup profile (user_id:', user.id, ')');
        setError("Could not find your startup profile. Please ensure you have completed the initial registration or contact support if the issue persists.");
        setLoading(false);
        return;
      }
      
      if (!existingStartup && isRegistrationFlow) {
          console.log("In registration flow, skipping Supabase update for Market Analysis - will be saved on final submission.");
          setSuccessMessage("Market analysis details captured. They will be saved when you complete registration.");
          setLoading(false);
          return;
      }

      if (!existingStartup) {
          console.error('Logic error: existingStartup is null despite checks.');
          setError("An unexpected error occurred while trying to save. Please try again.");
          setLoading(false);
          return;
      }
      
      const competitorData = {
        competitor1: values.competitor1Name ? {
          name: values.competitor1Name,
          size: values.competitor1Size,
          threat: values.competitor1Threat,
          differentiator: values.competitor1Differentiator
        } : null,
        competitor2: values.competitor2Name ? {
          name: values.competitor2Name,
          size: values.competitor2Size,
          threat: values.competitor2Threat,
          differentiator: values.competitor2Differentiator
        } : null,
        competitor3: values.competitor3Name ? {
          name: values.competitor3Name,
          size: values.competitor3Size,
          threat: values.competitor3Threat,
          differentiator: values.competitor3Differentiator
        } : null,
      };
      
      const { error: updateError } = await supabase
        .from('startups')
        .update({
          market_growth_rate: values.marketGrowthRate || null,
          market_key_trends: values.marketKeyTrends || null,
          target_customer_profile: values.targetCustomerProfile || null,
          customer_pain_points: values.customerPainPoints || null,
          market_barriers: values.marketBarriers || null,
          competitive_advantage: values.competitiveAdvantage || null,
          competitor_data: competitorData
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error updating startup data:', updateError);
        setError("Failed to save market analysis: " + updateError.message);
        setLoading(false);
        return;
      }
      
      setSuccessMessage("Market analysis saved successfully!");
      
    } catch (err: any) {
      console.error('Error saving market analysis:', err);
      setError(err.message || 'Failed to save market analysis. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Market Analysis</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Provide details about your market and competitive landscape to help investors understand your position.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="animate-in fade-in-50 duration-300">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert className="bg-gradient-to-r from-blue-50/90 to-cyan-50/90 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 backdrop-blur-sm shadow-md animate-in fade-in-50 duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-blue-800/50 dark:to-cyan-700/50 p-2 rounded-full">
              <Save className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Success!</h4>
              <AlertDescription className="text-blue-700 dark:text-blue-400">{successMessage}</AlertDescription>
            </div>
          </div>
        </Alert>
      )}
      
      <div className="space-y-8">
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-blue-100 dark:border-blue-900/30 p-6 shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700">
              <TabsTrigger 
                value="market-overview" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-md transition-all duration-300 font-medium"
              >
                <LineChart className="h-4 w-4 mr-2" />
                <span>Market Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="competitor-analysis" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-md transition-all duration-300 font-medium"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                <span>Competitor Analysis</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="min-h-[450px] mt-6">
              <TabsContent value="market-overview" className="mt-0 outline-none">
                <div className="space-y-6">
                  <div>
                    <div className="relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-blue-200 dark:border-blue-800 shadow-sm">
                      <div className="flex items-start">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-white shadow-md mr-4 flex-shrink-0">
                          <Target className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-1">Why Market Analysis Matters</h3>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            A thorough understanding of your market helps investors gauge the potential of your 
                            business and how well-positioned you are for success. Strong market analysis demonstrates your expertise and vision.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-blue-100 dark:border-blue-900/30 overflow-hidden rounded-xl">
                        <CardContent className="p-5">
                          <div className="flex items-center mb-4">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full text-white shadow-sm mr-3">
                              <TrendingUp className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">Market Growth & Trends</h3>
                          </div>
                          
                          <div className="space-y-5">
                            <FormField
                              control={control}
                              name="marketGrowthRate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center text-gray-700 dark:text-gray-300">
                                    Industry Growth Rate
                                    <InfoTooltip content="How quickly is your overall industry or market growing?" />
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/90 dark:bg-gray-900/90">
                                        <SelectValue placeholder="Select growth rate" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white dark:bg-gray-900">
                                      {industryGrowthLevels.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={control}
                              name="marketKeyTrends"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center text-gray-700 dark:text-gray-300">
                                    Key Market Trends
                                    <InfoTooltip content="What are the major trends shaping your industry?" />
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute left-3 top-3 text-gray-400">
                                        <Activity className="h-4 w-4" />
                                      </div>
                                      <Textarea 
                                        placeholder="Describe key trends in your market..." 
                                        className="resize-none min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/90 dark:bg-gray-900/90 pl-10"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    Identify significant trends that show opportunity in your market
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="relative">
                      <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-cyan-100 dark:border-cyan-900/30 overflow-hidden rounded-xl">
                        <CardContent className="p-5">
                          <div className="flex items-center mb-4">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full text-white shadow-sm mr-3">
                              <Users className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">Customer Analysis</h3>
                          </div>
                          
                          <div className="space-y-5">
                            <FormField
                              control={control}
                              name="targetCustomerProfile"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center text-gray-700 dark:text-gray-300">
                                    Target Customer Profile
                                    <InfoTooltip content="Who are your ideal customers and why?" />
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute left-3 top-3 text-gray-400">
                                        <Target className="h-4 w-4" />
                                      </div>
                                      <Textarea 
                                        placeholder="Describe your target customers..." 
                                        className="resize-none min-h-[100px] border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 bg-white/90 dark:bg-gray-900/90 pl-10"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={control}
                              name="customerPainPoints"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center text-gray-700 dark:text-gray-300">
                                    Customer Pain Points
                                    <InfoTooltip content="What problems does your solution solve for customers?" />
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute left-3 top-3 text-gray-400">
                                        <Zap className="h-4 w-4" />
                                      </div>
                                      <Textarea 
                                        placeholder="Describe the pain points you address..." 
                                        className="resize-none min-h-[100px] border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 bg-white/90 dark:bg-gray-900/90 pl-10"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative">
                      <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/30 overflow-hidden rounded-xl">
                        <CardContent className="p-5">
                          <div className="flex items-center mb-4">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full text-white shadow-sm mr-3">
                              <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">Market Positioning</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={control}
                              name="marketBarriers"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center text-gray-700 dark:text-gray-300">
                                    Barriers to Entry
                                    <InfoTooltip content="What prevents new competitors from entering your market?" />
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute left-3 top-3 text-gray-400">
                                        <ShieldCheck className="h-4 w-4" />
                                      </div>
                                      <Textarea 
                                        placeholder="Describe barriers to market entry..." 
                                        className="resize-none min-h-[100px] border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white/90 dark:bg-gray-900/90 pl-10"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={control}
                              name="competitiveAdvantage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center text-gray-700 dark:text-gray-300">
                                    Competitive Advantages
                                    <InfoTooltip content="What unique advantages do you have over competitors?" />
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute left-3 top-3 text-gray-400">
                                        <Lightbulb className="h-4 w-4" />
                                      </div>
                                      <Textarea 
                                        placeholder="Describe your key advantages..." 
                                        className="resize-none min-h-[100px] border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white/90 dark:bg-gray-900/90 pl-10"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="competitor-analysis" className="mt-0 outline-none">
                <div className="space-y-6">
                  <div>
                    <div className="relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                      <div className="flex items-start">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full text-white shadow-md mr-4 flex-shrink-0">
                          <AlignCenterHorizontal className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-indigo-800 dark:text-indigo-300 font-medium mb-1">Competitive Landscape</h3>
                          <p className="text-sm text-indigo-700 dark:text-indigo-400">
                            Understanding your competitors helps investors assess your market position and differentiation strategy. 
                            Add up to 3 key competitors below.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <CompetitorCard number={1} title="Primary Competitor" />
                    <CompetitorCard number={2} title="Secondary Competitor" />
                    <CompetitorCard number={3} title="Other Competitor" />
                  </div>
                  
                  <div className="flex items-start p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50 shadow-sm mt-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mr-3 flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400">Pro Tip</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                        Focus on your unique differentiation factors rather than just listing competitors. Investors want to understand how you stand out and maintain a competitive edge.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
            
            {/* Save Button (Only show if NOT in registration flow) */}
            {!isRegistrationFlow && (
              <div className="mt-8 flex justify-end">
                <Button
                  onClick={saveMarketAnalysis}
                  disabled={loading} // Button is only enabled when !isRegistrationFlow
                  className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md px-5 py-2.5 rounded-md font-medium text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative flex items-center">
                    {loading ? (
                      <>
                        {/* Removed pulse effect for simplicity */}
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Saving Analysis...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                         {/* Text is simplified as it only shows when not in registration */}
                        <span>Save Market Analysis</span>
                      </>
                    )}
                  </div>
                </Button>
              </div>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysisForm; 