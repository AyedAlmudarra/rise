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
  Avatar
} from 'flowbite-react';
import { HiOutlineSearch, HiOutlineFilter, HiLocationMarker, HiBriefcase, HiLink, HiUserGroup } from 'react-icons/hi';
import { HiOutlineBuildingOffice2, HiCalendarDays } from 'react-icons/hi2';
import { supabase } from '../../lib/supabaseClient';
import { StartupProfile } from '../../types/database'; // Assuming StartupProfile type exists
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// Define Startup Stages explicitly if needed for filtering/display
// const startupStages = ['Idea', 'MVP', 'Seed', 'Series A', 'Series B+'] as const;
// type StartupStage = typeof startupStages[number];

// Helper Function to get unique filter options (can be adapted for startups)
const getUniqueOptions = (items: (string | null | undefined)[] | undefined): string[] => {
  if (!items) return [];
  const allValues = items.filter((item): item is string => item !== null && item !== undefined);
  return Array.from(new Set(allValues)).sort();
};

// Define connection status type
type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'idle';

const BrowseStartupsPage: React.FC = () => {
  const { user, userRole } = useAuth(); // Add userRole back from useAuth
  const [startups, setStartups] = useState<StartupProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  // --- Add Connection State Variables ---
  const [connectionStatuses, setConnectionStatuses] = useState<Map<string, ConnectionStatus>>(new Map());
  const [loadingConnections, setLoadingConnections] = useState<boolean>(false);
  const [connectingUserId, setConnectingUserId] = useState<string | null>(null); // State for loading indicator on specific button
  // --- End Added State ---

  // Filter States (Placeholders - implement actual logic later)
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  // Add other filters as needed (e.g., revenue range, team size)

  // Unique options for filters (derived from fetched data - implement later)
  const uniqueIndustries = useMemo(() => getUniqueOptions(startups?.map(s => s.industry)), [startups]);
  const uniqueGeographies = useMemo(() => getUniqueOptions(startups?.map(s => s.location_city)), [startups]);
  const uniqueStages = useMemo(() => getUniqueOptions(startups?.map(s => s.operational_stage)), [startups]);


  useEffect(() => {
    const fetchStartupsAndConnections = async () => {
      if (!user) return; // Need user to fetch connections
      setLoading(true);
      setError(null);
      setConnectionStatuses(new Map()); // Reset statuses on new fetch

      let fetchedStartups: StartupProfile[] = [];

      try {
        // 1. Fetch Startups
        const { data: startupData, error: fetchError } = await supabase
          .from('startups')
          .select('id, user_id, name, industry, sector, operational_stage, location_city, logo_url, description');

        if (fetchError) {
          throw fetchError;
        }
        fetchedStartups = (startupData ?? []) as StartupProfile[];
        setStartups(fetchedStartups);

        // 2. Fetch Connection Statuses for fetched startups
        if (fetchedStartups.length > 0) {
            setLoadingConnections(true);
            const startupUserIds = fetchedStartups.map(s => s.user_id).filter(id => id);

            if (startupUserIds.length > 0) {
                const { data: connectionsData, error: connectionsError } = await supabase
                .from('connection_requests')
                .select('requester_user_id, recipient_user_id, status')
                // Fetch statuses between the current user and the fetched startup user IDs
                .or(`and(requester_user_id.eq.${user.id},recipient_user_id.in.(${startupUserIds.join(',')})),and(recipient_user_id.eq.${user.id},requester_user_id.in.(${startupUserIds.join(',')}))`);

                if (connectionsError) {
                    console.error("Error fetching connection statuses:", connectionsError);
                    // Handle error appropriately - perhaps set an error state
                }

                const statuses = new Map<string, ConnectionStatus>();
                connectionsData?.forEach(conn => {
                    const otherUserId = conn.requester_user_id === user.id ? conn.recipient_user_id : conn.requester_user_id;
                    // Ensure status is one of the expected values before setting
                    if (conn.status === 'pending' || conn.status === 'accepted' || conn.status === 'declined') {
                         statuses.set(otherUserId, conn.status);
                    }
                });
                setConnectionStatuses(statuses);
            } // End if startupUserIds.length > 0
             setLoadingConnections(false);
        } // End if fetchedStartups.length > 0

      } catch (err: any) {
        console.error('Error fetching startups or connections:', err);
        setError(err.message || 'Failed to fetch data.');
        setStartups([]); // Clear startups on error
      } finally {
        setLoading(false);
        setLoadingConnections(false); // Ensure loading is off in all cases
      }
    };

    fetchStartupsAndConnections();
  }, [user]); // Depend on user

  // Handle filter changes (Placeholder - implement later)
  const handleFilterChange = (
    filterType: 'industry' | 'geography' | 'stage', // Add more types
    value: string
  ) => {
    console.log(`Filter changed: ${filterType} - ${value}`); // Placeholder action
    // Logic to update selected filter states will go here
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
    }
  };

  // Filter startups based on search term and selected filters (Basic search implemented)
  const filteredStartups = useMemo(() => {
    return startups.filter(startup => {
      // Search term check (name, industry, description snippet)
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        startup.name?.toLowerCase().includes(term) ||
        startup.industry?.toLowerCase().includes(term) ||
        startup.description?.toLowerCase().includes(term); // Basic description search

      // Filter checks (Implement later)
      const matchesIndustry =
        selectedIndustries.length === 0 ||
        (startup.industry && selectedIndustries.includes(startup.industry));
      const matchesGeography =
        selectedGeographies.length === 0 ||
        (startup.location_city && selectedGeographies.includes(startup.location_city));
      const matchesStage =
        selectedStages.length === 0 ||
        (startup.operational_stage && selectedStages.includes(startup.operational_stage));


      // Return true only if all conditions match (add filter matches later)
      return matchesSearch && matchesIndustry && matchesGeography && matchesStage;
    });
  }, [startups, searchTerm, selectedIndustries, selectedGeographies, selectedStages]);


  // Helper to get Badge color based on stage (Example)
  const getStageBadgeColor = (stage: string | null | undefined): string => {
    switch (stage) {
        case 'Idea': return 'gray';
        case 'MVP': return 'info';
        case 'Seed': return 'success';
        case 'Series A': return 'warning';
        case 'Series B+': return 'purple';
        default: return 'gray';
    }
  };

  // Handle Connect Button Click
  const handleConnect = async (startupUserId: string) => {
    // Check user and role (should now be available)
    if (!user || !userRole || userRole !== 'investor') {
        console.error("Authentication error or invalid role.");
        return;
    }

    setConnectingUserId(startupUserId);
    try {
        const { error: rpcError } = await supabase.rpc('create_connection_request', {
            recipient_user_id: startupUserId
        });

        if (rpcError) {
            console.error("Error sending connection request:", rpcError);
            if (rpcError.message.includes("cooldown")) {
                 console.warn("Cooldown period active for connection request.");
            } else if (rpcError.message.includes("exists")){
                 console.info("Connection or request already exists.");
            } else {
                 console.error(`Failed to send request: ${rpcError.message}`);
            }
        } else {
            console.log("Connection request sent!");
            setConnectionStatuses(prev => new Map(prev).set(startupUserId, 'pending'));
        }
    } catch (err: any) {
        console.error("Client-side error sending connection request:", err);
    } finally {
        setConnectingUserId(null);
    }
  };

  // --- Connection Button Logic ---
  const renderConnectButton = (startupUserId: string | undefined) => {
    if (!startupUserId || !user) {
        return <Button size="xs" color="gray" disabled>Connect</Button>;
    }

    const status = connectionStatuses.get(startupUserId) || 'idle';
    const isLoadingSpecific = connectingUserId === startupUserId;

    switch (status) {
        case 'pending':
            return <Button size="xs" color="gray" disabled>Request Sent</Button>;
        case 'accepted':
            return (
                <Button as={Link} to="/messages" size="xs" color="success">
                    Message
                </Button>
            );
        case 'declined':
            return <Button size="xs" color="failure" disabled>Declined</Button>;
        case 'idle':
        default:
            return (
                <Button
                    size="xs"
                    color="blue"
                    disabled={loadingConnections || isLoadingSpecific}
                    isProcessing={isLoadingSpecific}
                    onClick={() => handleConnect(startupUserId)}
                >
                    Connect
                </Button>
            );
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="mr-4 p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-lg">
            <HiOutlineBuildingOffice2 size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              Browse Startups
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Discover and filter innovative startups.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow w-full md:w-auto">
                <Label htmlFor="searchStartups" value="Search Startups" className="sr-only" />
                <TextInput
                    id="searchStartups"
                    type="text"
                    icon={HiOutlineSearch}
                    placeholder="Search by name, industry, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex gap-2 flex-wrap justify-start md:justify-end">
                 {/* Industry Filter Dropdown */}
                <Dropdown
                    label="Industry"
                    dismissOnClick={false}
                    renderTrigger={() => (
                        <Button size="sm" outline color="gray" className="min-w-[100px]">
                            <HiBriefcase className="mr-2 h-4 w-4" />
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
                            <HiCalendarDays className="mr-2 h-4 w-4" />
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
                {/* Add more filter dropdowns here if needed */}
            </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10">
          <Spinner size="xl" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert color="failure" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Startup List */}
      {!loading && !error && (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredStartups.length} of {startups.length} startups.
          </div>
          {filteredStartups.length > 0 ? (
            <div className="space-y-3">
              {filteredStartups.map((startup) => (
                // List Item with Enhanced UI Structure
                <div key={startup.id} className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-shadow duration-200 hover:shadow-md hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">

                    {/* Section 1: Logo + Name/Industry */}
                    <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto sm:basis-1/3 lg:basis-1/4">
                        <Avatar
                            img={startup.logo_url || undefined} // Use logo_url if available
                            placeholderInitials={startup.name?.[0] || 'S'} // Fallback initials
                            rounded
                            size="md" // Slightly smaller avatar
                            className="flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600 shadow-sm"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {startup.name || 'Startup Name'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {startup.industry || 'Industry'}
                          </p>
                        </div>
                    </div>

                    {/* Section 2: Stage/Location Badges */}
                    <div className="flex-grow min-w-0 basis-full sm:basis-1/4 lg:basis-1/4 order-3 sm:order-2 flex flex-wrap gap-1.5 items-center">
                        {startup.operational_stage && (
                          <Badge color={getStageBadgeColor(startup.operational_stage)} size="xs" icon={HiCalendarDays}>
                             {startup.operational_stage}
                          </Badge>
                        )}
                         {startup.location_city && (
                          <Badge color="cyan" size="xs" icon={HiLocationMarker}>
                             {startup.location_city}
                          </Badge>
                        )}
                         {/* Add more badges here e.g., Team Size, Revenue */}
                    </div>

                    {/* Section 3: Description Snippet */}
                    <div className="flex-grow min-w-0 hidden lg:block lg:basis-1/4 order-4 sm:order-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2"> {/* line-clamp for truncation */}
                           {startup.description || 'No description available.'}
                        </p>
                    </div>

                    {/* Section 4: Action Buttons */}
                    <div className="flex-shrink-0 flex sm:flex-col lg:flex-row gap-2 w-full sm:w-auto order-2 sm:order-4 justify-end">
                        <Button
                          as={Link}
                          to={`/view/startup/${startup.id}`} // Corrected: Use startup.id (numeric) instead of user_id (UUID)
                          size="xs"
                          className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                        >
                          <span className="hidden lg:inline">View</span> Profile
                        </Button>
                        {renderConnectButton(startup.user_id)}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
               <HiOutlineBuildingOffice2 className="mx-auto h-12 w-12 text-gray-400"/>
               <p className="mt-2 font-semibold">No startups found</p>
               <p className="text-sm">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseStartupsPage; 