import React, { useState, useEffect, useMemo } from 'react';
import {
  Spinner,
  Alert,
  TextInput,
  Label,
  Checkbox,
  Button,
  Dropdown,
  Badge,
} from 'flowbite-react';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineUserGroup, HiLocationMarker, HiBriefcase, HiOutlineBriefcase } from 'react-icons/hi';
import { supabase } from '@/lib/supabaseClient';
import { InvestorProfile } from '@/types/database';
import ProfilePreviewModal from '@/components/profile/ProfilePreviewModal';

// Helper Function to get unique filter options
const getUniqueOptions = (items: (string[] | null)[] | undefined): string[] => {
  if (!items) return [];
  const allValues = items.flat().filter((item): item is string => item !== null);
  return Array.from(new Set(allValues)).sort();
};

// Define Investor Types explicitly for filtering and display
const investorTypes = ['Personal', 'Angel', 'VC'] as const;
type InvestorType = typeof investorTypes[number];

const FindInvestorsPage: React.FC = () => {
  // const { user } = useAuth();
  const [investors, setInvestors] = useState<InvestorProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter States
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedInvestorTypes, setSelectedInvestorTypes] = useState<InvestorType[]>([]);

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedInvestorId, setSelectedInvestorId] = useState<string | null>(null);
  // Role is always investor on this page, but good practice for modal prop
  const [selectedRole, setSelectedRole] = useState<'startup' | 'investor' | null>('investor'); 

  // Unique options for filters, derived from fetched data
  const uniqueIndustries = useMemo(() => getUniqueOptions(investors?.map(inv => inv.preferred_industries)), [investors]);
  const uniqueGeographies = useMemo(() => getUniqueOptions(investors?.map(inv => inv.preferred_geography)), [investors]);
  const uniqueStages = useMemo(() => getUniqueOptions(investors?.map(inv => inv.preferred_stage)), [investors]);

  useEffect(() => {
    const fetchInvestors = async () => {
      setLoading(true);
      setError(null);
      try {
        // Explicitly select needed columns, including investor_type
        const { data, error: fetchError } = await supabase
          .from('investors')
          .select(`
            id,
            user_id,
            full_name,
            job_title,
            company_name,
            investor_type, 
            company_description,
            website,
            linkedin_profile,
            preferred_industries,
            preferred_geography,
            preferred_stage
          `); 

        if (fetchError) {
          throw fetchError;
        }
        // Ensure data matches InvestorProfile structure before setting state
        setInvestors(data as InvestorProfile[] || []); 
      } catch (err: any) {
        console.error('Error fetching investors:', err);
        setError(err.message || 'Failed to fetch investor profiles.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  // Handle filter changes - extended for Investor Type
  const handleFilterChange = (
    filterType: 'industry' | 'geography' | 'stage' | 'investorType',
    value: string
  ) => {
    switch (filterType) {
      case 'industry':
        setSelectedIndustries(prev =>
          prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
        break;
      case 'geography':
        setSelectedGeographies(prev =>
          prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
        break;
      case 'stage':
        setSelectedStages(prev =>
          prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
        break;
      case 'investorType':
        setSelectedInvestorTypes(prev =>
            prev.includes(value as InvestorType) 
            ? prev.filter(item => item !== value)
            : [...prev, value as InvestorType]
        );
        break;
    }
  };

  // Filter investors based on search term and selected filters - including investor type
  const filteredInvestors = useMemo(() => {
    return investors.filter(investor => {
      // Search term check (company name, full name, job title)
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        investor.company_name?.toLowerCase().includes(term) ||
        investor.full_name?.toLowerCase().includes(term) || 
        investor.job_title?.toLowerCase().includes(term);

      // Filter checks
      const matchesIndustry =
        selectedIndustries.length === 0 ||
        investor.preferred_industries?.some(ind => selectedIndustries.includes(ind));
      const matchesGeography =
        selectedGeographies.length === 0 ||
        investor.preferred_geography?.some(geo => selectedGeographies.includes(geo));
      const matchesStage =
        selectedStages.length === 0 ||
        investor.preferred_stage?.some(st => selectedStages.includes(st));
      const matchesInvestorType =
        selectedInvestorTypes.length === 0 ||
        (investor.investor_type && selectedInvestorTypes.includes(investor.investor_type));

      // Return true only if all conditions match
      return matchesSearch && matchesIndustry && matchesGeography && matchesStage && matchesInvestorType;
    });
  }, [investors, searchTerm, selectedIndustries, selectedGeographies, selectedStages, selectedInvestorTypes]);

  // Helper to get Badge color based on type
  const getTypeBadgeColor = (type: InvestorType | null): string => {
    switch (type) {
        case 'VC': return 'purple';
        case 'Angel': return 'success';
        case 'Personal': return 'warning';
        default: return 'gray';
    }
  };

  const handleOpenModal = (userId: string) => {
    setSelectedInvestorId(userId);
    setSelectedRole('investor'); // Explicitly set role
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvestorId(null);
    setSelectedRole(null); // Clear role on close
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="mr-4 p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg">
            <HiOutlineUserGroup size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              Find Investors
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Discover and filter potential investors matching your criteria.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow w-full md:w-auto">
                <Label htmlFor="searchInvestors" value="Search Investors" className="sr-only" />
                <TextInput
                    id="searchInvestors"
                    type="text"
                    icon={HiOutlineSearch}
                    placeholder="Search by name, company, or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex gap-2 flex-wrap justify-start md:justify-end">
                 {/* Investor Type Filter Dropdown */}
                <Dropdown 
                    label="Type" 
                    dismissOnClick={false} 
                    renderTrigger={() => (
                        <Button size="sm" outline color="gray" className="min-w-[100px]">
                            <HiBriefcase className="mr-2 h-4 w-4" />
                            Type{selectedInvestorTypes.length > 0 ? ` (${selectedInvestorTypes.length})` : ''}
                        </Button>
                    )}
                >
                    {investorTypes.map(type => (
                    <Dropdown.Item key={type} className="flex items-center gap-2">
                        <Checkbox
                            id={`type-${type}`}
                            checked={selectedInvestorTypes.includes(type)}
                            onChange={() => handleFilterChange('investorType', type)}
                        />
                        <Label htmlFor={`type-${type}`}>{type}</Label>
                    </Dropdown.Item>
                    ))}
                </Dropdown>

                 {/* Industry Filter Dropdown */}
                <Dropdown 
                    label="Industry" 
                    dismissOnClick={false} 
                    renderTrigger={() => (
                        <Button size="sm" outline color="gray" className="min-w-[100px]">
                            <HiOutlineFilter className="mr-2 h-4 w-4" />
                            Industry{selectedIndustries.length > 0 ? ` (${selectedIndustries.length})` : ''}
                        </Button>
                    )}
                >
                    {uniqueIndustries.map(industry => (
                    <Dropdown.Item key={industry} className="flex items-center gap-2">
                        <Checkbox
                            id={`industry-${industry}`}
                            checked={selectedIndustries.includes(industry)}
                            onChange={() => handleFilterChange('industry', industry)}
                        />
                        <Label htmlFor={`industry-${industry}`}>{industry}</Label>
                    </Dropdown.Item>
                    ))}
                    {uniqueIndustries.length === 0 && <Dropdown.Item disabled>No options</Dropdown.Item>}
                </Dropdown>

                 {/* Geography Filter Dropdown */}
                <Dropdown 
                    label="Geography" 
                    dismissOnClick={false} 
                    renderTrigger={() => (
                        <Button size="sm" outline color="gray" className="min-w-[100px]">
                            <HiLocationMarker className="mr-2 h-4 w-4" />
                            Geography{selectedGeographies.length > 0 ? ` (${selectedGeographies.length})` : ''}
                        </Button>
                    )}
                >
                    {uniqueGeographies.map(geo => (
                    <Dropdown.Item key={geo} className="flex items-center gap-2">
                        <Checkbox
                            id={`geo-${geo}`}
                            checked={selectedGeographies.includes(geo)}
                            onChange={() => handleFilterChange('geography', geo)}
                        />
                        <Label htmlFor={`geo-${geo}`}>{geo}</Label>
                    </Dropdown.Item>
                    ))}
                    {uniqueGeographies.length === 0 && <Dropdown.Item disabled>No options</Dropdown.Item>}
                </Dropdown>

                 {/* Stage Filter Dropdown */}
                <Dropdown 
                    label="Stage" 
                    dismissOnClick={false} 
                    renderTrigger={() => (
                        <Button size="sm" outline color="gray" className="min-w-[100px]">
                            <HiOutlineFilter className="mr-2 h-4 w-4" />
                            Stage{selectedStages.length > 0 ? ` (${selectedStages.length})` : ''}
                        </Button>
                    )}
                >
                    {uniqueStages.map(stage => (
                    <Dropdown.Item key={stage} className="flex items-center gap-2">
                        <Checkbox
                            id={`stage-${stage}`}
                            checked={selectedStages.includes(stage)}
                            onChange={() => handleFilterChange('stage', stage)}
                        />
                        <Label htmlFor={`stage-${stage}`}>{stage}</Label>
                    </Dropdown.Item>
                    ))}
                    {uniqueStages.length === 0 && <Dropdown.Item disabled>No options</Dropdown.Item>}
                </Dropdown>
            </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-10">
          <Spinner size="xl" />
        </div>
      )}

      {error && (
        <Alert color="failure" className="mb-6">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredInvestors.length} of {investors.length} investors.
          </div>
          {filteredInvestors.length > 0 ? (
            <div className="space-y-3">
              {filteredInvestors.map((investor) => (
                <div key={investor.id} className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-shadow duration-200 hover:shadow-md hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                    
                    <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto sm:basis-1/3 lg:basis-1/4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-sm">
                            <span className="text-xl font-bold text-white">
                                {investor.company_name?.[0] || investor.full_name?.[0] || '?'}
                            </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {investor.full_name || 'Investor Name'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {investor.job_title || 'Job Title'}
                          </p>
                        </div>
                    </div>

                    <div className="flex-grow min-w-0 basis-full sm:basis-1/4 lg:basis-1/4 order-3 sm:order-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                           {investor.company_name || '-'}
                        </p>
                        {investor.investor_type && (
                          <Badge color={getTypeBadgeColor(investor.investor_type)} size="xs" className="mt-1 inline-block">
                             {investor.investor_type}
                          </Badge>
                        )}
                    </div>

                    <div className="flex-grow min-w-0 hidden lg:block lg:basis-1/4 order-4 sm:order-3">
                        <div className="space-y-1.5">
                            {investor.preferred_industries && investor.preferred_industries.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <HiOutlineBriefcase className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                    {investor.preferred_industries.slice(0, 3).map(ind => (
                                        <Badge key={ind} color="gray" size="xs">{ind}</Badge>
                                    ))}
                                    {investor.preferred_industries.length > 3 && <span className="text-xs text-gray-400">...</span>}
                                </div>
                            )}
                            {investor.preferred_geography && investor.preferred_geography.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <HiLocationMarker className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                    {investor.preferred_geography.slice(0, 2).map(geo => (
                                        <Badge key={geo} color="gray" size="xs">{geo}</Badge>
                                    ))}
                                     {investor.preferred_geography.length > 2 && <span className="text-xs text-gray-400">...</span>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-shrink-0 flex sm:flex-col lg:flex-row gap-2 w-full sm:w-auto order-2 sm:order-4 justify-end">
                        <Button 
                          onClick={() => handleOpenModal(investor.user_id)}
                          size="xs"
                          className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                        >
                          <span className="hidden lg:inline">View</span> Profile
                        </Button>
                        <Button size="xs" color="gray" disabled className="w-full lg:w-auto">
                          Connect
                        </Button> 
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
               <HiOutlineUserGroup className="mx-auto h-12 w-12 text-gray-400"/>
               <p className="mt-2 font-semibold">No investors found</p>
               <p className="text-sm">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </>
      )}

      {/* Render the Modal */} 
      <ProfilePreviewModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={selectedInvestorId}
        profileRole={selectedRole}
      />
    </div>
  );
};

export default FindInvestorsPage; 