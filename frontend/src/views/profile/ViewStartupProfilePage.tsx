import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Spinner,
  Alert,
  Button,
  Badge,
  Avatar,
  Breadcrumb,
  Modal,
  Textarea,
  Label
} from 'flowbite-react';
import { supabase } from '../../lib/supabaseClient';
import { StartupProfile, ConnectionRequest } from '../../types/database';
import { useAuth } from '../../context/AuthContext';
// Corrected Icon Imports
import { HiOutlineOfficeBuilding, HiOutlineLink, HiOutlineLocationMarker, HiOutlineChatAlt2, HiOutlineInformationCircle, HiExternalLink, HiHome, HiTag, HiCheckCircle, HiClock, HiBan, HiX } from 'react-icons/hi'; 
import { HiOutlineBuildingOffice2, HiCalendarDays } from 'react-icons/hi2'; // Moved HiCalendarDays here
import { toast } from 'react-hot-toast';
import { differenceInDays } from 'date-fns';

// Define helper components (can be moved to a shared file later)
const ProfileSection: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
  <div className={`mb-6 ${className}`}>
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          {icon && <span className="mr-2 text-green-500">{icon}</span>} {/* Changed icon color */} 
          {title}
      </h3>
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          {children}
      </div>
  </div>
);

const InfoItem: React.FC<{ label: string; value: React.ReactNode | string | null; link?: string }> = ({ label, value, link }) => (
  value ? (
      <div className="flex justify-between py-1.5">
          <span className="font-medium text-gray-500 dark:text-gray-400">{label}:</span>
          {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400 flex items-center">
                  {value} <HiExternalLink className="ml-1 h-4 w-4" />
              </a>
          ) : (
              <span className="text-gray-800 dark:text-gray-200 text-right">{value}</span>
          )}
      </div>
  ) : null
);

// Helper to get Badge color based on stage (Example - consistent with BrowseStartupsPage)
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

// --- Define connection status types (same as Investor view) --- 
type ConnectionStatus = 'idle' | 'pending_sent' | 'pending_received' | 'accepted' | 'declined_recent' | 'declined_old' | 'loading' | 'error' | 'self';

