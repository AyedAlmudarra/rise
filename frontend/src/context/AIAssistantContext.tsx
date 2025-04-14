import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantContextProps {
  messages: Message[];
  processing: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextProps | undefined>(undefined);

export const AIAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to RISE AI! How can I assist you today based on your profile?'
    }
  ]);
  const [processing, setProcessing] = useState(false);

  const sendMessage = async (message: string) => {
    if (message.trim() === '') return;
    
    const newUserMessage: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, newUserMessage]);
    setProcessing(true);

    try {
      const session = await supabase.auth.getSession();
      const token = session?.data?.session?.access_token;

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      // Prepare conversation history (current state BEFORE adding the new message)
      const conversationHistoryForBackend = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      // Add the new user message that triggered this call
      conversationHistoryForBackend.push(newUserMessage);

      // Call Supabase Edge Function WITH explicit Authorization header
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        headers: {
          'Authorization': `Bearer ${token}` // Pass token
        },
        body: { messages: conversationHistoryForBackend } // Send the history including the latest message
      });

      if (error) {
        console.error('Error calling AI assistant:', error);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'I encountered an error processing your request. Please try again later.' }
        ]);
      } else if (data && data.message) {
        // Add the AI response to the state
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('Error in AI Assistant sendMessage:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, something went wrong: ${errorMessage}` }
      ]);
    } finally {
      setProcessing(false);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Welcome to RISE AI! How can I assist you today based on your profile?'
      },
    ]);
  };

  return (
    <AIAssistantContext.Provider value={{ messages, processing, sendMessage, clearConversation }}>
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = (): AIAssistantContextProps => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};

export default AIAssistantProvider; 