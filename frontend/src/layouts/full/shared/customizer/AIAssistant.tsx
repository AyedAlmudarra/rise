import React from "react";
import { Button, Drawer } from "flowbite-react";
import { useState } from "react";
import { IconRobot, IconSend, IconRefresh } from "@tabler/icons-react";
import SimpleBar from "simplebar-react";
import { useAIAssistant } from "@/context/AIAssistantContext";
import ReactMarkdown from 'react-markdown';

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const { messages, processing, sendMessage, clearConversation } = useAIAssistant();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <div>
        <Button
          color={"primary"}
          className="h-14 w-14 flex justify-center items-center fixed bottom-6 end-6 rounded-full hover:bg-primaryemphasis"
          onClick={() => setIsOpen(true)}
        >
          <IconRobot />
        </Button>
      </div>
      <Drawer
        open={isOpen}
        onClose={handleClose}
        position="right"
        className="dark:bg-darkgray max-w-[350px] w-full"
      >
        <div className="border-ld border-b">
          <div className="flex justify-between items-center p-4">
            <h5 className="text-xl flex items-center gap-2">
              <IconRobot className="text-blue-500" />
              RISE AI Assistant
            </h5>
          </div>
        </div>
        <SimpleBar className="h-[calc(100vh-180px)]">
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'assistant' 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.role === 'assistant' ? (
                      <IconRobot size={16} className="text-blue-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-blue-200"></div>
                    )}
                    <span className="text-xs font-medium">
                      {message.role === 'assistant' ? 'RISE AI' : 'You'}
                    </span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SimpleBar>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-3">
            <Button 
              size="xs" 
              color="light" 
              onClick={clearConversation}
              className="flex items-center gap-1"
            >
              <IconRefresh size={14} />
              <span>Reset Conversation</span>
            </Button>
          </div>
          <div className="flex items-end gap-2">
            <textarea
              className="resize-none w-full p-2.5 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type your message..."
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={processing}
            />
            <Button
              color="primary"
              size="sm"
              disabled={processing || input.trim() === ""}
              onClick={handleSend}
              className="px-3 py-2 h-10"
            >
              <IconSend size={16} />
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}; 