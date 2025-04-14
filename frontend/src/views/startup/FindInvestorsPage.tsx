import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from 'src/context/AuthContext';
import {
    Card, Spinner, Alert, Button, TextInput, Label, Checkbox, Select,
    Table, Pagination, Badge, Avatar
} from 'flowbite-react';
import {
    IconSearch, IconFilter, IconX, IconBriefcase, IconBuildingFactory2, IconScale, IconMapPin,
    IconAlertCircle, IconUserSearch
} from '@tabler/icons-react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { supabase } from 'src/lib/supabaseClient';
import { InvestorProfile } from 'src/types/database'; // Assuming type exists
import { debounce } from 'lodash'; // For debouncing search input

// Constants for filters (assuming they exist)
const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Education", "E-commerce", "Entertainment", "Real Estate", "Logistics"];
const STAGES = ["Idea", "Pre-Seed", "Seed", "Series A", "Series B+", "Growth"];
const GEOGRAPHIES = ["MENA", "Europe", "North America", "Asia", "Global"];

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Find Investors' },
];

const ITEMS_PER_PAGE = 10;

const FindInvestorsPage: React.FC = () => {
  const { user, loading: authLoading, userRole } = useAuth();
  const [investors, setInvestors] = useState<InvestorProfile[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<InvestorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredInvestors.length / ITEMS_PER_PAGE);
  const paginatedInvestors = filteredInvestors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Fetch all investors initially
  const fetchAllInvestors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('investors')
        .select(`
          id,
          user_id,
          company_name,
          job_title,
          preferred_industries,
          preferred_stage,
          preferred_geography,
          users ( id, user_metadata->>full_name, user_metadata->>avatar_url )
        `); // Join with users table

      if (fetchError) throw fetchError;
      setInvestors(data || []);

    } catch (err: any) {
      console.error("Error fetching investors:", err);
      setError("Failed to load investor directory.");
      setInvestors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
     // Only fetch if user is loaded and is a startup
    if (!authLoading && user && userRole === 'startup') {
        fetchAllInvestors();
    } else if (!authLoading && (!user || userRole !== 'startup')) {
         setIsLoading(false);
         setError(userRole !== 'startup' ? "Access denied. This page is for startups only." : "User not authenticated.");
    }
  }, [user, authLoading, userRole, fetchAllInvestors]);

  // --- Filtering Logic --- 
  const applyFilters = useCallback(() => {
      let tempFiltered = [...investors];
      
      // Search Term (Name, Company)
       if (searchTerm) {
          const lowerSearchTerm = searchTerm.toLowerCase();
          tempFiltered = tempFiltered.filter(inv => 
               inv.users?.user_metadata?.full_name?.toLowerCase().includes(lowerSearchTerm) ||
               inv.company_name?.toLowerCase().includes(lowerSearchTerm)
           );
       }
       
      // Industry Filter
      if (selectedIndustries.length > 0) {
          tempFiltered = tempFiltered.filter(inv => 
              inv.preferred_industries?.some(ind => selectedIndustries.includes(ind))
          );
      }
      
      // Stage Filter
       if (selectedStages.length > 0) {
          tempFiltered = tempFiltered.filter(inv => 
              inv.preferred_stage && selectedStages.includes(inv.preferred_stage)
          );
      }
      
       // Geography Filter
      if (selectedGeographies.length > 0) {
           tempFiltered = tempFiltered.filter(inv => 
              inv.preferred_geography?.some(geo => selectedGeographies.includes(geo))
          );
      }

      setFilteredInvestors(tempFiltered);
      setCurrentPage(1); // Reset to first page after filtering
  }, [investors, searchTerm, selectedIndustries, selectedStages, selectedGeographies]);

  // Debounced search handler
  const debouncedApplyFilters = useCallback(debounce(applyFilters, 300), [applyFilters]);

  // Apply filters whenever investors data or filter criteria change
  useEffect(() => {
    debouncedApplyFilters();
    // Cleanup debounce timer on unmount
    return debouncedApplyFilters.cancel;
  }, [investors, searchTerm, selectedIndustries, selectedStages, selectedGeographies, debouncedApplyFilters]);

  // --- Handlers for Filters --- 
   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
  };
  
   const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string, checked: boolean) => {
      setter(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
      );
  };

  const resetFilters = () => {
      setSearchTerm('');
      setSelectedIndustries([]);
      setSelectedStages([]);
      setSelectedGeographies([]);
      setShowFilters(false);
  };

  // Handler for Pagination
  const onPageChange = (page: number) => {
      setCurrentPage(page);
  };

  // --- Render Logic --- 
  if (authLoading) {
     return <div className="flex justify-center items-center h-screen"><Spinner size="xl" /></div>; 
  }

  if (error) {
      return (
        <>
          <BreadcrumbComp title="Find Investors" items={BCrumb} />
          <Alert color="failure" icon={IconAlertCircle}>{error}</Alert>
        </>
      );
  }

  return (
    <>
      <BreadcrumbComp title="Find Investors" items={BCrumb} />

       <Card className="mb-6">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <TextInput 
                icon={IconSearch} 
                placeholder="Search by name or company..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-grow md:max-w-sm"
            />
             <Button outline color="gray" onClick={() => setShowFilters(!showFilters)}>
                <IconFilter size={18} className="mr-2"/>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
             </Button>
         </div>
          {/* Filter Section */} 
          {showFilters && (
             <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {/* Industry Filter */}
                     <div>
                         <Label className="font-semibold mb-2 block">Industry</Label>
                         <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                              {INDUSTRIES.map(ind => (
                                 <div key={ind} className="flex items-center">
                                     <Checkbox 
                                         id={`filter-ind-${ind}`} 
                                         value={ind} 
                                         checked={selectedIndustries.includes(ind)}
                                         onChange={(e) => handleCheckboxChange(setSelectedIndustries, ind, e.target.checked)}
                                     />
                                     <Label htmlFor={`filter-ind-${ind}`} className="ml-2 text-sm">{ind}</Label>
                                 </div>
                             ))}
                         </div>
                     </div>
                      {/* Stage Filter */}
                     <div>
                         <Label className="font-semibold mb-2 block">Investment Stage</Label>
                          <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                             {STAGES.map(stage => (
                                 <div key={stage} className="flex items-center">
                                     <Checkbox 
                                         id={`filter-stage-${stage}`} 
                                         value={stage} 
                                         checked={selectedStages.includes(stage)}
                                         onChange={(e) => handleCheckboxChange(setSelectedStages, stage, e.target.checked)}
                                     />
                                     <Label htmlFor={`filter-stage-${stage}`} className="ml-2 text-sm">{stage}</Label>
                                 </div>
                             ))}
                         </div>
                     </div>
                      {/* Geography Filter */}
                      <div>
                         <Label className="font-semibold mb-2 block">Geography</Label>
                         <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                             {GEOGRAPHIES.map(geo => (
                                 <div key={geo} className="flex items-center">
                                     <Checkbox 
                                         id={`filter-geo-${geo}`} 
                                         value={geo} 
                                         checked={selectedGeographies.includes(geo)}
                                         onChange={(e) => handleCheckboxChange(setSelectedGeographies, geo, e.target.checked)}
                                     />
                                     <Label htmlFor={`filter-geo-${geo}`} className="ml-2 text-sm">{geo}</Label>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
                 <div className="mt-4 flex justify-end">
                     <Button color="light" size="xs" onClick={resetFilters}>
                        <IconX size={14} className="mr-1"/> Reset Filters
                     </Button>
                 </div>
             </div>
          )}
       </Card>

      {/* Investor Table */} 
      <div className="overflow-x-auto">
         {isLoading ? (
             <div className="flex justify-center p-10"><Spinner size="lg" /></div>
         ) : ( 
            <> 
            <Table hoverable>
                 <Table.Head>
                     <Table.HeadCell>Investor</Table.HeadCell>
                     <Table.HeadCell>Company</Table.HeadCell>
                     <Table.HeadCell>Preferred Industries</Table.HeadCell>
                     <Table.HeadCell>Preferred Stage</Table.HeadCell>
                     <Table.HeadCell>Preferred Geography</Table.HeadCell>
                     <Table.HeadCell>
                         <span className="sr-only">Actions</span>
                     </Table.HeadCell>
                 </Table.Head>
                 <Table.Body className="divide-y">
                     {paginatedInvestors.length > 0 ? (
                         paginatedInvestors.map((investor) => (
                            <Table.Row key={investor.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                 <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                     <div className="flex items-center gap-3">
                                         <Avatar 
                                             img={investor.users?.user_metadata?.avatar_url || undefined} // Use undefined for default Flowbite avatar
                                             rounded
                                             size="sm"
                                         />
                                        <div>
                                             {investor.users?.user_metadata?.full_name || 'N/A'}
                                             <div className="text-xs text-gray-500">{investor.job_title || 'N/A'}</div>
                                         </div>
                                     </div>
                                 </Table.Cell>
                                 <Table.Cell>{investor.company_name || 'N/A'}</Table.Cell>
                                 <Table.Cell>
                                      <div className="flex flex-wrap gap-1 max-w-xs">
                                         {(investor.preferred_industries || []).slice(0, 3).map(ind => <Badge key={ind} size="xs" color="info">{ind}</Badge>)} 
                                         {(investor.preferred_industries?.length ?? 0) > 3 && <Badge size="xs" color="gray">+{(investor.preferred_industries?.length ?? 0) - 3} more</Badge>}
                                      </div>
                                 </Table.Cell>
                                 <Table.Cell>{investor.preferred_stage || 'N/A'}</Table.Cell>
                                  <Table.Cell>
                                     <div className="flex flex-wrap gap-1 max-w-xs">
                                         {(investor.preferred_geography || []).slice(0, 3).map(geo => <Badge key={geo} size="xs" color="pink">{geo}</Badge>)}
                                         {(investor.preferred_geography?.length ?? 0) > 3 && <Badge size="xs" color="gray">+{(investor.preferred_geography?.length ?? 0) - 3} more</Badge>}
                                     </div>
                                  </Table.Cell>
                                 <Table.Cell>
                                     {/* Add View Profile / Connect buttons here later */}
                                     <Button size="xs" color="light">
                                         View
                                     </Button>
                                 </Table.Cell>
                             </Table.Row>
                         ))
                     ) : (
                         <Table.Row>
                            <Table.Cell colSpan={6} className="text-center py-10 text-gray-500">
                                 No investors found matching your criteria.
                            </Table.Cell>
                         </Table.Row>
                     )}
                 </Table.Body>
             </Table>
             {totalPages > 1 && (
                 <div className="flex justify-center py-4">
                     <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={onPageChange} 
                        showIcons
                    />
                 </div>
             )}
             </>
         )}
      </div>
    </>
  );
};

export default FindInvestorsPage; 