const ViewStartupProfilePage: React.FC = () => {
  const { startupId } = useParams<{ startupId: string }>();
  const { user } = useAuth();
  const [startupData, setStartupData] = useState<StartupProfile | null>(null);
  const [profileLoading, setLoading] = useState<boolean>(true);
  const [profileError, setError] = useState<string | null>(null);

  // --- Connection State --- 
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('loading');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [lastDeclinedDate, setLastDeclinedDate] = useState<Date | null>(null);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [requestMessage, setRequestMessage] = useState<string>('');

  const profileUserId = startupData?.user_id; // Startup's user ID
  const currentUserId = user?.id; // Viewing user's ID (Investor)

  useEffect(() => {
    const fetchStartupProfile = async () => {
      setLoading(true);
      setError(null);

      // --- Input Validation --- 
      if (!startupId) {
        setError('Startup ID not found in URL.');
        setLoading(false);
        return;
      }

      const idAsNumber = parseInt(startupId, 10); // Always use radix 10

      if (isNaN(idAsNumber)) {
         setError('Invalid Startup ID format in URL.');
         setLoading(false);
         return;
      }
      // --- End Validation --- 

      try {
        // Fetch all columns to match StartupProfile type
        const { data, error: fetchError } = await supabase
          .from('startups')
          .select('*') // Changed to select all columns
          .eq('id', idAsNumber)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { 
             setError('Startup profile not found.');
          } else {
             throw fetchError;
          }
        }
        setStartupData(data as StartupProfile | null); // Explicit cast might still be needed depending on Supabase types
      } catch (err: any) {
        console.error('Error fetching startup profile:', err);
        setError(err.message || 'Failed to fetch startup profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchStartupProfile();
  }, [startupId]);

  // --- Fetch Connection Status --- 
  const fetchConnectionStatus = useCallback(async () => {
    if (!profileUserId || !currentUserId) {
      if (!profileLoading) {
        // Determine if viewing own profile (though unlikely for investor viewing startup)
         setConnectionStatus(profileUserId === currentUserId ? 'self' : 'idle'); 
      }
      return;
    }

    // If the viewer is the startup owner (viewing their own public page)
    if (profileUserId === currentUserId) {
        setConnectionStatus('self');
        return;
    }

    setConnectionStatus('loading');
    setLastDeclinedDate(null);

    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('status, requester_user_id, created_at')
        .or(`and(requester_user_id.eq.${currentUserId},recipient_user_id.eq.${profileUserId}),and(requester_user_id.eq.${profileUserId},recipient_user_id.eq.${currentUserId})`)
        .order('created_at', { ascending: false }); 

      if (error) throw error;

      if (data && data.length > 0) {
        const latestRequest = data[0]; 
        
        if (latestRequest.status === 'accepted') {
          setConnectionStatus('accepted');
        } else if (latestRequest.status === 'pending') {
          if (latestRequest.requester_user_id === currentUserId) {
            setConnectionStatus('pending_sent');
          } else {
            setConnectionStatus('pending_received'); 
          }
        } else if (latestRequest.status === 'declined') {
          const declinedDate = new Date(latestRequest.created_at);
          setLastDeclinedDate(declinedDate);
          const daysSinceDecline = differenceInDays(new Date(), declinedDate);
          if (daysSinceDecline < 7) {
            setConnectionStatus('declined_recent');
          } else {
            setConnectionStatus('declined_old'); 
          }
        } else {
           setConnectionStatus('idle'); 
        }
      } else {
        setConnectionStatus('idle');
      }
    } catch (err: any) {
      console.error('Error fetching connection status:', err);
      toast.error('Could not load connection status.');
      setConnectionStatus('error');
    }
  }, [currentUserId, profileUserId, profileLoading]);

  useEffect(() => {
    // Fetch status when IDs are available and profile isn't loading
    if (currentUserId && profileUserId && !profileLoading) {
      fetchConnectionStatus();
    }
  }, [currentUserId, profileUserId, profileLoading, fetchConnectionStatus]);

  // --- Handle Connect --- 
  const handleConnect = async () => {
    console.log("[ViewStartupProfilePage] handleConnect triggered."); // Log start
    if (!profileUserId || !currentUserId || profileUserId === currentUserId) {
      console.log("[ViewStartupProfilePage] handleConnect aborted: Missing IDs or connecting to self.", { profileUserId, currentUserId });
      return;
    }

    setIsConnecting(true);
    const toastId = toast.loading('Sending connection request...');
    console.log(`[ViewStartupProfilePage] Attempting to call create_connection_request for recipient: ${profileUserId}`); // Log recipient

    try {
      const { error } = await supabase.rpc('create_connection_request', {
        p_recipient_user_id: profileUserId,
        p_request_message: requestMessage || null
      });

      // --- Log RPC result ---
      if (error) {
         console.error("[ViewStartupProfilePage] RPC Error received:", error);
         if (error.message.includes('CONNECTION_ERROR:')) {
             // Throw specific error message extracted from RPC
             const specificError = error.message.split('CONNECTION_ERROR: ')[1];
             console.log(`[ViewStartupProfilePage] Throwing specific error: ${specificError}`);
             throw new Error(specificError); 
         } else {
            // Throw the generic Supabase error
            console.log("[ViewStartupProfilePage] Throwing generic Supabase error.");
            throw error;
         }
      }

      // --- Log Success ---
      console.log("[ViewStartupProfilePage] RPC call successful. Request sent.");
      toast.success('Connection request sent!', { id: toastId });
      setConnectionStatus('pending_sent'); 
      setShowRequestModal(false); 
      setRequestMessage(''); 

    } catch (err: any) {
      // --- Log Caught Error ---
      console.error('[ViewStartupProfilePage] Error caught in handleConnect:', err);
      toast.error(`Failed to send request: ${err.message}`, { id: toastId });
    } finally {
      // --- Log Finally Block ---
      console.log("[ViewStartupProfilePage] handleConnect finally block reached.");
      setIsConnecting(false);
    }
  };

  // --- Handle Cancel Request --- 
  const handleCancelRequest = async () => {
    if (!profileUserId || !currentUserId || connectionStatus !== 'pending_sent') return;
    setIsCancelling(true);
    const toastId = toast.loading('Cancelling connection request...');
    try {
      const { error } = await supabase.rpc('cancel_connection_request', {
        p_recipient_user_id: profileUserId
      });
      if (error) {
         if (error.message.includes('CANCEL_ERROR:')) {
            throw new Error(error.message.split('CANCEL_ERROR: ')[1]); 
         } else {
           throw error;
         }
      }
      toast.success('Connection request cancelled.', { id: toastId });
      setConnectionStatus('idle');
    } catch (err: any) {
      console.error('Error cancelling connection request:', err);
      toast.error(`Failed to cancel request: ${err.message}`, { id: toastId });
    } finally {
      setIsCancelling(false);
    }
  };

  // --- Render Connection Button (Full Logic) --- 
  const renderConnectButton = () => {
    // Handle case where user is viewing their own profile
    // (Though less likely for Investor viewing Startup page)
    if (connectionStatus === 'self') {
       return <Button as={Link} to="/profile/edit" color="light">Edit Your Profile</Button>; // Adjust link if needed for startup edit
    }
    
    switch (connectionStatus) {
      case 'loading':
        return <Button color="gray" disabled={true}><Spinner size="sm" className="mr-2"/> Loading...</Button>;
      case 'pending_sent':
        return (
          <Button 
            color="warning"
            onClick={handleCancelRequest} 
            isProcessing={isCancelling} 
            disabled={isCancelling}
          >
            <HiX className="mr-2 h-5 w-5" /> 
            Cancel Request
          </Button>
        );
      case 'pending_received':
        // Investors receive requests *from* startups, potentially link to manage connections
        return <Button color="info" as={Link} to="/connections?tab=incoming"> Respond to Request</Button>; 
      case 'accepted':
        return <Button color="success" disabled={true}><HiCheckCircle className="mr-2 h-5 w-5" /> Connected</Button>;
      case 'declined_recent':
        return <Button color="failure" disabled={true}><HiBan className="mr-2 h-5 w-5" /> Declined (Wait)</Button>;
      case 'declined_old': 
      case 'idle':
        return (
          <Button 
            onClick={() => setShowRequestModal(true)} 
            color="blue" // Consistent color for connect action
            isProcessing={isConnecting}
            disabled={isConnecting}
          >
            <HiOutlineChatAlt2 className="mr-2 h-5 w-5" /> 
            Connect
          </Button>
        );
       case 'error':
       default:
         return <Button color="gray" disabled={true}>Unavailable</Button>; 
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Loading State - Use profileLoading */}
      {profileLoading && (
        <div className="text-center py-20">
          <Spinner size="xl" color="success" aria-label="Loading startup profile..." />
          <p className="mt-3 text-gray-500 dark:text-gray-400">Loading Profile...</p>
        </div>
      )}

      {/* Error State - Use profileError */}
      {!profileLoading && profileError && (
        <Alert color="failure" className="max-w-4xl mx-auto">
          <span className="font-medium">Error!</span> {profileError}
        </Alert>
      )}

      {/* --- Profile Display --- */}
      {!profileLoading && !profileError && startupData && (
        <div className="max-w-5xl mx-auto">

          {/* --- Header (Similar to Investor View) --- */}
          <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
             <div className="flex items-center">
               <div className="mr-4 p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-lg"> {/* Startup Colors */} 
                  <HiOutlineBuildingOffice2 size={28} className="text-white" />
               </div>
               <div>
                 <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                   {startupData.name || 'Startup Profile'}
                 </h2>
                 <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {startupData.industry || 'Industry Not Specified'}
                    {startupData.location_city ? ` • ${startupData.location_city}` : ''}
                 </p>
               </div>
             </div>
           </div>

          {/* --- Breadcrumbs --- */}
          <Breadcrumb aria-label="Profile navigation" className="mt-6 mb-8">
            {/* Adjust breadcrumb links based on user role (Assume Investor) */} 
            <Breadcrumb.Item href="/investor/dashboard" icon={HiHome}>
               Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/investor/browse-startups">
              Browse Startups
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {startupData.name || 'Startup Profile'}
            </Breadcrumb.Item>
          </Breadcrumb>

           {/* --- Main Profile Card --- */}
           <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden p-6 sm:p-8">
                {/* Card Header: Avatar, Stage Badge, Connect Button */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
                   <Avatar
                     img={startupData.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(startupData.name || 'S')}&background=random&color=fff`}
                     alt={`${startupData.name || 'Startup'} logo`}
                     rounded
                     size="xl"
                     className="ring-4 ring-gray-200 dark:ring-gray-600 shadow-lg mb-4 sm:mb-0 sm:mr-6 flex-shrink-0"
                   />
                   <div className="flex-grow text-center sm:text-left">
                        {startupData.operational_stage && (
                            <Badge color={getStageBadgeColor(startupData.operational_stage)} size="sm" icon={HiCalendarDays} className="mt-1">
                                {startupData.operational_stage}
                            </Badge>
                        )}
                         {/* Add other key info like founded date later? */} 
                   </div>
                   <div className="mt-4 sm:mt-0 flex-shrink-0">
                       {renderConnectButton()} 
                   </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* Column 1: About & Links */} 
                    <div className="md:col-span-2 md:border-r md:border-gray-100 md:dark:border-gray-700 md:pr-8"> {/* Span 2 for description */} 
                         <ProfileSection title="About" icon={<HiOutlineInformationCircle />}>
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {startupData.description || 'No description provided.'}
                            </p>
                         </ProfileSection>
                         
                         <ProfileSection title="Links" icon={<HiOutlineLink />} className="mt-6"> 
                             <InfoItem label="Website" value={startupData.website} link={startupData.website || undefined} />
                             <InfoItem label="LinkedIn" value={startupData.linkedin_profile ? 'View Profile' : null} link={startupData.linkedin_profile || undefined} />
                             {/* Add Pitch Deck link later */} 
                         </ProfileSection>
                    </div>
                    
                    {/* Column 2: Key Details */} 
                    <div className="md:col-span-1">
                         <ProfileSection title="Details" icon={<HiTag />}>
                             <InfoItem label="Industry" value={startupData.industry} />
                             <InfoItem label="Sector" value={startupData.sector} />
                             <InfoItem label="Location" value={startupData.location_city} />
                             <InfoItem label="Stage" value={startupData.operational_stage} />
                             {/* Add more fields here: Team Size, Funding, etc. */}
                         </ProfileSection>
                         
                         {/* Placeholder for Metrics/KPIs later */} 
                         {/* <ProfileSection title="Key Metrics" icon={<HiChartBar />} className="mt-6">... </ProfileSection> */}
                    </div>

                </div>
           </div>
        </div>
      )}
      
      {/* Connection Request Modal */}
      <Modal show={showRequestModal} onClose={() => setShowRequestModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Send Connection Request to {startupData?.name}
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="requestMessage" value="Add a personal message (Optional)" />
              </div>
              <Textarea
                id="requestMessage"
                placeholder="e.g., Hi [Startup Name], I'm interested in learning more about..."
                rows={4}
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
              />
            </div>
             <div className="w-full">
              <Button onClick={handleConnect} isProcessing={isConnecting} disabled={isConnecting} className="w-full">
                Send Request
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewStartupProfilePage; 