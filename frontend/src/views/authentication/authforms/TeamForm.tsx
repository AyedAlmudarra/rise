import React from 'react';
import { Input } from '../../../components/shadcn-ui/Default-Ui/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/shadcn-ui/Default-Ui/form";
import { StartupRegistrationData } from '../../../types/startupRegistration';
import { Switch } from "../../../components/shadcn-ui/Default-Ui/switch";
import { Users, UserPlus, LightbulbIcon, AlertTriangle, User, Puzzle, Cpu, BarChart2, BadgePercent, Briefcase, Info, LucideIcon } from 'lucide-react';
import { Badge } from "../../../components/shadcn-ui/Default-Ui/badge";
import { Card, CardContent } from "../../../components/shadcn-ui/Default-Ui/card";

interface TeamRoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const TeamRoleCard: React.FC<TeamRoleCardProps> = ({ title, description, icon, color }) => (
  <div 
    className={`bg-white dark:bg-gray-900 border border-${color}-100 dark:border-${color}-900/30 rounded-lg p-3 shadow-sm`}
  >
    <div className="flex items-start space-x-3">
      <div className={`p-2 bg-${color}-50 dark:bg-${color}-900/20 rounded-full`}>
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-800 dark:text-gray-200">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  </div>
);

const TeamForm: React.FC = () => {
  const { control } = useFormContext<StartupRegistrationData>();

  // Team roles data
  const teamRoles = [
    {
      title: "Technical Leadership (CTO/Engineers)",
      description: "Building and scaling your product",
      icon: <Cpu className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />,
      color: "cyan"
    },
    {
      title: "Business Strategy (CEO)",
      description: "Vision, leadership, and industry expertise",
      icon: <Briefcase className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
      color: "violet"
    },
    {
      title: "Growth & Marketing (CMO)",
      description: "Customer acquisition and branding",
      icon: <BarChart2 className="h-5 w-5 text-green-600 dark:text-green-400" />,
      color: "green"
    },
    {
      title: "Financial Management (CFO)",
      description: "Revenue, funding, and financial planning",
      icon: <BadgePercent className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      color: "amber"
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Team Information</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Investors value strong teams. Tell us about the people behind your startup.
        </p>
      </div>
      
      <div className="space-y-8">
        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-purple-100 dark:border-purple-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Team Size & Structure</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Users className="h-4 w-4 text-purple-500" />
                      Team Size
                      <Badge variant="outline" className="ml-2 text-xs font-normal bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800">Required</Badge>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <User className="h-4 w-4" />
                        </div>
                        <Input 
                          type="number" 
                          placeholder="e.g., 5" 
                          {...field} 
                          value={field.value ?? ''} 
                          className="border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white dark:bg-gray-950 pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Total number of people working on your startup (including founders)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="hasCoFounder"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start justify-between rounded-lg border border-purple-100 dark:border-purple-900/30 p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
                    <div className="space-y-1">
                      <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <UserPlus className="h-4 w-4 text-purple-500" />
                        Co-Founder(s)
                      </FormLabel>
                      <FormDescription>
                        Do you have one or more co-founders?
                      </FormDescription>
                    </div>
                    <div className="flex items-center h-6 mt-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
        </Card>

        <Card className="relative bg-white dark:bg-gray-950 rounded-xl border border-indigo-100 dark:border-indigo-900/30 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3">
                <Puzzle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Team Composition Insights</h3>
            </div>
            
            <div className="space-y-5">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Strong startup teams often have complementary skills and diverse backgrounds. Investors look for balanced teams with the necessary expertise to execute on your vision:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teamRoles.map((role, index) => (
                  <TeamRoleCard
                    key={index}
                    title={role.title}
                    description={role.description}
                    icon={role.icon}
                    color={role.color}
                  />
                ))}
              </div>
              
              <div className="mt-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border border-yellow-200 dark:border-yellow-800/50 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400">Why This Matters</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                      Team composition is consistently ranked as one of the most important factors in investment decisions. Investors often say they "invest in people, not just ideas."
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                <Info className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  In future versions of the platform, you'll be able to add detailed profiles for each team member, including their expertise, experience, and education.
                </p>
              </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default TeamForm; 