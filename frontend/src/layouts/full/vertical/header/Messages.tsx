import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Badge, Button, Dropdown, Spinner } from 'flowbite-react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext'; // Adjust path as necessary
import { supabase } from '../../../../lib/supabaseClient'; // Adjust path as necessary
import { Conversation, Message } from '../../../../types/chat'; // Adjust path as necessary
import { InvestorProfile, StartupProfile } from '../../../../types/database'; // Adjust path as necessary
import { formatDistanceToNowStrict } from 'date-fns';

// Define a basic structure for a message preview
interface MessagePreviewType {
  id: string; // Use conversation ID as unique key
  senderAvatar: string; // URL to avatar
  senderName: string;
  messageSnippet: string;
  time: string;
  read: boolean; // Indicates if the *last* message in this conversation is read by current user
  onlineStatus?: 'online' | 'offline' | 'away'; // Keep optional status indicator
  conversationId: number; // Store conversation ID for navigation
}

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessagePreviewType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper to fetch profiles (similar to ChatPage/ConnectionsPage)
  const fetchProfilesForUserIds = useCallback(async (
    userIds: string[]
  ): Promise<Map<string, Partial<InvestorProfile & StartupProfile> & { role: 'investor' | 'startup' | 'unknown' }>> => {
      const profilesMap = new Map<string, Partial<InvestorProfile & StartupProfile> & { role: 'investor' | 'startup' | 'unknown' }>();
      if (!userIds || userIds.length === 0) return profilesMap;
      try {
        const { data: investors, error: investorError } = await supabase
            .from('investors')
            .select('user_id, full_name') // Only need name for preview
            .in('user_id', userIds);
        if (investorError) console.error("Messages Dropdown: Error fetching investor profiles:", investorError);
        investors?.forEach(p => profilesMap.set(p.user_id, { ...p, role: 'investor' }));

        const { data: startups, error: startupError } = await supabase
            .from('startups')
            .select('user_id, name, logo_url') // Need name and logo
            .in('user_id', userIds);
        if (startupError) console.error("Messages Dropdown: Error fetching startup profiles:", startupError);
        startups?.forEach(p => {
            if (!profilesMap.has(p.user_id)) {
                profilesMap.set(p.user_id, { ...p, role: 'startup' });
            }
        });
       } catch (err) {
            console.error("Messages Dropdown: Error inside fetchProfilesForUserIds:", err);
       }
       return profilesMap;
  }, []);


  useEffect(() => {
    const fetchMessagePreviews = async () => {
      if (!user) {
        setMessages([]);
        setUnreadCount(0);
        return;
      }

      setIsLoading(true);
      try {
        // 1. Fetch conversations sorted by last message time
        const { data: conversations, error: convoError } = await supabase
          .from('conversations')
          .select('*')
          .or(`participant1_user_id.eq.${user.id},participant2_user_id.eq.${user.id}`)
          .order('last_message_at', { ascending: false, nullsFirst: false })
          .limit(10); // Limit the number of conversations to check/display

        if (convoError) throw convoError;
        if (!conversations || conversations.length === 0) {
          setMessages([]);
          setUnreadCount(0);
          return;
        }

        // 2. Get latest message for each conversation and participant IDs
        const latestMessagesPromises = conversations.map(convo =>
          supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convo.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single() // Expecting only one or null
        );

        const latestMessagesResults = await Promise.all(latestMessagesPromises);

        const otherParticipantIds = conversations.map(convo =>
          convo.participant1_user_id === user.id ? convo.participant2_user_id : convo.participant1_user_id
        );

        // 3. Fetch profiles
        const profilesMap = await fetchProfilesForUserIds(otherParticipantIds.filter((id): id is string => !!id));

        // 4. Combine data and filter for unread
        let currentUnreadCount = 0;
        const previews: MessagePreviewType[] = [];

        conversations.forEach((convo, index) => {
          const latestMessageResult = latestMessagesResults[index];
          if (latestMessageResult.data) {
            const message: Message = latestMessageResult.data;
            const otherUserId = convo.participant1_user_id === user.id ? convo.participant2_user_id : convo.participant1_user_id;
            const profile = otherUserId ? profilesMap.get(otherUserId) : undefined;

            const isUnread = message.sender_user_id !== user.id && message.read_at === null;
            if (isUnread) {
                currentUnreadCount++;
            }

            const senderName = profile?.role === 'investor' ? profile.full_name : profile?.name;
            const avatarUrl = profile?.role === 'startup' ? profile.logo_url : undefined;
            const initials = senderName?.[0]?.toUpperCase() || '?';

            previews.push({
              id: convo.id.toString(), // Use conversation ID for key
              senderAvatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`, // Fallback avatar
              senderName: senderName || 'Unknown User',
              messageSnippet: message.content,
              time: formatDistanceToNowStrict(new Date(message.created_at), { addSuffix: true }),
              read: !isUnread,
              conversationId: convo.id,
              // onlineStatus: ... // TODO: Implement online status if needed
            });
          }
        });

        setMessages(previews);
        setUnreadCount(currentUnreadCount);

      } catch (error: any) {
        console.error('Error fetching message previews:', error);
        setMessages([]);
        setUnreadCount(0);
        // Optionally show an error state in the dropdown
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessagePreviews();

    // Optional: Set up a listener or interval for real-time updates?
    // For now, just fetch on user change.

  }, [user, fetchProfilesForUserIds]); // Depend on user and the memoized fetcher

  const handleMessageClick = (message: MessagePreviewType) => {
    // Basic navigation, ChatPage handles marking as read on load
    console.log('Message clicked, navigating to conversation:', message.conversationId);
    navigate('/messages', { state: { selectedConversationId: message.conversationId } }); 
    // Note: Passing state might not directly work if ChatPage doesn't read it.
    // A simpler approach is just navigate('/messages') and let user select.
    // Let's stick to simple navigation for now:
    // navigate('/messages'); 
    // Reverting to passing state, assuming ChatPage *might* use it or be updated later.

    // Optimistically mark as read in UI immediately if needed
    if (!message.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
        setMessages(messages.map(m => m.id === message.id ? { ...m, read: true } : m));
    }
  };

  const getStatusColor = (status?: 'online' | 'offline' | 'away') => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-transparent';
    }
  };


  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="w-screen sm:w-[360px] py-6 rounded-sm shadow-lg" // Adjusted styling
        dismissOnClick={true} // Close dropdown when item is clicked
        renderTrigger={() => (
          <button className="relative h-10 w-10 hover:bg-lightprimary dark:hover:bg-darkprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary focus:outline-none">
            <Icon icon="solar:chat-round-line-line-duotone" height={20} />
            {unreadCount > 0 && (
              <span className="rounded-full absolute end-1 top-1 bg-primary text-[10px] h-4 w-4 flex justify-center items-center text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      >
        <div className="flex items-center px-6 justify-between border-b pb-3 mb-3 dark:border-gray-700">
          <h3 className="mb-0 text-lg font-semibold text-ld dark:text-white">Messages</h3>
          {unreadCount > 0 && <Badge color={'warning'}>{unreadCount} new</Badge>}
        </div>

        <SimpleBar className="max-h-80">
           {isLoading ? (
               <div className="px-6 py-8 text-center">
                   <Spinner size="sm"/>
                   <p className="text-xs text-gray-400 mt-2">Loading messages...</p>
               </div>
           ) : messages.length > 0 ? (
                messages.map((message) => (
                    <Dropdown.Item
                    // Use onClick handler for navigation + state update
                    // Removed 'as={Link}' and 'to' props
                    className={`px-6 py-3 flex items-center bg-hover group/link w-full ${!message.read ? 'font-semibold' : ''}`} // Highlight unread
                    key={message.id} // Use conversation ID string
                    onClick={() => handleMessageClick(message)} // Handle read marking and navigation
                    >
                    <div className="flex-shrink-0 relative">
                        <img
                        src={message.senderAvatar} // Use dynamic avatar
                        width={45}
                        height={45}
                        alt={`${message.senderName} avatar`}
                        className="rounded-full"
                        />
                        {message.onlineStatus && (
                            <i className={`h-2.5 w-2.5 rounded-full absolute end-0 bottom-0 border-2 border-white dark:border-gray-800 ${getStatusColor(message.onlineStatus)}`}></i>
                        )}
                    </div>
                    <div className="ps-4 flex justify-between w-full items-start">
                        <div className="w-3/4">
                            <h5 className={`mb-1 text-sm group-hover/link:text-primary dark:text-white ${!message.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                {message.senderName}
                            </h5>
                            <span className={`text-xs block truncate ${!message.read ? 'text-gray-700 dark:text-gray-200' : 'text-darklink dark:text-gray-400'}`}>
                                {message.messageSnippet}
                            </span>
                        </div>
                        <span className={`text-xs block self-start pt-1 ${!message.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                            {message.time}
                        </span>
                    </div>
                    </Dropdown.Item>
                ))
            ) : (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Icon icon="solar:chat-line-broken" className="mx-auto mb-2 text-gray-400 dark:text-gray-500" height={32}/>
                    No recent messages
                </div>
            )}
        </SimpleBar>
        <div className="pt-5 px-6">
          <Button
            color={'primary'}
            className="w-full border border-primary text-primary hover:bg-primary hover:text-white"
            pill
            outline
            // Link to the main messages page
             as={Link} to="/messages"
          >
            See All Messages
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Messages;
