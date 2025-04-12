import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '../../../types/startupRegistration';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { Textarea } from '../../../components/shadcn-ui/Default-Ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/shadcn-ui/Default-Ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/shadcn-ui/Default-Ui/tooltip";
import { Users, TrendingUp, Briefcase, LineChart, Building, Target, Sparkles, Activity, ShieldCheck, Zap, Lightbulb, Info, PlusCircle } from 'lucide-react';
import { Card } from "../../../components/shadcn-ui/Default-Ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/shadcn-ui/Default-Ui/tabs";
import { Badge } from "../../../components/shadcn-ui/Default-Ui/badge";
import { Button } from "../../../components/shadcn-ui/Default-Ui/button";

type MarketAnalysisFormProps = {
  isRegistrationFlow?: boolean;
};

// Help tooltip component
const InfoTooltip: React.FC<{ content: string }> = ({ content }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500 cursor-help ml-1.5 transition-colors duration-200" />
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

// Refactored CompetitorCard Props (Keep interface for clarity)
interface CompetitorCardProps {
  number: number;
  title: string;
}

// CompetitorCard now renders only the fields, not the wrapping Card
const CompetitorFields: React.FC<CompetitorCardProps> = ({ number, title }) => {
  const { control, watch } = useFormContext<StartupRegistrationData>();
  const threatLevel = watch(`competitor${number}Threat` as keyof StartupRegistrationData);

  const getThreatBadgeVariant = (): "destructive" | "warning" | "success" | "outline" => {
    switch (threatLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-5 p-5">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-base font-semibold flex items-center text-gray-800 dark:text-gray-200">
          <Building className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
          {title} #{number}
        </h3>
        {threatLevel && (
          <Badge variant={getThreatBadgeVariant()} className="capitalize text-xs h-6">{String(threatLevel)} Threat</Badge>
        )}
      </div>

      <div className="space-y-5">
        <FormField
          control={control}
          name={`competitor${number}Name` as keyof StartupRegistrationData}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <Building className="h-4 w-4 mr-2 text-blue-500" /> Competitor Name
              </FormLabel>
              <FormControl>
                  <Input
                    placeholder="Enter competitor name"
                    {...field}
                    value={String(field.value ?? '')}
                    className="w-full border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950 pl-4"
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`competitor${number}Size` as keyof StartupRegistrationData}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm text-gray-700 dark:text-gray-300">Company Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value ?? '')}>
                  <FormControl>
                    <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-gray-950">
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
            name={`competitor${number}Threat` as keyof StartupRegistrationData}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm text-gray-700 dark:text-gray-300">Threat Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={String(field.value ?? '')}>
                  <FormControl>
                    <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-gray-950">
                    <SelectItem value="low">
                      <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>Low</span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>Medium</span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>High</span>
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
          name={`competitor${number}Differentiator` as keyof StartupRegistrationData}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                Your Advantage vs Competitor
                <InfoTooltip content="How does your solution specifically differ from or outperform this competitor?" />
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your unique selling points against them..."
                  className="resize-none min-h-[90px] border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950 pl-4"
                  {...field}
                  value={String(field.value ?? '')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

const MarketAnalysisForm: React.FC<MarketAnalysisFormProps> = ({ isRegistrationFlow = true }) => {
  const { control, formState: { errors }, getValues, watch } = useFormContext<StartupRegistrationData>();
  // Add state for managing visible competitor forms
  const [visibleCompetitors, setVisibleCompetitors] = useState(1); 
  // Add state for active tab
  const [activeCompetitorTab, setActiveCompetitorTab] = useState<string>('comp1');

  // Function to handle adding a competitor and switching tab
  const handleAddCompetitor = () => {
    const nextVisibleCount = Math.min(visibleCompetitors + 1, 3);
    setVisibleCompetitors(nextVisibleCount);
    // Switch active tab to the newly added one
    setActiveCompetitorTab(`comp${nextVisibleCount}`);
  };

  return (
    <div className="space-y-8">
       {/* Header - Simplified from motion.div */}
       <div className="mb-6">
         <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Market Analysis</h2>
         <p className="text-gray-600 dark:text-gray-300 mt-2">
           Detail your market, target customers, and competitive landscape.
         </p>
       </div>

      {/* Container - Simplified from motion.div */}
      <div className="space-y-8">
        {/* SECTION 1: Market Overview */}
        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6 shadow-sm">
            {/* Section Header */}
            <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                    <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Market Overview</h3>
            </div>
            
            {/* Main content area for Market Overview */}
            <div className="space-y-6">
                {/* Combined 2x2 Grid for Growth & Customer Analysis Fields - CHANGED TO SINGLE COLUMN */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-5"> 
                    {/* Growth Rate Field */}
                    <FormField
                      control={control}
                      name="marketGrowthRate"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                            Industry Growth Rate
                            <InfoTooltip content="How quickly is your overall industry or market growing?" />
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950">
                                <SelectValue placeholder="Select growth rate" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-gray-950">
                              {industryGrowthLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Target Customer Field */} 
                    <FormField
                      control={control}
                      name="targetCustomerProfile"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <Target className="h-4 w-4 mr-2 text-cyan-500" />
                            Target Customer Profile
                            <InfoTooltip content="Describe your ideal customers (demographics, behaviors, needs). Be specific." />
                          </FormLabel>
                          <FormControl>
                              <Textarea
                                placeholder="Describe target customers..."
                                className="resize-none min-h-[100px] border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950 pl-4"
                                {...field}
                              />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Key Trends Field */} 
                    <FormField
                      control={control}
                      name="marketKeyTrends"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <Activity className="h-4 w-4 mr-2 text-blue-500" />
                            Key Market Trends
                            <InfoTooltip content="What are the major trends shaping your industry (e.g., technological shifts, regulatory changes, consumer behavior)?" />
                          </FormLabel>
                          <FormControl>
                              <Textarea
                                placeholder="Describe key trends..."
                                className="resize-none min-h-[100px] border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950 pl-4"
                                {...field}
                              />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Pain Points Field */} 
                    <FormField
                      control={control}
                      name="customerPainPoints"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <Zap className="h-4 w-4 mr-2 text-cyan-500" />
                            Customer Pain Points
                            <InfoTooltip content="What specific problems or unmet needs does your solution address for your target customers?" />
                          </FormLabel>
                          <FormControl>
                              <Textarea
                                placeholder="Describe pain points..."
                                className="resize-none min-h-[100px] border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950 pl-4"
                                {...field}
                              />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                {/* Market Positioning Section */}
                <div> 
                    <div className="flex items-center mb-4 pt-4 border-t border-gray-200 dark:border-gray-700/50"> 
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-3">
                            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Market Positioning</h3>
                    </div>
                    {/* Grid for positioning fields - CHANGED TO SINGLE COLUMN */}
                    <div className="grid grid-cols-1 gap-6"> 
                        {/* Barriers Field */} 
                        <FormField
                          control={control}
                          name="marketBarriers"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" />
                                Barriers to Entry
                                <InfoTooltip content="What factors make it difficult for new competitors to enter your market (e.g., high costs, regulations, technology, brand loyalty)?" />
                              </FormLabel>
                              <FormControl>
                                  <Textarea
                                    placeholder="Describe market barriers..."
                                    className="resize-none min-h-[100px] border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950 pl-4"
                                    {...field}
                                  />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         {/* Advantage Field */} 
                        <FormField
                          control={control}
                          name="competitiveAdvantage"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                <Lightbulb className="h-4 w-4 mr-2 text-emerald-500" />
                                Competitive Advantages
                                <InfoTooltip content="What unique strengths or assets give you an edge over competitors (e.g., unique technology, IP, team, partnerships, cost structure)?" />
                              </FormLabel>
                              <FormControl>
                                  <Textarea
                                    placeholder="Describe your advantages..."
                                    className="resize-none min-h-[100px] border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-950 pl-4"
                                    {...field}
                                  />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                </div>
            </div>
        </Card>

        {/* SECTION 2: Competitor Analysis */}
        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-indigo-100 dark:border-indigo-900/30 p-6 shadow-sm">
             {/* Section Header */}
            <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3">
                    <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Competitor Landscape</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2 mb-4 pl-12">
                Detail up to three key competitors and your advantage against them.
            </p>
            
            {/* Tabs for Competitors */}
            <Tabs value={activeCompetitorTab} onValueChange={setActiveCompetitorTab} className="w-full">
                 <div className="flex items-center space-x-3 mb-5"> {/* Container for TabsList and Button */}
                     <TabsList className="p-1 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 inline-flex items-center justify-start shadow-inner border border-gray-200 dark:border-gray-700">
                         <TabsTrigger
                             value="comp1"
                             className="px-3 py-1.5 text-sm font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200"
                         >
                           Competitor 1
                         </TabsTrigger>
                         {visibleCompetitors >= 2 && (
                           <TabsTrigger
                             value="comp2"
                             className="px-3 py-1.5 text-sm font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200"
                           >
                             Competitor 2
                           </TabsTrigger>
                         )}
                          {visibleCompetitors >= 3 && (
                           <TabsTrigger
                             value="comp3"
                             className="px-3 py-1.5 text-sm font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all duration-200"
                           >
                             Competitor 3
                           </TabsTrigger>
                         )}
                     </TabsList>

                      {/* Add Competitor Button */}
                      {visibleCompetitors < 3 && (
                         <Button
                           type="button"
                           variant="ghost" // Use ghost for a less prominent look next to tabs
                           size="sm"
                           className="text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                           onClick={handleAddCompetitor}
                         >
                           <PlusCircle className="h-4 w-4 mr-1.5" />
                           Add Competitor
                         </Button>
                      )}
                 </div>

                  {/* Tabs Content Area */}
                  <div className="min-h-[350px]"> {/* Optional: Set a min-height */} 
                      <TabsContent value="comp1" className="mt-0 outline-none">
                          <CompetitorFields number={1} title="Primary Competitor" />
                      </TabsContent>
                      
                      {visibleCompetitors >= 2 && (
                         <TabsContent value="comp2" className="mt-0 outline-none">
                             <CompetitorFields number={2} title="Secondary Competitor" />
                         </TabsContent>
                      )}
                      
                      {visibleCompetitors >= 3 && (
                         <TabsContent value="comp3" className="mt-0 outline-none">
                             <CompetitorFields number={3} title="Tertiary Competitor" />
                         </TabsContent>
                      )}
                 </div> {/* End Tabs Content Area */} 

            </Tabs> {/* End Tabs Component */} 

            {/* Info Note (remains below Tabs) */}
            <div> {/* This div seems potentially unnecessary, but keeping for now */} 
                <div className="mt-5 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Analysis Tip</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                          Focus on your unique value proposition against each competitor. What makes customers choose you over them?
                        </p>
                      </div>
                    </div>
                </div>
            </div> {/* End Info Note Wrapper */} 
        </Card>
      </div>
    </div>
  );
};

export default MarketAnalysisForm; 