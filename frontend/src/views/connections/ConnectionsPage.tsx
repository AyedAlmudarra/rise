import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, Spinner, Alert, Button, Avatar, Badge } from 'flowbite-react';
import { HiUserGroup, HiOutlineInboxIn, HiOutlinePaperAirplane, HiOutlineLink, HiCheck, HiX, HiOutlineClock, HiOutlineUserCircle, HiOutlineChatAlt2, HiOutlineTrash } from 'react-icons/hi';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { ConnectionRequest, InvestorProfile, StartupProfile } from '@/types/database';
import { toast } from 'react-hot-toast';
import ProfilePreviewModal from '@/components/profile/ProfilePreviewModal';

// Combined type for display
type ConnectionDisplayData = ConnectionRequest & {
  other_user_profile: Partial<InvestorProfile & StartupProfile> & { role: 'investor' | 'startup' | 'unknown' };
};

type TabIdentifier = 'incoming' | 'outgoing' | 'active';

// Define the order of tabs for index mapping
const tabIdentifiers: TabIdentifier[] = ['incoming', 'outgoing', 'active'];

const ConnectionsPage: React.FC = () => {
  const { user } = useAuth();
  const { tab: initialTabParam } = useParams<{ tab?: TabIdentifier }>();
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // --- State ---
  const [activeTab, setActiveTab] = useState<TabIdentifier>('incoming');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});

  // Data states for each tab
  const [incomingRequests, setIncomingRequests] = useState<ConnectionDisplayData[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ConnectionDisplayData[]>([]);
  const [acceptedConnections, setAcceptedConnections] = useState<ConnectionDisplayData[]>([]);

  // ++ Add State for Modal ++ 
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<string | null>(null);
  const [selectedProfileRole, setSelectedProfileRole] = useState<'startup' | 'investor' | null>(null);

  // --- Effect to set initial tab from URL ---
  useEffect(() => {
    const validTabs: TabIdentifier[] = ['incoming', 'outgoing', 'active'];
    if (initialTabParam && validTabs.includes(initialTabParam)) {
      setActiveTab(initialTabParam);
    } else {
      setActiveTab('incoming');
      if (initialTabParam) {
        console.warn(`[ConnectionsPage Init] Invalid tab param '${initialTabParam}', defaulting to 'incoming'.`);
        setSearchParams({ tab: 'incoming' }, { replace: true });
      }
    }
  }, [initialTabParam, setSearchParams]);

  // --- Helper: Fetch Profiles ---
  const fetchProfilesForUserIds = useCallback(async (
    userIds: string[]
  ): Promise<Map<string, Partial<InvestorProfile & StartupProfile> & { role: 'investor' | 'startup' | 'unknown' }>> => {
    const profilesMap = new Map<string, Partial<InvestorProfile & StartupProfile> & { role: 'investor' | 'startup' | 'unknown' }>();
    if (!userIds || userIds.length === 0) return profilesMap;

    // Fetch investors
    const { data: investors, error: investorError } = await supabase
      .from('investors')
      .select('user_id, full_name, company_name, investor_type')
      .in('user_id', userIds);

    if (investorError) {
        console.error("Error fetching investor profiles:", investorError);
    }
    investors?.forEach(p => profilesMap.set(p.user_id, { ...p, role: 'investor' }));

    // Fetch startups
    const { data: startups, error: startupError } = await supabase
      .from('startups')
      .select('user_id, name, logo_url, industry')
      .in('user_id', userIds);

    if (startupError) {
        console.error("Error fetching startup profiles:", startupError);
    }
    startups?.forEach(p => {
      // Avoid overwriting if user has both profiles (unlikely but possible)
      if (!profilesMap.has(p.user_id)) {
        profilesMap.set(p.user_id, { ...p, role: 'startup' });
      }
    });

    return profilesMap;
  }, []); // Depends only on supabase client which is stable

  // --- Helper: Combine Requests and Profiles ---
  const combineData = useCallback(async (
      requests: ConnectionRequest[],
      otherUserField: 'requester_user_id' | 'recipient_user_id' | 'dynamic'
  ): Promise<ConnectionDisplayData[]> => {
      if (!requests || requests.length === 0 || !user) return [];

      const otherUserIds = requests.map(req => {
          if (otherUserField === 'dynamic') {
              return req.requester_user_id === user.id ? req.recipient_user_id : req.requester_user_id;
          } else {
              return req[otherUserField];
          }
      }).filter((id): id is string => !!id);

      const profilesMap = await fetchProfilesForUserIds(otherUserIds);

      return requests.map(req => {
          let otherUserId: string | null = null;
          if (otherUserField === 'dynamic') {
               otherUserId = req.requester_user_id === user.id ? req.recipient_user_id : req.requester_user_id;
          } else {
               otherUserId = req[otherUserField];
          }
          const profile = otherUserId ? profilesMap.get(otherUserId) : undefined;
          return {
              ...req,
              other_user_profile: profile || { role: 'unknown' }
          };
      });
  }, [fetchProfilesForUserIds, user]);

  // --- Data Fetching Logic ---
  const fetchConnections = useCallback(async (tab: TabIdentifier) => {
      if (!user) return;

      setIsLoading(true);
      setError(null);
      let query = supabase.from('connection_requests').select('*');
      let otherUserField: 'requester_user_id' | 'recipient_user_id' | 'dynamic' = 'dynamic';
      let setData: React.Dispatch<React.SetStateAction<ConnectionDisplayData[]>> = () => {};
      let errorMsg = 'Failed to load connections';

      switch (tab) {
          case 'incoming':
              query = query.eq('recipient_user_id', user.id).eq('status', 'pending');
              otherUserField = 'requester_user_id';
              setData = setIncomingRequests;
              errorMsg = 'Failed to load incoming requests';
              break;
          case 'outgoing':
              query = query.eq('requester_user_id', user.id).eq('status', 'pending');
              otherUserField = 'recipient_user_id';
              setData = setOutgoingRequests;
              errorMsg = 'Failed to load outgoing requests';
              break;
          case 'active':
              query = query.eq('status', 'accepted').or(`requester_user_id.eq.${user.id},recipient_user_id.eq.${user.id}`);
              otherUserField = 'dynamic';
              setData = setAcceptedConnections;
              errorMsg = 'Failed to load active connections';
              break;
      }

      try {
          const { data: requests, error: queryError } = await query.order('created_at', { ascending: false });
          if (queryError) throw queryError;

          const combinedData = await combineData(requests || [], otherUserField);
          setData(combinedData);

      } catch (err: any) {
          console.error(`[ConnectionsPage] Error fetching ${tab} connections:`, err);
          setError(`${errorMsg}: ${err.message}`);
          setData([]); // Clear data on error
      } finally {
          setIsLoading(false);
      }
  }, [user, combineData]);

  // --- Effect to Fetch Data on Tab Change or User Change ---
  useEffect(() => {
      fetchConnections(activeTab);

      // Clear data for inactive tabs (optional, helps prevent brief stale data flashes)
      if (activeTab !== 'incoming') setIncomingRequests([]);
      if (activeTab !== 'outgoing') setOutgoingRequests([]);
      if (activeTab !== 'active') setAcceptedConnections([]);

  }, [activeTab, user, fetchConnections]);


  // --- Tab Change Handler ---
  const handleTabChange = (tabId: TabIdentifier) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const handleActiveTabChangeByIndex = (activeTabIndex: number) => {
      if (activeTabIndex >= 0 && activeTabIndex < tabIdentifiers.length) {
          const newTabId = tabIdentifiers[activeTabIndex];
          handleTabChange(newTabId);
      } else {
          console.warn(`[ConnectionsPage] Invalid tab index received: ${activeTabIndex}`);
      }
  };


  // --- Action Handlers ---
  const handleRequestAction = async (requestId: number, action: 'accept' | 'decline' | 'withdraw' | 'remove') => {
      if (!user) return;

      setActionLoading(prev => ({ ...prev, [requestId]: true }));
      let rpcName = '';
      let params: any = { p_request_id: requestId };
      let successMessage = '';
      let baseErrorMessage = '';

      // Determine RPC details based on action
      switch(action) {
          case 'accept':
              rpcName = 'update_connection_status';
              params = { p_request_id: requestId, p_new_status: 'accepted' };
              successMessage = 'Connection accepted!';
              baseErrorMessage = 'Failed to accept connection';
              break;
          case 'decline':
              rpcName = 'update_connection_status';
              params = { p_request_id: requestId, p_new_status: 'declined' };
              successMessage = 'Connection declined.';
              baseErrorMessage = 'Failed to decline connection';
              break;
          case 'withdraw':
              rpcName = 'withdraw_connection_request';
              successMessage = 'Request withdrawn.';
              baseErrorMessage = 'Failed to withdraw request';
              break;
          case 'remove':
              rpcName = 'remove_connection';
              successMessage = 'Connection removed.';
              baseErrorMessage = 'Failed to remove connection';
              break;
          default:
              console.error("Invalid action specified:", action);
              setActionLoading(prev => ({ ...prev, [requestId]: false }));
              return;
       }

      try {
          const { error: rpcError } = await supabase.rpc(rpcName, params);
          if (rpcError) {
              // Attempt to parse more specific error from message if possible
              const detail = rpcError.message?.includes('ERROR:') ? rpcError.message.split('ERROR:')[1].trim() : rpcError.message;
              throw new Error(detail || 'Unknown RPC error');
          }
          toast.success(successMessage);

          // --- Refetch data for the relevant tabs after action ---
          // Always refetch the current tab
          await fetchConnections(activeTab);
          // If accepting, also refetch active connections if not already on that tab
          if (action === 'accept' && activeTab !== 'active') {
              fetchConnections('active');
          }
          // Consider if other fetches are needed (e.g., removing from active might affect other views)

      } catch (err: any) {
          console.error(`Error performing action '${action}' for request ${requestId}:`, err);
          toast.error(`${baseErrorMessage}: ${err.message}`);
          // Optionally set the global error state as well
          // setError(`${baseErrorMessage}: ${err.message}`);
      } finally {
          setActionLoading(prev => ({ ...prev, [requestId]: false }));
      }
  };

  // Specific action callers remain the same
  const handleAccept = (requestId: number) => handleRequestAction(requestId, 'accept');
  const handleDecline = (requestId: number) => handleRequestAction(requestId, 'decline');
  const handleWithdraw = (requestId: number) => handleRequestAction(requestId, 'withdraw');
  const handleRemove = (connectionId: number) => handleRequestAction(connectionId, 'remove');

  // --- Render Helper for List Items (Revised UI) ---
  const renderConnectionItem = (item: ConnectionDisplayData, type: 'incoming' | 'outgoing' | 'active') => {
    const profile = item.other_user_profile;
    const profileUserId = profile?.user_id;
    const profileRole = profile?.role;
    const displayName = profile.role === 'investor' ? profile.full_name : profile.name;
    const displayTitle = profile.role === 'investor' ? profile.company_name : (profile.role === 'startup' ? profile.industry : 'Unknown Role');
    const avatarInitials = displayName?.[0]?.toUpperCase() || '?';
    const avatarImg = profile.role === 'startup' ? profile.logo_url : undefined;
    const isActionLoading = actionLoading[item.id] || false;

    // --- Message Handler Placeholder (No Change) ---
    const handleMessageClick = (otherUserId: string | undefined) => {
      if (!otherUserId) return;
      console.log(`Navigating to messages page (connection ID: ${item.id})`);
      navigate('/app/messages');
    };

    // --- Badge Color Helper (No Change) ---
    const getRoleBadgeColor = (role: string | null | undefined): string => {
        switch (role) {
            case 'investor': return 'purple';
            case 'startup': return 'success';
            default: return 'gray';
        }
    };
    
     // ++ New handler to open the modal ++ 
    const handleViewProfileClick = (pUserId: string, pRole: 'startup' | 'investor') => {
        setSelectedProfileUserId(pUserId);
        setSelectedProfileRole(pRole);
        setIsProfileModalOpen(true);
    };

    return (
        <div key={item.id} className="flex items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700/50">

            {/* Left Column: Profile Info */}
            <div className="flex items-center gap-3 min-w-0 flex-grow">
                <Avatar
                    img={avatarImg || undefined}
                    placeholderInitials={avatarInitials}
                    rounded
                    size="md"
                    className="flex-shrink-0"
                />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {displayName || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {displayTitle || 'Role/Industry'}
                    </p>
                    {profile.role && profile.role !== 'unknown' && (
                        <Badge color={getRoleBadgeColor(profile.role)} size="xs" className="mt-1">
                            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                        </Badge>
                    )}
                     {(type === 'incoming' || type === 'outgoing') && item.request_message && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 italic">"{item.request_message}"</p>
                    )}
                </div>
            </div>

            {/* Right Column: Action Buttons */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-1.5 items-end sm:items-center">
                {/* Conditional Action Buttons */}
                {type === 'incoming' && (
                    <div className="flex gap-1.5">
                        {/* View Profile Button triggers modal */}
                        {profileUserId && profileRole && profileRole !== 'unknown' && (
                            <Button onClick={() => handleViewProfileClick(profileUserId, profileRole)} size="xs" color="light" className="!p-1.5" title="View Profile"><HiOutlineUserCircle className="h-4 w-4" /></Button>
                        )}
                        <Button size="xs" color="success" onClick={() => handleAccept(item.id)} isProcessing={isActionLoading} disabled={isActionLoading} title="Accept" className="!p-1.5"><HiCheck className="h-4 w-4"/></Button>
                        <Button size="xs" color="failure" onClick={() => handleDecline(item.id)} isProcessing={isActionLoading} disabled={isActionLoading} title="Decline" className="!p-1.5"><HiX className="h-4 w-4"/></Button>
                    </div>
                )}
                {type === 'outgoing' && (
                     <div className="flex gap-1.5">
                        {/* View Profile Button triggers modal */}
                         {profileUserId && profileRole && profileRole !== 'unknown' && (
                             <Button onClick={() => handleViewProfileClick(profileUserId, profileRole)} size="xs" color="light" className="!p-1.5" title="View Profile"><HiOutlineUserCircle className="h-4 w-4" /></Button>
                         )}
                         <Button size="xs" color="warning" onClick={() => handleWithdraw(item.id)} isProcessing={isActionLoading} disabled={isActionLoading} title="Withdraw Request" className="!p-1.5"><HiOutlineClock className="h-4 w-4"/></Button>
                    </div>
                )}
                {type === 'active' && (
                    <div className="flex gap-1.5">
                         {/* View Profile Button triggers modal */}
                          {profileUserId && profileRole && profileRole !== 'unknown' && (
                              <Button onClick={() => handleViewProfileClick(profileUserId, profileRole)} size="xs" color="light" className="!p-1.5" title="View Profile"><HiOutlineUserCircle className="h-4 w-4" /></Button>
                          )}
                         {/* Message Button */}
                         {profileUserId && (
                             <Button size="xs" color="info" className="!p-1.5" title="Message User" onClick={() => handleMessageClick(profileUserId)}><HiOutlineChatAlt2 className="h-4 w-4" /></Button>
                         )}
                         {/* Remove Button */}
                         <Button size="xs" color="gray" onClick={() => handleRemove(item.id)} isProcessing={isActionLoading} disabled={isActionLoading} title="Remove Connection" className="!p-1.5"><HiOutlineTrash className="h-4 w-4"/></Button>
                    </div>
                )}
            </div>
        </div>
    );
  };

  // --- Get Current Tab Content --- (Helper for renderContent)
  const getCurrentTabData = () => {
      switch (activeTab) {
          case 'incoming': return incomingRequests;
          case 'outgoing': return outgoingRequests;
          case 'active': return acceptedConnections;
          default: return [];
      }
  };

  const getEmptyMessage = () => {
      switch (activeTab) {
          case 'incoming': return "No incoming requests.";
          case 'outgoing': return "No pending outgoing requests.";
          case 'active': return "No active connections yet.";
          default: return "No data available.";
      }
  };

  const getLoadingMessage = () => {
    switch (activeTab) {
        case 'incoming': return "Loading incoming requests...";
        case 'outgoing': return "Loading outgoing requests...";
        case 'active': return "Loading active connections...";
        default: return "Loading...";
    }
};

  // --- Main Render Function ---
  const renderContent = () => {
    if (!user) {
      return <div className="text-center py-10"><p className="text-gray-500 dark:text-gray-400">Please log in to manage connections.</p></div>;
    }

    const currentData = getCurrentTabData();

    return (
      <>
        <Tabs
            aria-label="Connection tabs"
            variant="underline"
            onActiveTabChange={handleActiveTabChangeByIndex}
            // Ensure the Tabs component itself reflects the active state if needed,
            // though usually handled by the `active` prop on Tabs.Item
        >
          {/* Tab headers - Content is rendered below */}
          <Tabs.Item
            active={activeTab === 'incoming'}
            title="Incoming Requests"
            icon={HiOutlineInboxIn}
          />
          <Tabs.Item
            active={activeTab === 'outgoing'}
            title="Pending Outgoing"
            icon={HiOutlinePaperAirplane}
          />
          <Tabs.Item
            active={activeTab === 'active'}
            title="Active Connections"
            icon={HiUserGroup}
          />
        </Tabs>

        {/* Content Area - Renders based on activeTab */}
        <div className="mt-4"> {/* Add margin-top for spacing */}
          {isLoading ? (
            <div className="text-center py-10"><Spinner aria-label={getLoadingMessage()} /></div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {currentData.length === 0
                ? (<p className="text-gray-500 dark:text-gray-400 text-center p-6">{getEmptyMessage()}</p>)
                // Pass the activeTab to renderConnectionItem if its logic depends on the tab type
                // Otherwise, determine the type based on which state array currentData came from (more complex)
                // Simpler: just pass activeTab
                : (currentData.map(item => renderConnectionItem(item, activeTab)))
              }
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
           <div className="mr-4 p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg"><HiOutlineLink size={28} className="text-white" /></div>
           <div>
             <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">Manage Connections</h2>
             <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your connection requests and active connections.</p>
           </div>
        </div>
      </div>

      {/* Global Error Alert */}
      {error && ( <Alert color="failure" onDismiss={() => setError(null)} className="mb-6"> {error} </Alert> )}

      {/* Render Tabs Content */}
      {renderContent()}

      {/* ++ Render the Modal ++ */}
      <ProfilePreviewModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userId={selectedProfileUserId}
        profileRole={selectedProfileRole}
      />
    </div>
  );
};

export default ConnectionsPage; 