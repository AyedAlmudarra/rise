import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Badge, Button, Dropdown, Spinner, Alert } from 'flowbite-react';
import SimpleBar from 'simplebar-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient'; // Adjust path if necessary
import { useAuth } from '@/context/AuthContext'; // Adjust path if necessary
import { AppNotification } from '@/types/database'; // Adjust path if necessary
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

// Component's internal notification structure
interface NotificationType {
  id: string; // uuid from DB
  icon: string; // Iconify name (e.g., 'solar:bell-line-duotone')
  bgcolor: string; // Tailwind BG class (e.g., 'bg-lightprimary')
  color: string; // Tailwind text class (e.g., 'text-primary')
  title: string;
  subtitle: string; // Mapped from DB 'body'
  time: string; // Formatted timestamp
  read: boolean; // Mapped from DB 'is_read'
  link?: string | null; // Optional link
}

// Helper to map DB notification to component type
const mapAppNotificationToComponentType = (appNotification: AppNotification): NotificationType => {
  return {
    id: appNotification.id,
    icon: appNotification.icon || 'solar:bell-line-duotone', // Default icon
    bgcolor: appNotification.icon_bg_color || 'bg-gray-100 dark:bg-gray-700', // Default BG
    color: appNotification.icon_color || 'text-gray-500 dark:text-gray-400', // Default color
    title: appNotification.title,
    subtitle: appNotification.body,
    time: appNotification.created_at ? formatDistanceToNow(new Date(appNotification.created_at), { addSuffix: true }) : 'just now',
    read: appNotification.is_read,
    link: appNotification.link,
  };
};


