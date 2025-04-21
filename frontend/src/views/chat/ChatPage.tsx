import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { StartupProfile, InvestorProfile } from '../../types/database';
import { Spinner, Alert, Avatar, TextInput } from 'flowbite-react';
import { formatDistanceToNowStrict, format } from 'date-fns';
import ChatMsgSent from '../../components/apps/chat/ChatMsgSent';
import ChatMsgRecieved from '../../components/apps/chat/ChatMsgRecieved';
import ChatMsgInput from '../../components/apps/chat/ChatMsgInput';
import UserProfileModal from '../../components/common/UserProfileModal';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { HiOutlineChatAlt2, HiOutlineSearch } from 'react-icons/hi';

// Define a type combining backend Conversation structure with Profile for display
// Reverted: Removed last message details as columns don't exist
interface DisplayedChatsType {
  id: number;
  created_at: string;
  participant1_user_id: string;
  participant2_user_id: string;
  last_message_at: string | null;
  other_participant_profile: Partial<InvestorProfile & StartupProfile> & {
    user_id: string;
    role: 'investor' | 'startup' | 'unknown';
    display_name: string;
    avatar_url?: string | null;
  };
}

// Define the actual DB Message type matching Supabase table
interface DbMessageType {
    id: number;
    created_at: string;
    conversation_id: number;
    sender_user_id: string;
    content: string;
    read_at: string | null;
}

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [displayedConversations, setDisplayedConversations] = useState<DisplayedChatsType[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<DbMessageType[]>([]);
  const [loadingConversations, setLoadingConversations] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversationSearchTerm, setConversationSearchTerm] = useState('');
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // State for profile modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [profileModalUserId, setProfileModalUserId] = useState<string | null>(null);

  // --- Fetching Logic ---
  const fetchParticipantProfiles = useCallback(async (userIds: string[]):
     Promise<Map<string, Partial<StartupProfile & InvestorProfile> & { role: 'startup' | 'investor' | 'unknown' }>> => {
        const profilesMap = new Map<string, Partial<StartupProfile & InvestorProfile> & { role: 'startup' | 'investor' | 'unknown' }>();
        if (!userIds || userIds.length === 0) return profilesMap;
        try {
            const { data: investors, error: investorError } = await supabase
                .from('investors')
                .select('user_id, full_name, company_name') // Fetch necessary fields
                .in('user_id', userIds);
            if (investorError) console.error("Error fetching investor profiles for chat:", investorError);
            investors?.forEach(p => profilesMap.set(p.user_id, { ...p, role: 'investor' }));

            const { data: startups, error: startupError } = await supabase
                .from('startups')
                .select('user_id, name, logo_url') // Fetch necessary fields
                .in('user_id', userIds);
            if (startupError) console.error("Error fetching startup profiles for chat:", startupError);
            startups?.forEach(p => {
                if (!profilesMap.has(p.user_id)) {
                    profilesMap.set(p.user_id, { ...p, role: 'startup' });
                }
            });
        } catch (err) {
            console.error("Error inside fetchParticipantProfiles:", err);
        }
        return profilesMap;
  }, []);

  const fetchConversationsAndProfiles = useCallback(async () => {
    if (!user) return;

    setLoadingConversations(true);
    setConversationsError(null);
    setDisplayedConversations([]);

    try {
        // 1. Fetch accepted connection user IDs
        const { data: connections, error: connectionError } = await supabase
            .from('connection_requests')
            .select('requester_user_id, recipient_user_id')
            .eq('status', 'accepted')
            .or(`requester_user_id.eq.${user.id},recipient_user_id.eq.${user.id}`);

        if (connectionError) {
             console.error("Error fetching connections:", connectionError);
             throw new Error('Failed to fetch connection status.');
        }
        if (!connections || connections.length === 0) {
            setDisplayedConversations([]);
            return;
        }

        // 2. Create a set of connected user IDs
        const connectedUserIds = new Set<string>();
        connections.forEach(conn => {
            if (conn.requester_user_id !== user.id) connectedUserIds.add(conn.requester_user_id);
            if (conn.recipient_user_id !== user.id) connectedUserIds.add(conn.recipient_user_id);
        });

        if (connectedUserIds.size === 0) {
             setDisplayedConversations([]);
             return;
        }

        const connectedUserIdsArray = Array.from(connectedUserIds);
        const simplerFormattedIds = `(${connectedUserIdsArray.join(',')})`;

        // 3. Fetch conversations - Reverted to select('*')
        const filterString = `and(participant1_user_id.eq.${user.id},participant2_user_id.in.${simplerFormattedIds}),and(participant2_user_id.eq.${user.id},participant1_user_id.in.${simplerFormattedIds})`;

        const { data: conversationsData, error: convoError } = await supabase
            .from('conversations')
            .select('*') // Reverted: Select all standard columns
            .or(filterString)
            .order('last_message_at', { ascending: false, nullsFirst: false });

        if (convoError) {
            console.error("Error fetching filtered conversations:", convoError, "Filter:", filterString);
            throw new Error('Failed to fetch conversations.');
        }
        if (!conversationsData || conversationsData.length === 0) {
            setDisplayedConversations([]);
            return;
        }

        // 4. Fetch profiles for the actual other participants
        const actualOtherParticipantIds = conversationsData.map(convo =>
            convo.participant1_user_id === user.id ? convo.participant2_user_id : convo.participant1_user_id
        );

        const profilesMap = await fetchParticipantProfiles(actualOtherParticipantIds);

        // 5. Map raw data using the reverted DisplayedChatsType
        const combinedData: DisplayedChatsType[] = conversationsData.map((convo) => {
            const otherUserId = convo.participant1_user_id === user.id
                ? convo.participant2_user_id
                : convo.participant1_user_id;

            const profile = profilesMap.get(otherUserId);
            const role = profile?.role || 'unknown';
            const displayName = role === 'investor' ? profile?.full_name : profile?.name;
            const avatarUrl = role === 'startup' ? profile?.logo_url : undefined;

            // Reverted: No need for type casting, just return standard fields
            return {
                id: convo.id,
                created_at: convo.created_at,
                participant1_user_id: convo.participant1_user_id,
                participant2_user_id: convo.participant2_user_id,
                last_message_at: convo.last_message_at,
                other_participant_profile: {
                    user_id: otherUserId,
                    role: role,
                    display_name: displayName || 'Unknown User',
                    avatar_url: avatarUrl,
                    ...(profile || {}),
                }
            };
        });

        setDisplayedConversations(combinedData);

    } catch (err: any) {
        console.error("Error in fetchConversationsAndProfiles:", err);
        setConversationsError(err.message || "Failed to load conversations due to an unexpected error.");
        setDisplayedConversations([]);
    } finally {
        setLoadingConversations(false);
    }
  }, [user, fetchParticipantProfiles]);

  // --- Effects ---
  useEffect(() => {
    fetchConversationsAndProfiles();
  }, [fetchConversationsAndProfiles]); // Run when function reference changes (includes user dependency)

  useEffect(() => { // Fetch messages and mark read
    const fetchMessagesAndMarkRead = async () => {
        if (!selectedConversationId || !user) {
            setMessages([]);
            return;
        }
        setLoadingMessages(true);
        setMessagesError(null);
        setMessages([]);
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', selectedConversationId)
                .order('created_at', { ascending: true });
            if (error) throw error;
            const fetchedMessages: DbMessageType[] = data || [];
            setMessages(fetchedMessages);

            const unreadMessageIds = fetchedMessages
                .filter(msg => msg.sender_user_id !== user.id && msg.read_at === null)
                .map(msg => msg.id);
            if (unreadMessageIds.length > 0) {
                const { error: updateError } = await supabase
                    .from('messages')
                    .update({ read_at: new Date().toISOString() })
                    .in('id', unreadMessageIds);
                if (updateError) {
                    console.error("Error marking messages as read:", updateError);
                }
            }
        } catch (err: any) {
            console.error("Error fetching messages:", err);
            setMessagesError("Failed to load messages: " + err.message);
        } finally {
            setLoadingMessages(false);
        }
    };
    fetchMessagesAndMarkRead();
  }, [selectedConversationId, user]);

  useEffect(() => { // Scroll to bottom
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => { // Real-time subscription
    if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
    }
    if (!selectedConversationId || !user) {
        return;
    }
    const channel = supabase.channel(`messages_conv_${selectedConversationId}`);
    channelRef.current = channel;

    const handleNewMessage = (payload: any) => {
      const newMessage = payload.new as DbMessageType;
      if (newMessage && newMessage.sender_user_id !== user.id && newMessage.conversation_id === selectedConversationId) {
        // Check if message already exists (Realtime can sometimes send duplicates)
        setMessages((prevMessages) => {
            if (!prevMessages.find(msg => msg.id === newMessage.id)) {
                return [...prevMessages, newMessage];
            }
            return prevMessages;
        });
        // TODO: Optionally mark as read immediately if window is focused?
      }
    };

    const handleMessageUpdate = (payload: any) => {
        const updatedMessage = payload.new as DbMessageType;
        // Check if it's a message sent by the current user and it has been read
        if (updatedMessage && updatedMessage.sender_user_id === user.id && updatedMessage.read_at) {
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === updatedMessage.id ? { ...msg, read_at: updatedMessage.read_at } : msg
                )
            );
        }
    };

    channel
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversationId}` },
            handleNewMessage
        )
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversationId}` },
            handleMessageUpdate // Add handler for UPDATE events
        )
        .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
                console.log(`Subscribed to messages for conversation ${selectedConversationId}`);
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                 console.error('Subscription error:', status, err);
                 setMessagesError(`Real-time connection issue: ${err?.message || status}. Try refreshing.`);
            } else if (status === 'CLOSED'){
                 console.log(`Subscription closed for conversation ${selectedConversationId}`);
            }
        });

    // Cleanup function
    return () => {
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current)
                .then(() => console.log(`Unsubscribed from ${channelRef.current?.topic}`))
                .catch(err => console.error("Error unsubscribing:", err));
            channelRef.current = null;
        }
    };
  }, [selectedConversationId, user]); // Dependencies

  // --- Handlers ---
  const handleSendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim() || !selectedConversationId || !user) return;
    setIsSending(true);
    setMessagesError(null);
    const newMessagePayload: Omit<DbMessageType, 'id' | 'created_at' | 'read_at'> = {
        conversation_id: selectedConversationId,
        sender_user_id: user.id,
        content: messageContent.trim(),
    };
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert(newMessagePayload)
            .select()
            .single();
        if (error) throw error;
        if (data) {
            setMessages(prevMessages => [...prevMessages, data as DbMessageType]);
        } else {
            console.warn('Message insert seemed successful but no data returned.');
        }
    } catch (err: any) {
        console.error("Error sending message:", err);
        setMessagesError("Failed to send message: " + err.message);
    } finally {
        setIsSending(false);
    }
  }, [selectedConversationId, user]);

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    // Close profile modal if open when switching conversations
    setIsProfileModalOpen(false);
    setProfileModalUserId(null);
  };

  // Handler to open profile modal
  const handleOpenProfileModal = (userId: string | undefined) => {
    if (userId) {
      setProfileModalUserId(userId);
      setIsProfileModalOpen(true);
    }
  };

  // Handler to close profile modal
  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setProfileModalUserId(null);
  };

  // --- Filtering Logic ---
  const filteredConversations = useMemo(() => {
      const searchTermLower = conversationSearchTerm.toLowerCase();
      if (!searchTermLower) {
          return displayedConversations;
      }
      return displayedConversations.filter(convo =>
          convo.other_participant_profile.display_name.toLowerCase().includes(searchTermLower)
      );
  }, [displayedConversations, conversationSearchTerm]);

  // --- Rendering Logic ---
  const selectedConversationDetails = displayedConversations.find(c => c.id === selectedConversationId);
  const otherParticipant = selectedConversationDetails?.other_participant_profile;

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
        <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
                <div className="mr-4 p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg">
                    <HiOutlineChatAlt2 size={28} className="text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                        Chat
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Connect and message with investors and startups.
                    </p>
                </div>
            </div>
        </div>

        <div className="flex flex-grow overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <div className="w-1/4 min-w-[250px] max-w-[350px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
               <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                 <TextInput
                     id="conversationSearch"
                     type="text"
                     icon={HiOutlineSearch}
                     placeholder="Search conversations..."
                     value={conversationSearchTerm}
                     onChange={(e) => setConversationSearchTerm(e.target.value)}
                     sizing="sm"
                 />
               </div>

               <div className="flex-grow overflow-y-auto p-2">
                   {loadingConversations ? (
                       <div className="p-4 text-center"><Spinner /></div>
                   ) : conversationsError ? (
                       <Alert color="failure" className="m-4">{conversationsError}</Alert>
                   ) : displayedConversations.length === 0 ? (
                       <p className="p-4 text-center text-gray-500 dark:text-gray-400">No connections to chat with yet.</p>
                   ) : filteredConversations.length === 0 ? (
                       <p className="p-4 text-center text-gray-500 dark:text-gray-400">No matching conversations found.</p>
                   ) : (
                       <div className="space-y-1">
                           {filteredConversations.map(convo => {
                                const otherP = convo.other_participant_profile;
                                const initials = otherP.display_name?.[0]?.toUpperCase() || '?';
                                const lastMsgTime = convo.last_message_at
                                    ? formatDistanceToNowStrict(new Date(convo.last_message_at), { addSuffix: true })
                                    : null;

                               return (
                                   <div
                                       key={convo.id}
                                       onClick={() => handleSelectConversation(convo.id)}
                                       className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedConversationId === convo.id ? 'bg-blue-50 dark:bg-gray-700/50' : ''}`}
                                   >
                                      <Avatar
                                          img={otherP.avatar_url || undefined}
                                          placeholderInitials={initials}
                                          rounded
                                          size="md"
                                      />
                                      <div className="flex-grow min-w-0">
                                          <div className="flex justify-between items-center">
                                               <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{otherP.display_name}</p>
                                               {lastMsgTime && (
                                                   <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">{lastMsgTime}</p>
                                               )}
                                          </div>
                                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                              Last message snippet...
                                          </p>
                                      </div>
                                   </div>
                               );
                           })}
                       </div>
                   )}
               </div>
            </div>

            <div className="flex-grow flex flex-col bg-white dark:bg-gray-800">
               {selectedConversationId && otherParticipant ? (
                    <>
                       <div
                          className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                          onClick={() => handleOpenProfileModal(otherParticipant.user_id)}
                       >
                             <Avatar
                                 img={otherParticipant.avatar_url || undefined}
                                 placeholderInitials={otherParticipant.display_name?.[0]?.toUpperCase() || '?'}
                                 rounded
                                 size="md"
                              />
                              <h3 className="font-semibold text-gray-900 dark:text-white">{otherParticipant.display_name}</h3>
                       </div>

                       <div className="flex-grow overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-900">
                            {loadingMessages ? (
                               <div className="p-4 text-center"><Spinner /></div>
                            ) : messagesError ? (
                               <Alert color="failure" className="m-4">{messagesError}</Alert>
                            ) : messages.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No messages in this conversation yet.</p>
                            ) : (
                                <>
                                    {messages.map(msg => {
                                        const formattedTime = format(new Date(msg.created_at), 'p');
                                        const isSentByUser = msg.sender_user_id === user?.id;

                                        const messageProps = {
                                            msg: msg.content,
                                            time: formattedTime,
                                        };

                                        return isSentByUser ? (
                                            <ChatMsgSent
                                                key={msg.id}
                                                {...messageProps}
                                                readAt={msg.read_at}
                                            />
                                        ) : (
                                            <ChatMsgRecieved
                                                key={msg.id}
                                                {...messageProps}
                                                senderName={otherParticipant.display_name}
                                                thumb={otherParticipant.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.display_name[0] || '?')}`}
                                            />
                                        );
                                    })}
                                    <div ref={messageEndRef} />
                                </>
                            )}
                       </div>

                       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                           <ChatMsgInput
                                onSend={handleSendMessage}
                                disabled={isSending || loadingMessages}
                           />
                           {isSending && <p className="text-xs text-gray-400 mt-1">Sending...</p>}
                       </div>
                    </>
               ) : (
                    <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                       <p className="text-gray-500 dark:text-gray-400">Select a conversation to start chatting.</p>
                    </div>
               )}
            </div>
        </div>

        {/* Render the Profile Modal */}
         <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
          userId={profileModalUserId}
        />
    </div>
  );
};

export default ChatPage; 