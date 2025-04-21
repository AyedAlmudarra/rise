import React, { useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';

interface ChatMsgInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatMsgInput: React.FC<ChatMsgInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !disabled) {
      event.preventDefault(); // Prevent new line on enter
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <TextInput
        id="chat-message-input"
        placeholder="Type your message..."
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={disabled}
        className="flex-grow"
      />
      <Button 
        color="primary" 
        onClick={handleSend} 
        disabled={disabled || !message.trim()}
        title="Send message"
        className="!p-2"
      >
        <HiOutlinePaperAirplane className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatMsgInput; 