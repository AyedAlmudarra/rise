import React, { useState } from 'react';
import { StartupProfile } from 'src/types/database';
import CardBox from 'src/components/shared/CardBox';
import { Alert, Badge, Button, Progress, Tooltip, Avatar } from 'flowbite-react';
import { 
  IconUsers, 
  IconMapPin, 
  IconCategory, 
  IconChartBar, 
  IconBuildingStore, 
  IconCoin, 
  IconBrandLinkedin, 
  IconBrandTwitter, 
  IconWorld, 
  IconInfoCircle, 
  IconMail, 
  IconPhone,
  IconEdit,
  IconShare,
  IconDownload
} from "@tabler/icons-react";

interface CompanyOverviewCardProps {
  startupData: StartupProfile | null;
  loading: boolean;
  error: string | null;
}

const CompanyOverviewCard: React.FC<CompanyOverviewCardProps> = ({ startupData, loading, error }) => {
    const [showMore, setShowMore] = useState(false);
    
    // If loading or error occurred, don't render anything (handled by main dashboard loading indicator)
    if (loading || error) {
        return null;
    }

    // If not loading, no error, but no data -> show prompt to complete profile
    if (!startupData) {
      return (
         <CardBox className="lg:col-span-1 h-full overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 -mx-6 -mt-6"></div>
            <div className="relative z-10 mt-8">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                  Company Overview
              </h5>
              <Alert color="info" className="mb-4">
                <div className="flex flex-col">
                  <span className="font-medium mb-1">No company profile data found</span>
                  <span className="text-sm">Please complete your profile to unlock all dashboard features</span>
                  <Button color="info" className="mt-3">
                    <IconEdit size={16} className="mr-2" />
                    Complete Profile
                  </Button>
                </div>
              </Alert>
              
              <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <h6 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Why complete your profile?</h6>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Improve your funding readiness score</li>
                  <li>Get better AI insights for your business</li>
                  <li>Increase visibility to potential investors</li>
                  <li>Access personalized recommendations</li>
                </ul>
              </div>
            </div>
         </CardBox>
      );
    }

    // Get company logo or default placeholder
    const logoUrl = startupData.logo_url || 'https://via.placeholder.com/60?text=Logo';
    
    // Calculate profile completeness (example logic)
    const profileFields = ['name', 'industry', 'operational_stage', 'location_city', 'description', 'logo_url', 'sector', 'num_employees', 'annual_revenue'];
    const filledFields = profileFields.filter(field => Boolean(startupData[field as keyof StartupProfile])).length;
    const completionPercentage = Math.round((filledFields / profileFields.length) * 100);
    
    // Determine completion status color
    let completionColor = 'failure';
    if (completionPercentage >= 80) completionColor = 'success';
    else if (completionPercentage >= 50) completionColor = 'warning';

    // Format the description for truncation
    const description = startupData.description || 'No description provided.';
    
    // If startupData exists, render the card with details
    return (
      <CardBox className="lg:col-span-1 h-full overflow-hidden relative">
        {/* Header banner with gradient */}
        <div className="absolute top-0 right-0 left-0 h-28 bg-gradient-to-r from-blue-600 to-indigo-700 -mx-6 -mt-6"></div>
        
        {/* Company logo and quick actions */}
        <div className="flex justify-between items-start relative z-10 mb-4">
          <div className="flex flex-col items-center">
            <Avatar
              img={logoUrl}
              alt={`${startupData.name || 'Company'} logo`}
              size="lg" 
              rounded
              bordered
              className="ring-4 ring-white dark:ring-gray-800 shadow-lg"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="xs" color="light" pill>
              <IconShare size={16} />
            </Button>
            <Button size="xs" color="light" pill>
              <IconDownload size={16} />
            </Button>
            <Button size="xs" gradientDuoTone="purpleToBlue">
              <IconEdit size={14} className="mr-1" />
              Edit
            </Button>
          </div>
        </div>
        
        {/* Company Name */}
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-1 mt-4">
          {startupData.name || 'Unnamed Company'}
        </h5>
        
        {/* Tagline - Using industry since tagline doesn't exist in the type */}
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
          {startupData.industry ? `${startupData.industry} company` : 'Technology startup'}
        </p>
        
        {/* Profile completion card */}
        <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300">Profile Completion</p>
            <Badge color={completionColor as "success" | "warning" | "failure"} size="sm">{completionPercentage}%</Badge>
          </div>
          <Progress
            progress={completionPercentage}
            size="sm"
            color={completionColor as "success" | "warning" | "failure"}
          />
          {completionPercentage < 100 && (
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Complete your profile to improve your funding readiness score.
            </p>
          )}
        </div>
        
        <div className="font-normal space-y-4">
          {/* Description with show more/less toggle */}
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {showMore ? description : description.length > 150 ? `${description.substring(0, 150)}...` : description}
            </p>
            {description.length > 150 && (
              <button 
                onClick={() => setShowMore(!showMore)} 
                className="text-blue-600 dark:text-blue-400 text-xs font-medium mt-1 hover:underline"
              >
                {showMore ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
          
          {/* Company details with icons in a grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <IconCategory size={18} className="mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium">Industry:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{startupData.industry || 'N/A'}</span>
            </div>
            
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <IconChartBar size={18} className="mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium">Stage:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{startupData.operational_stage || 'N/A'}</span>
            </div>
            
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <IconMapPin size={18} className="mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium">Location:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{startupData.location_city || 'N/A'}</span>
            </div>
            
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <IconBuildingStore size={18} className="mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium">Sector:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{startupData.sector || 'N/A'}</span>
            </div>
            
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <IconUsers size={18} className="mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium">Team size:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{startupData.num_employees || 'N/A'}</span>
            </div>
            
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <IconCoin size={18} className="mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium">Revenue:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {startupData.annual_revenue ? `$${startupData.annual_revenue.toLocaleString()}` : 'N/A'}
              </span>
              <Tooltip content="Annual revenue from the most recent fiscal year">
                <IconInfoCircle size={14} className="ml-1 text-gray-400" />
              </Tooltip>
            </div>
          </div>
          
          {/* Contact information and social links */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button size="sm" color="light" className="w-full">
              <IconMail size={16} className="mr-1.5" />
              Contact
            </Button>
            <Button size="sm" color="light" className="w-full">
              <IconWorld size={16} className="mr-1.5" />
              Website
            </Button>
          </div>
          
          {/* Social media links */}
          <div className="flex justify-center gap-3 pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
            <button className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <IconBrandLinkedin size={20} />
            </button>
            <button className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <IconBrandTwitter size={20} />
            </button>
          </div>
        </div>
      </CardBox>
    );
  };

export default CompanyOverviewCard; 