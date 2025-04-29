import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Spinner,
  Alert,
  Button,
  Badge,
  Avatar,
  Modal,
  Textarea,
  Label,
  Breadcrumb
} from 'flowbite-react';
import { supabase } from '@/lib/supabaseClient';
import { InvestorProfile } from '@/types/database';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineOfficeBuilding, HiOutlineLink, HiOutlineChatAlt2, HiCheckCircle, HiBan, HiX, HiExternalLink, HiUserCircle, HiTag, HiPaperClip, HiTrendingUp, HiGlobeAlt, HiHome } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { differenceInDays } from 'date-fns';

// Define connection status types
type ConnectionStatus = 'idle' | 'pending_sent' | 'pending_received' | 'accepted' | 'declined_recent' | 'declined_old' | 'loading' | 'error' | 'self';

// Helper to get Badge color based on type (Consistent with FindInvestorsPage)
const getTypeBadgeColor = (type: 'Personal' | 'Angel' | 'VC' | null): string => {
  switch (type) {
    case 'VC': return 'purple';
    case 'Angel': return 'success';
    case 'Personal': return 'warning';
    default: return 'gray';
  }
};

const ViewInvestorProfilePage: React.FC = () => {
  const { investorId } = useParams<{ investorId: string }>();
  const { user } = useAuth(); // Get current user info if needed later for connect logic
  const [investorData, setInvestorData] = useState<InvestorProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // State for connection status and button interaction
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('loading');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [requestMessage, setRequestMessage] = useState<string>('');

  const profileUserId = investorData?.user_id;
  const currentUserId = user?.id;

  // Fetch Profile Data
  useEffect(() => {
    const fetchInvestorProfile = async () => {
      if (!investorId) {
        setProfileError('Investor User ID not provided in URL.');
        setProfileLoading(false);
        setConnectionStatus('error'); // Cannot determine connection without ID
        return;
      }

      setProfileLoading(true);
      setProfileError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('investors')
          .select('*') // Select all for now, assumes DB has necessary fields
          .eq('user_id', investorId) // Corrected to fetch by user_id
          .single();

        if (fetchError) {
          // Handle case where investor might not be found
          if (fetchError.code === 'PGRST116') { 
             setProfileError('Investor profile not found.');
             setConnectionStatus('error');
          } else {
             throw fetchError;
          }
        }
        setInvestorData(data);
      } catch (err: any) {
        console.error('Error fetching investor profile:', err);
        setProfileError(err.message || 'Failed to fetch investor profile.');
        setConnectionStatus('error');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchInvestorProfile();
  }, [investorId]);

  // Fetch Connection Status - depends on profileUserId and currentUserId
  const fetchConnectionStatus = useCallback(async () => {
    if (!profileUserId || !currentUserId) {
      // If profile user or current user ID is missing, cannot determine status
      // Exception: if profile is loading, status remains 'loading'
      if (!profileLoading) {
         setConnectionStatus(profileUserId === currentUserId ? 'self' : 'idle'); // Set to idle or self if profile loaded but no user/profile ID
      }
      return;
    }

    if (profileUserId === currentUserId) {
        setConnectionStatus('self');
        return;
    }

    setConnectionStatus('loading');

    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('status, requester_user_id, created_at')
        .or(`and(requester_user_id.eq.${currentUserId},recipient_user_id.eq.${profileUserId}),and(requester_user_id.eq.${profileUserId},recipient_user_id.eq.${currentUserId})`)
        .order('created_at', { ascending: false }); // Get latest status first

      if (error) throw error;

      if (data && data.length > 0) {
        const latestRequest = data[0]; // Most recent request between users
        
        if (latestRequest.status === 'accepted') {
          setConnectionStatus('accepted');
        } else if (latestRequest.status === 'pending') {
          if (latestRequest.requester_user_id === currentUserId) {
            setConnectionStatus('pending_sent');
          } else {
            setConnectionStatus('pending_received'); // Or handle appropriately if needed
          }
        } else if (latestRequest.status === 'declined') {
          const declinedDate = new Date(latestRequest.created_at);
          const daysSinceDecline = differenceInDays(new Date(), declinedDate);
          if (daysSinceDecline < 7) {
            setConnectionStatus('declined_recent'); // Within 1 week cooldown
          } else {
            setConnectionStatus('declined_old'); // Cooldown passed, allow reconnect attempt
          }
        } else {
           setConnectionStatus('idle'); // Should not happen with current statuses
        }
      } else {
        // No request history found
        setConnectionStatus('idle');
      }
    } catch (err: any) {
      console.error('Error fetching connection status:', err);
      toast.error('Could not load connection status.');
      setConnectionStatus('error');
    }
  }, [currentUserId, profileUserId, profileLoading]);

  useEffect(() => {
    // Fetch status only when we have both IDs and profile isn't loading
    if (currentUserId && profileUserId && !profileLoading) {
      fetchConnectionStatus();
    }
  }, [currentUserId, profileUserId, profileLoading, fetchConnectionStatus]);

  // Handle Connect button click
  const handleConnect = async () => {
    if (!profileUserId || !currentUserId || profileUserId === currentUserId) return;

    setIsConnecting(true);
    const toastId = toast.loading('Sending connection request...');

    try {
      // Call the Supabase function
      const { error } = await supabase.rpc('create_connection_request', {
        p_recipient_user_id: profileUserId,
        p_request_message: requestMessage || null // Pass message or null
      });

      if (error) {
         // Check for specific error codes from the function
         if (error.message.includes('CONNECTION_ERROR:')) {
             throw new Error(error.message.split('CONNECTION_ERROR: ')[1]); 
         } else {
            throw error; // Rethrow generic errors
         }
      }

      toast.success('Connection request sent!', { id: toastId });
      setConnectionStatus('pending_sent'); // Update status locally
      setShowRequestModal(false); // Close modal on success
      setRequestMessage(''); // Clear message

    } catch (err: any) {
      console.error('Error sending connection request:', err);
      toast.error(`Failed to send request: ${err.message}`, { id: toastId });
    } finally {
      setIsConnecting(false);
    }
  };

  // --- Handle Cancel Request --- 
  const handleCancelRequest = async () => {
    if (!profileUserId || !currentUserId || connectionStatus !== 'pending_sent') return;

    setIsCancelling(true);
    const toastId = toast.loading('Cancelling connection request...');

    try {
      // Assuming an RPC function `cancel_connection_request` exists
      // It should verify auth.uid() matches the requester_user_id of the pending request for the given recipient
      const { error } = await supabase.rpc('cancel_connection_request', {
        p_recipient_user_id: profileUserId
      });

      if (error) {
         // Handle potential specific errors from the function if defined
         if (error.message.includes('CANCEL_ERROR:')) {
            throw new Error(error.message.split('CANCEL_ERROR: ')[1]); 
         } else {
           throw error; // Rethrow generic Supabase errors
         }
      }

      toast.success('Connection request cancelled.', { id: toastId });
      setConnectionStatus('idle'); // Update status locally

    } catch (err: any) {
      console.error('Error cancelling connection request:', err);
      toast.error(`Failed to cancel request: ${err.message}`, { id: toastId });
      // Optionally refetch status on error?
      // fetchConnectionStatus(); 
    } finally {
      setIsCancelling(false);
    }
  };

  // --- Render Connection Button Logic ---
  const renderConnectButton = () => {
    switch (connectionStatus) {
      case 'loading':
        return <Button color="gray" disabled={true}><Spinner size="sm" className="mr-2"/> Loading...</Button>;
      case 'self':
         return <Button as={Link} to="/profile/edit" color="light">Edit Your Profile</Button>; // Example link
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
         // TODO: Link to the connection hub page where they can accept/decline
        return <Button color="info" as={Link} to="/connections?tab=incoming"> Respond to Request</Button>; 
      case 'accepted':
        return <Button color="success" disabled={true}><HiCheckCircle className="mr-2 h-5 w-5" /> Connected</Button>; // Add Message button later
      case 'declined_recent':
        return <Button color="failure" disabled={true}><HiBan className="mr-2 h-5 w-5" /> Declined (Wait)</Button>;
      case 'declined_old': // Cooldown passed, allow new request
      case 'idle':
        return (
          <Button 
            onClick={() => setShowRequestModal(true)} // Open modal first
            color="blue"
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

  // --- Helper Component for Profile Sections --- 
  const ProfileSection: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
    <div className={`mb-6 ${className}`}>
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            {icon && <span className="mr-2 text-blue-500">{icon}</span>}
            {title}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            {children}
        </div>
    </div>
  );
  
  // --- Helper Component for Key-Value Pairs --- 
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

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      {/* --- Loading State --- */}
      {profileLoading && (
        <div className="text-center py-20">
          <Spinner size="xl" color="info" aria-label="Loading investor profile..." />
          <p className="mt-3 text-gray-500 dark:text-gray-400">Loading Profile...</p>
        </div>
      )}

      {/* --- Error State --- */}
      {!profileLoading && profileError && (
        <Alert color="failure" className="max-w-4xl mx-auto">
          <span className="font-medium">Error!</span> {profileError}
        </Alert>
      )}

      {/* --- Profile Display --- */}
      {!profileLoading && !profileError && investorData && (
        <div className="max-w-5xl mx-auto">

          {/* --- Header replicated from FindInvestorsPage --- */}
          <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
             <div className="flex items-center">
               <div className="mr-4 p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg"> 
                  <HiUserCircle size={28} className="text-white" />
               </div>
               <div>
                 <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                   {investorData.full_name || 'Investor Profile'}
                 </h2>
                 <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {investorData.job_title}{investorData.company_name ? ` at ${investorData.company_name}` : ''}
                    {investorData.investor_type ? ` (${investorData.investor_type} Investor)` : ''}
                 </p>
               </div>
             </div>
           </div>

          {/* --- Breadcrumbs --- Moved below header, add margin-top and margin-bottom */} 
          <Breadcrumb aria-label="Profile navigation" className="mt-6 mb-8"> {/* Adjusted margins */} 
            <Breadcrumb.Item href="/startup/dashboard" icon={HiHome}>
               Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/startup/find-investors"> 
              Find Investors
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {investorData.full_name || 'Investor Profile'}
            </Breadcrumb.Item>
          </Breadcrumb>

           {/* --- Main Profile Card --- */}
           <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden p-6 sm:p-8">
                {/* Profile Header (Avatar, Badge, Connect Button) - Removed border-b, increased mb */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8"> 
                   <Avatar 
                     img={`https://ui-avatars.com/api/?name=${encodeURIComponent(investorData.company_name || investorData.full_name || 'I')}&background=random&color=fff`} 
                     rounded 
                     size="xl" 
                     className="ring-4 ring-gray-200 dark:ring-gray-600 shadow-lg mb-4 sm:mb-0 sm:mr-6 flex-shrink-0"
                   />
                   <div className="flex-grow text-center sm:text-left">
                       {/* Name/Title removed as it's in the main header */}
                       {investorData.investor_type && (
                          <Badge color={getTypeBadgeColor(investorData.investor_type)} size="sm" icon={HiUserCircle} className="mt-1">
                             {investorData.investor_type} Investor
                          </Badge>
                       )}
                    </div>
                   <div className="mt-4 sm:mt-0 flex-shrink-0">
                     {renderConnectButton()} 
                   </div>
                </div>
                
                {/* Main Profile Content Grid - Increased gap */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"> 
                    
                    {/* Column 1: Details & Links - Added border & padding */}
                    <div className="md:col-span-1 md:border-r md:border-gray-100 md:dark:border-gray-700 md:pr-8">
                        <ProfileSection title="Contact & Links" icon={<HiOutlineLink />}>
                            <InfoItem label="Company" value={investorData.company_name} />
                            <InfoItem label="Job Title" value={investorData.job_title} />
                            <InfoItem label="Website" value={investorData.website} link={investorData.website || undefined} />
                            <InfoItem label="LinkedIn" value={investorData.linkedin_profile ? 'View Profile' : null} link={investorData.linkedin_profile || undefined} />
                        </ProfileSection>
                        
                        {investorData.company_description && (
                            <ProfileSection title="About / Thesis" icon={<HiOutlineOfficeBuilding />} className="mt-6"> 
                                <p className="whitespace-pre-wrap leading-relaxed">{investorData.company_description}</p> {/* Added leading-relaxed */} 
                            </ProfileSection>
                        )}
                    </div>

                    {/* Column 2 & 3: Preferences */}
                    <div className="md:col-span-2">
                        <ProfileSection title="Investment Preferences" icon={<HiTag />}>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2 text-gray-600 dark:text-gray-400 flex items-center"><HiPaperClip className="mr-1.5"/> Industries</h4>
                                    {investorData.preferred_industries && investorData.preferred_industries.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {investorData.preferred_industries.map(item => <Badge key={item} color="info" size="sm">{item}</Badge>)}
                                        </div>
                                    ) : <p className="text-gray-400 italic text-sm">Not Specified</p>} {/* Added text-sm */} 
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-gray-600 dark:text-gray-400 flex items-center"><HiGlobeAlt className="mr-1.5"/> Geography</h4>
                                    {investorData.preferred_geography && investorData.preferred_geography.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {investorData.preferred_geography.map(item => <Badge key={item} color="success" size="sm">{item}</Badge>)}
                                        </div>
                                    ) : <p className="text-gray-400 italic text-sm">Not Specified</p>} {/* Added text-sm */} 
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-gray-600 dark:text-gray-400 flex items-center"><HiTrendingUp className="mr-1.5"/> Stage</h4>
                                    {investorData.preferred_stage && investorData.preferred_stage.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {investorData.preferred_stage.map(item => <Badge key={item} color="warning" size="sm">{item}</Badge>)}
                                        </div>
                                    ) : <p className="text-gray-400 italic text-sm">Not Specified</p>} {/* Added text-sm */} 
                                </div>
                            </div>
                        </ProfileSection>
                        
                        {/* Placeholder for other sections if needed */} 
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
              Send Connection Request to {investorData?.full_name}
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="requestMessage" value="Add a personal message (Optional)" />
              </div>
              <Textarea
                id="requestMessage"
                placeholder="e.g., Hi [Name], I saw your interest in [Industry] and thought my startup might be relevant..."
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

export default ViewInvestorProfilePage; 