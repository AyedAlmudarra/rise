'use client'
import { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import React from "react";
import useSWR from 'swr';
import { ChatsType, MessageType } from '../../types/apps/chat';
import { getFetcher, postFetcher } from 'src/api/globalFetcher';


// Define context props interface
export interface ChatContextProps {
    chatData: ChatsType[];
    chatContent: MessageType[];
    chatSearch: string;
    selectedChat: ChatsType | null;
    loading: boolean;
    error: string;
    activeChatId: number | null;
    setChatContent: Dispatch<SetStateAction<MessageType[]>>;
    setChatSearch: Dispatch<SetStateAction<string>>;
    setSelectedChat: Dispatch<SetStateAction<ChatsType | null>>;
    setActiveChatId: Dispatch<SetStateAction<number | null>>;
    sendMessage: (chatId: number | string, message: MessageType) => void;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<string>>;
}

// Create the context
export const ChatContext = createContext<ChatContextProps>({
    chatData: [],
    chatContent: [],
    chatSearch: '',
    selectedChat: null,
    loading: true,
    error: '',
    activeChatId: null,
    setChatContent: () => { },
    setChatSearch: () => { },
    setSelectedChat: () => { },
    setActiveChatId: () => { },
    sendMessage: () => { },
    setLoading: () => { },
    setError: () => { },
});

// Create the provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chatData, setChatData] = useState<ChatsType[]>([]);
    const [chatContent, setChatContent] = useState<MessageType[]>([]);
    const [chatSearch, setChatSearch] = useState<string>('');
    const [selectedChat, setSelectedChat] = useState<ChatsType | null>(null);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const { data: ChatsData, isLoading: isChatsLoading, error: ChatsError, mutate } = useSWR('/api/data/chat/ChatData', getFetcher);

    // Fetch chat data from the API
    useEffect(() => {
        setLoading(isChatsLoading);
        setError('');

        if (ChatsData) {
            const chatsData: ChatsType[] = ChatsData.data;
            if (chatData.length === 0 && chatsData && chatsData.length > 0) {
                let specificChat = chatsData[0];
                setSelectedChat(specificChat);
                let initialChatId: number | null = null;
                if (typeof specificChat.id === 'number') {
                    initialChatId = specificChat.id;
                } else if (typeof specificChat.id === 'string') {
                    const parsedId = parseInt(specificChat.id, 10);
                    if (!isNaN(parsedId)) {
                        initialChatId = parsedId;
                    }
                }
                setActiveChatId(initialChatId);
            }
            setChatData(chatsData || []);
        } else if (ChatsError) {
            const errorMsg = `Failed to fetch chat data: ${ChatsError.message || 'Unknown error'}`;
            setError(errorMsg);
            console.error(errorMsg, ChatsError);
        }
    }, [ChatsData, ChatsError, isChatsLoading]);

    // Function to send a message to a chat identified by `chatId` using an API call.
    const sendMessage = async (chatId: number | string, message: MessageType) => {
        setError('');
        try {
            const { data: updatedChatsData } = await mutate(
                postFetcher('/api/sendMessage', { chatId, message }),
            );

            const chat: ChatsType | undefined = updatedChatsData?.find((c: ChatsType) => c.id === chatId);
            if (chat) {
                setSelectedChat(chat);
            } else {
                console.warn(`Chat with ID ${chatId} not found in response after sending message.`);
                mutate();
            }
        } catch (err: any) {
            const errorMsg = `Error sending message: ${err.message || 'Unknown error'}`;
            setError(errorMsg);
            console.error(errorMsg, err);
        }
    };

    const value: ChatContextProps = {
        chatData,
        chatContent,
        chatSearch,
        selectedChat,
        loading,
        error,
        activeChatId,
        setChatContent,
        setChatSearch,
        setSelectedChat,
        setActiveChatId,
        sendMessage,
        setError,
        setLoading,
    };
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};


