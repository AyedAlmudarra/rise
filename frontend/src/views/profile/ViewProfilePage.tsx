import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, Avatar, Spinner, Alert, Badge, List, Label } from 'flowbite-react';
import {
    IconUserCircle, IconMail, IconPhone, IconBuildingSkyscraper, IconBriefcase, IconAlertCircle,
    IconBuildingFactory2, IconTargetArrow, IconMapPin, IconUsers, IconReceipt, IconTrendingUp, IconLink, IconBrandLinkedin, IconReportMoney, IconScale,
    IconPresentationAnalytics, IconRepeat, IconRotateClockwise, IconChartArrowsVertical
} from '@tabler/icons-react';
import BreadcrumbComp from '@/layouts/full/shared/breadcrumb/BreadcrumbComp';
import userImg from "@/assets/images/profile/user-1.jpg"; // Default fallback avatar
import { StartupProfile, InvestorProfile } from '@/types/database'; // Adjust path if needed
import { supabase } from '@/lib/supabaseClient';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'My Profile',
  },
];

// Helper function to format numeric data
const formatNumber = (num: number | null | undefined, type: 'currency' | 'percent' | 'integer' = 'integer'): string => {
    if (num === null || num === undefined) return 'N/A';
    if (type === 'currency') return `$${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (type === 'percent') return `${num.toFixed(1)}%`;
    return num.toLocaleString();
};

const ViewProfilePage: React.FC = () => {
  const { user, loading: authLoading, userRole } = useAuth();
  const [roleProfileData, setRoleProfileData] = useState<StartupProfile | InvestorProfile | null>(null);
  const [roleDataLoading, setRoleDataLoading] = useState(true);
  const [roleDataError, setRoleDataError] = useState<string | null>(null);

  // Fetch role-specific data
  const fetchRoleData = useCallback(async () => {
    if (!user || !userRole) {
      setRoleDataLoading(false);
      return; // No user or role
    }

    setRoleDataLoading(true);
    setRoleDataError(null);
    const tableName = userRole === 'startup' ? 'startups' : 'investors';

    try {
      const { data, error, status } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && status !== 406) { // 406 means no row found, which is not necessarily an error here
        throw error;
      }
      
      setRoleProfileData(data);

    } catch (err: any) {
      console.error(`Error fetching ${tableName} data:`, err);
      setRoleDataError(`Failed to load profile details from ${tableName}.`);
      setRoleProfileData(null);
    } finally {
      setRoleDataLoading(false);
    }
  }, [user, userRole]);

  useEffect(() => {
    if (!authLoading && user) {
        fetchRoleData();
    }
     else if (!authLoading && !user) {
        // Handle case where user is null after auth check
        setRoleDataLoading(false); 
    }
  }, [authLoading, user, fetchRoleData]);

  // Combine loading states
  const isLoading = authLoading || roleDataLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!user) {
    return (
        <>
         <BreadcrumbComp title="My Profile" items={BCrumb} />
         <Alert color="failure" icon={IconAlertCircle}>
            User data not available. Please try logging in again.
         </Alert>
       </>
    );
  }
  
   if (roleDataError) {
    return (
        <>
         <BreadcrumbComp title="My Profile" items={BCrumb} />
         <Alert color="warning" icon={IconAlertCircle}>
            {roleDataError} Some profile details might be missing.
         </Alert>
         {/* Optionally render the rest of the profile with available data below */}
       </>
    );
  }

  // Extract metadata and auth data
  const { 
    full_name = 'N/A', 
    company_name: metaCompanyName = 'N/A', // Use alias to avoid clash with table data
    job_title: metaJobTitle = 'N/A',       // Use alias
    profile_bio = 'No bio provided.',
    avatar_url = null,
    profile_visibility = 'public' 
  } = user.user_metadata || {};
  
  const email = user.email || 'N/A';
  const phone = user.phone || 'N/A';

  // Determine display values (prefer table data if available, fallback to metadata)
  const displayCompanyName = userRole === 'startup' ? (roleProfileData as StartupProfile)?.name : (roleProfileData as InvestorProfile)?.company_name;
  const displayJobTitle = (roleProfileData as InvestorProfile)?.job_title; // Investors table has job_title

  // Type assertion for role-specific data (use carefully)
  const startupData = userRole === 'startup' ? roleProfileData as StartupProfile : null;
  const investorData = userRole === 'investor' ? roleProfileData as InvestorProfile : null;

  return (
    <>
      <BreadcrumbComp title="My Profile" items={BCrumb} />
      
      <Card className="w-full shadow-md">
         {/* --- Profile Header --- */} 
        <div className="flex flex-col items-center pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative mb-4">
                <Avatar 
                    img={avatar_url || userImg} 
                    alt={`${full_name} avatar`} 
                    rounded 
                    size="xl" 
                    bordered
                    color="gray"
                 />
                 <Badge 
                    color={profile_visibility === 'public' ? "success" : "warning"}
                    className="absolute top-0 right-0 text-xs"
                 >
                    {profile_visibility === 'public' ? 'Public' : 'Private'}
                 </Badge>
             </div>
          <h5 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
             <IconUserCircle className="mr-2 h-6 w-6"/> {full_name}
          </h5>
          <span className="text-md text-gray-600 dark:text-gray-400 flex items-center mb-1">
             <IconBriefcase className="mr-2 h-5 w-5"/> {displayJobTitle || metaJobTitle} {/** Show investor title or fallback */} 
          </span>
          <span className="text-md text-gray-600 dark:text-gray-400 flex items-center">
             <IconBuildingSkyscraper className="mr-2 h-5 w-5"/> {displayCompanyName || metaCompanyName} {/** Show startup/investor company or fallback */} 
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-6">
            {/* --- Left Column: Contact, Bio, Links --- */} 
            <div className="md:col-span-1 space-y-6">
                {/* Contact Info */}
                 <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h6 className="text-md font-semibold mb-3 text-gray-700 dark:text-white">Contact Information</h6>
                     <div className="space-y-2">
                         <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                            <IconMail className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            <span className="truncate">{email}</span>
                         </div>
                         <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                            <IconPhone className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            <span>{phone}</span>
                         </div>
                    </div>
                 </div>

                 {/* Profile Bio */}
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h6 className="text-md font-semibold mb-2 text-gray-700 dark:text-white">Profile Bio</h6>
                     <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {profile_bio}
                     </p>
                 </div>
                  {/* Professional Links (Investor Only) */} 
                 {userRole === 'investor' && investorData && (
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <h6 className="text-md font-semibold mb-3 text-gray-700 dark:text-white">Professional Links</h6>
                         <div className="space-y-2">
                             <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                                <IconLink className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <a href={investorData.website || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primary truncate">{investorData.website || 'N/A'}</a>
                             </div>
                              <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                                <IconBrandLinkedin className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                 <a href={investorData.linkedin_profile || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-primary truncate">{investorData.linkedin_profile || 'N/A'}</a>
                             </div>
                        </div>
                      </div>
                 )}
            </div>

             {/* --- Right Column(s): Role Specific Details --- */} 
            <div className="md:col-span-2 space-y-6">
                {/* --- Startup Details --- */}
                 {userRole === 'startup' && startupData && (
                     <> 
                         <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <h6 className="text-md font-semibold mb-3 text-gray-700 dark:text-white">Company Details</h6>
                             <List unstyled className="text-sm space-y-2">
                                <List.Item icon={()=><IconBuildingFactory2 className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Industry: <span className="font-medium ml-1">{startupData.industry || 'N/A'}</span></List.Item>
                                <List.Item icon={()=><IconTargetArrow className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Sector: <span className="font-medium ml-1">{startupData.sector || 'N/A'}</span></List.Item>
                                <List.Item icon={()=><IconScale className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Operational Stage: <span className="font-medium ml-1">{startupData.operational_stage || 'N/A'}</span></List.Item>
                                <List.Item icon={()=><IconMapPin className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Location: <span className="font-medium ml-1">{startupData.location_city || 'N/A'}</span></List.Item>
                                <List.Item icon={()=><IconUsers className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Employees: <span className="font-medium ml-1">{formatNumber(startupData.num_employees, 'integer')}</span></List.Item>
                                {startupData.pitch_deck_url && (
                                    <List.Item icon={()=><IconPresentationAnalytics className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Pitch Deck: <a href={startupData.pitch_deck_url} target="_blank" rel="noopener noreferrer" className="font-medium ml-1 text-primary hover:underline">View Deck</a></List.Item>
                                )}
                             </List>
                         </div>
                         <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                             <h6 className="text-md font-semibold mb-3 text-gray-700 dark:text-white">Financials & KPIs</h6>
                              <List unstyled className="text-sm space-y-2">
                                 <List.Item icon={()=><IconReceipt className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Annual Revenue: <span className="font-medium ml-1">{formatNumber(startupData.annual_revenue, 'currency')}</span></List.Item>
                                 <List.Item icon={()=><IconReportMoney className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Annual Expenses: <span className="font-medium ml-1">{formatNumber(startupData.annual_expenses, 'currency')}</span></List.Item>
                                 <List.Item icon={()=><IconChartArrowsVertical className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Customer Acquisition Cost (CAC): <span className="font-medium ml-1">{formatNumber(startupData.kpi_cac, 'currency')}</span></List.Item>
                                 <List.Item icon={()=><IconTrendingUp className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Customer Lifetime Value (CLV): <span className="font-medium ml-1">{formatNumber(startupData.kpi_clv, 'currency')}</span></List.Item>
                                 <List.Item icon={()=><IconRotateClockwise className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Customer Retention Rate: <span className="font-medium ml-1">{formatNumber(startupData.kpi_retention_rate, 'percent')}</span></List.Item>
                                 <List.Item icon={()=><IconRepeat className="h-5 w-5 text-gray-500 dark:text-gray-400"/>}>Conversion Rate: <span className="font-medium ml-1">{formatNumber(startupData.kpi_conversion_rate, 'percent')}</span></List.Item>
                              </List>
                          </div>
                     </>
                 )}

                 {/* --- Investor Details --- */}
                 {userRole === 'investor' && investorData && (
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                         <h6 className="text-md font-semibold mb-3 text-gray-700 dark:text-white">Investment Preferences</h6>
                         <div className="space-y-4">
                             <div>
                                 <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Preferred Industries:</Label>
                                 <div className="flex flex-wrap gap-2">
                                    {(investorData.preferred_industries?.length ?? 0) > 0 ? (
                                        (investorData.preferred_industries || []).map(ind => <Badge key={ind} color="info" size="sm">{ind}</Badge>)
                                    ) : (
                                        <span className="text-sm text-gray-500">N/A</span>
                                    )}
                                 </div>
                             </div>
                              <div>
                                 <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Preferred Geography:</Label>
                                  <div className="flex flex-wrap gap-2">
                                     {(investorData.preferred_geography?.length ?? 0) > 0 ? (
                                        (investorData.preferred_geography || []).map(geo => <Badge key={geo} color="pink" size="sm">{geo}</Badge>)
                                     ) : (
                                        <span className="text-sm text-gray-500">N/A</span>
                                    )}
                                 </div>
                             </div>
                              <div>
                                 <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Preferred Stage:</Label>
                                 <span className="text-sm font-medium text-gray-900 dark:text-white">{investorData.preferred_stage || 'N/A'}</span>
                             </div>
                         </div>
                      </div>
                 )}
                 
                 {/* Show message if role profile data is missing but expected */}
                 {!roleProfileData && !roleDataError && (
                     <Alert color="info" className="mt-4">Additional profile details can be added via Edit Profile.</Alert>
                 )}
            </div>
        </div>
      </Card>
    </>
  );
};

export default ViewProfilePage; 