import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Badge, Button, Dropdown } from 'flowbite-react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Link } from 'react-router-dom';

// Define a basic structure for a message preview (adjust as needed)
interface MessagePreviewType {
  id: string;
  senderAvatar: string; // URL to avatar
  senderName: string;
  messageSnippet: string;
  time: string;
  read: boolean;
  onlineStatus?: 'online' | 'offline' | 'away'; // Optional status indicator
  conversationLink: string; // Link to the full conversation
}

const Messages = () => {
  const [messages, setMessages] = useState<MessagePreviewType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    // TODO: Fetch recent message previews from backend/API here
    // Example: fetchMessages().then(data => { setMessages(data.items); setUnreadCount(data.unread); });
    // For now, we'll keep it empty
    setMessages([]);
    setUnreadCount(0); // Example: Initialize with 0 unread
  }, []); // Fetch on mount

  const handleMessageClick = (message: MessagePreviewType) => {
    // TODO: Implement logic to mark message/conversation as read in backend if needed
    // This might happen automatically when navigating to the conversation
    console.log('Message clicked, navigating to:', message.conversationLink);
    // Navigation will be handled by the Link component
    if (!message.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
        setMessages(messages.map(m => m.id === message.id ? { ...m, read: true } : m));
    }
  };

  const getStatusColor = (status?: 'online' | 'offline' | 'away') => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-gray-400'; // Or bg-error for emphasis?
      default: return 'bg-transparent'; // No indicator if undefined
    }
  };


  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="w-screen sm:w-[360px] py-6 rounded-sm shadow-lg" // Added shadow
        dismissOnClick={false} // Keep open until explicitly closed or navigated
        renderTrigger={() => (
          <button className="relative h-10 w-10 hover:bg-lightprimary dark:hover:bg-darkprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary focus:outline-none">
             {/* Changed icon to a more common message icon */}
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
           {messages.length > 0 ? (
            messages.map((message) => (
                <Dropdown.Item
                as={Link} // Always link to the conversation
                to={message.conversationLink}
                className={`px-6 py-3 flex items-center bg-hover group/link w-full ${!message.read ? 'font-semibold' : ''}`} // Highlight unread
                key={message.id}
                onClick={() => handleMessageClick(message)} // Handle potential read marking
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
                No new messages
            </div>
            )}
        </SimpleBar>
        <div className="pt-5 px-6">
          <Button
            color={'primary'}
            className="w-full border border-primary text-primary hover:bg-primary hover:text-white"
            pill
            outline
            // TODO: Link this button to a dedicated "All Messages" inbox page
             as={Link} to="/messages/inbox" // Example link
          >
            See All Messages
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Messages;