const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch count of unread notifications
      const { error: countError, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true }) // Only get count
        .eq('user_id', user.id)
        .eq('is_read', false);

       if (countError) throw countError;

        // Fetch the latest notifications overall for display
        const { data: displayData, error: displayError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10); // Limit display

        if (displayError) throw displayError;


      setNotifications(displayData.map(mapAppNotificationToComponentType));
      setUnreadCount(count ?? 0); // Use the count of unread notifications

    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications.");
      // toast.error("Could not fetch notifications."); // Maybe too noisy
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    // Set up Realtime subscription
    if (user) {
        const channel = supabase
            .channel(`public:notifications:user_id=eq.${user.id}`)
            .on<AppNotification>(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, // Listen to all changes
                (payload) => {
                    console.log('Notification change detected:', payload);
                    // Refetch on any change for simplicity, could optimize later
                    fetchNotifications();
                    // Optionally show toast only for INSERT
                    if (payload.eventType === 'INSERT') {
                         toast.success(`New notification: ${payload.new.title}`);
                    }
                }
            )
            .subscribe((status, err) => {
                 if (status === 'SUBSCRIBED') {
                    console.log('Subscribed to notification changes!');
                 } else if (err) {
                    console.error('Realtime subscription error:', err);
                    setError('Realtime connection failed. Refresh may be needed.');
                 }
            });

        // Cleanup function
        return () => {
            supabase.removeChannel(channel).catch(err => console.error("Error removing channel", err));
        };
    }

  }, [user, fetchNotifications]);

  const handleMarkAllRead = async () => {
    if (!user || unreadCount === 0) return;

    const originalNotifications = [...notifications];
    const originalUnreadCount = unreadCount;

    // Optimistic UI update
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    const toastId = toast.loading('Marking all as read...');

    try {
      const { error: rpcError } = await supabase.rpc('mark_all_notifications_read');
      if (rpcError) throw rpcError;
      toast.success('All notifications marked as read.', { id: toastId });
    } catch (err: any) {
      console.error("Error marking all notifications as read:", err);
      toast.error(`Failed to mark all as read: ${err.message}`, { id: toastId });
      // Rollback UI on error
      setNotifications(originalNotifications);
      setUnreadCount(originalUnreadCount);
    }
  };

  const handleNotificationClick = async (notification: NotificationType) => {
    if (!user) return;

    const wasRead = notification.read;

    // Optimistic UI update only if marking as read
    if (!wasRead) {
       setUnreadCount(prev => Math.max(0, prev - 1));
       setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
    }

    // Mark as read in backend
    try {
      const { error: rpcError } = await supabase.rpc('mark_notification_read', {
        p_notification_id: notification.id
      });
      if (rpcError) {
          console.error("Failed to mark notification as read in DB:", rpcError);
          // Don't toast here, can be annoying if clicking rapidly
      }
    } catch (err: any) {
         console.error("Error calling mark_notification_read RPC:", err);
    }

    // Navigate if link exists - do this even if DB update fails
    if (notification.link) {
        // Close the dropdown before navigating
        // This might require direct DOM manipulation or a ref, which is complex with Flowbite's Dropdown.
        // For now, navigation will happen, but dropdown might stay open until next click outside.
      navigate(notification.link);
    }
  };

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="w-screen sm:w-[360px] py-6 rounded-sm shadow-lg" // Kept shadow from previous edits
        dismissOnClick={false} // Keep open while interacting
        renderTrigger={() => (
          // Using div structure from old file for trigger area
          <div className="relative">
             <span className="h-10 w-10 hover:bg-lightprimary dark:hover:bg-darkprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary focus:outline-none">
                <Icon icon="solar:bell-bing-line-duotone" height={20} />
             </span>
             {unreadCount > 0 && (
               <span className="rounded-full absolute end-1 top-1 bg-error text-[10px] h-4 w-4 flex justify-center items-center text-white animate-pulse">
                 {unreadCount} {/* Dynamic count */}
               </span>
             )}
           </div>
        )}
      >
        {/* Header section - adjusted padding/margin based on old file structure */}
        <div className="flex items-center px-6 justify-between pb-3 mb-3 border-b dark:border-gray-700">
          <h3 className="mb-0 text-lg font-semibold text-ld dark:text-white">Notifications</h3>
          {unreadCount > 0 && <Badge onClick={handleMarkAllRead} color={'primary'} className="cursor-pointer hover:bg-primary-dark">{unreadCount} new</Badge>}
        </div>

        {/* Content Area */}
        {loading ? (
            <div className="flex justify-center items-center h-40">
               <Spinner aria-label="Loading notifications" />
            </div>
        ) : error ? (
             <div className="px-6 py-4">
                <Alert color="failure" className="items-center">
                    <span><span className="font-medium">Error!</span> {error}</span>
                </Alert>
            </div>
        ) : (
            <SimpleBar className="max-h-80">
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    // Using conditional rendering based on link presence
                    notification.link ? (
                        <Dropdown.Item
                            as={Link}
                            to={notification.link} // Pass link to 'to' prop
                            className={`px-6 py-3 flex items-center bg-hover group/link w-full ${notification.read ? 'opacity-60' : ''}`}
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)} // Still mark as read
                        >
                            {/* Inner layout matching old style - using dynamic data */}
                            <div className="flex items-center w-full">
                                <div className={`h-11 w-11 flex-shrink-0 rounded-full flex justify-center items-center ${notification.bgcolor}`}> 
                                    <Icon icon={notification.icon} height={20} className={notification.color} />
                                </div>
                                <div className="ps-4 flex justify-between w-full items-start">
                                    <div className="w-3/4 text-start">
                                        <h5 className="mb-1 text-sm font-medium group-hover/link:text-primary dark:text-white line-clamp-1"> {/* Added dark text */}
                                            {notification.title}
                                        </h5>
                                        <div className="text-xs text-darklink dark:text-gray-400 line-clamp-2"> {/* Allow 2 lines, added dark text */}
                                            {notification.subtitle}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 block self-start pt-1 whitespace-nowrap"> {/* Added dark text */}
                                        {notification.time}
                                    </div>
                                </div>
                            </div>
                        </Dropdown.Item>
                    ) : (
                        <Dropdown.Item
                            // No 'as' or 'to' prop needed here
                            className={`px-6 py-3 flex items-center bg-hover group/link w-full ${notification.read ? 'opacity-60' : ''}`}
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)} // Only marks as read
                        >
                             {/* Inner layout matching old style - using dynamic data */}
                             <div className="flex items-center w-full">
                                <div className={`h-11 w-11 flex-shrink-0 rounded-full flex justify-center items-center ${notification.bgcolor}`}> 
                                    <Icon icon={notification.icon} height={20} className={notification.color} />
                                </div>
                                <div className="ps-4 flex justify-between w-full items-start">
                                    <div className="w-3/4 text-start">
                                        <h5 className="mb-1 text-sm font-medium group-hover/link:text-primary dark:text-white line-clamp-1"> {/* Added dark text */}
                                            {notification.title}
                                        </h5>
                                        <div className="text-xs text-darklink dark:text-gray-400 line-clamp-2"> {/* Allow 2 lines, added dark text */}
                                            {notification.subtitle}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 block self-start pt-1 whitespace-nowrap"> {/* Added dark text */}
                                        {notification.time}
                                    </div>
                                </div>
                            </div>
                        </Dropdown.Item>
                    )
                ))
            ) : (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Icon icon="solar:bell-off-outline" className="mx-auto mb-2 text-gray-400 dark:text-gray-500" height={32}/>
                    No notifications yet
                </div>
            )}
            </SimpleBar>
        )}

        {/* Footer Button Area - Kept 'Manage Connections' button */}
        <div className="pt-5 px-6 space-y-3">
           <Button
             color={'primary'}
             className="w-full border border-primary text-primary hover:bg-primary hover:text-white"
             pill
             outline
             onClick={() => { toast('Navigate to All Notifications page (TODO)'); console.log("See All Notifications clicked"); }}
           >
              See All Notifications
           </Button>
           {/* Optional: Add back "See All Notifications" if needed later */}
        </div>
      </Dropdown>
    </div>
  );
};

export default Notifications;

