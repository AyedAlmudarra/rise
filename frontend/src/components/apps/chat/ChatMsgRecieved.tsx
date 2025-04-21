import React from 'react';

interface ChatMsgRecievedProps {
  senderName?: string;
  thumb?: string;
  msg: string;
  time: string;
}

const ChatMsgRecieved: React.FC<ChatMsgRecievedProps> = ({ senderName, thumb, msg, time }) => {
  return (
    <div className="flex items-start gap-3 mb-4 justify-start">
      {/* Placeholder for avatar/thumbnail */}
      {thumb ? (
          <img src={thumb} alt={senderName || 'avatar'} className="h-10 w-10 rounded-full object-cover" />
      ) : (
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
              {(senderName || '?')[0]}
          </div>
      )}
      {/* Message Bubble */}
      <div className="max-w-xs md:max-w-md">
         {senderName && (
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{senderName}</p>
         )}
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-tl-none">
          <p className="text-sm text-gray-800 dark:text-gray-100">{msg}</p>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-left">{time}</p>
      </div>
    </div>
  );
};

export default ChatMsgRecieved; 