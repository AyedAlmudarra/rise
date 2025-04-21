import React from 'react';
import { HiCheckCircle } from 'react-icons/hi';

interface ChatMsgSentProps {
  msg: string;
  time: string;
  readAt: string | null;
}

const ChatMsgSent: React.FC<ChatMsgSentProps> = ({ msg, time, readAt }) => {
  return (
    <div className="flex items-start gap-3 mb-4 justify-end">
      {/* Message Bubble (Right Aligned) */}
      <div className="max-w-xs md:max-w-md">
        <div className="bg-blue-500 text-white p-3 rounded-lg rounded-tr-none shadow">
          <p className="text-sm">{msg}</p>
        </div>
        {/* Timestamp and Read Receipt */}
        <div className="flex items-center justify-end mt-1 gap-1">
          {/* Show read check only if readAt is not null */}
          {readAt && (
            <HiCheckCircle className="h-3.5 w-3.5 text-blue-400 dark:text-blue-300" title={`Read at ${new Date(readAt).toLocaleTimeString()}`} />
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500">{time}</p>
        </div>
      </div>
      {/* Optional: Add avatar for current user if desired, but often omitted for sent messages */}
      {/* 
      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Me
      </div> 
      */}
    </div>
  );
};

export default ChatMsgSent; 