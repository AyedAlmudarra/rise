import { Drawer, HR } from "flowbite-react";
import  { useState, useContext } from "react";
import ChatListing from "./ChatListing";
import ChatContent from "./ChatContent";
import { ChatProvider, ChatContext, ChatContextProps } from "@/context/ChatContext";
import { MessageType } from "@/types/apps/chat";
import CardBox from "@/components/shared/CardBox";
import ChatMsgInput from "./ChatMsgInput";
import { useAuth } from "@/context/AuthContext";


const ChatsApp = () => {
  const [isOpenChat, setIsOpenChat] = useState(false);
  const handleClose = () => setIsOpenChat(false);

  const { sendMessage, selectedChat } = useContext<ChatContextProps>(ChatContext);
  const { user } = useAuth();

  const handleSendMessage = (messageText: string) => {
    if (!user || !selectedChat) {
        console.error("User or selected chat is missing, cannot send message.");
        return;
    }

    const newMessage: MessageType = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      createdAt: new Date().toISOString(),
      msg: messageText,
      type: 'text',
      attachment: [],
    };

    sendMessage(selectedChat.id, newMessage);
  };

  return (
    <>
      <CardBox className="p-0 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        <div className="flex flex-grow overflow-hidden">
          <Drawer
            open={isOpenChat}
            onClose={handleClose}
            className="lg:relative lg:transform-none lg:h-auto lg:bg-transparent max-w-[350px] w-full lg:z-[0] flex-shrink-0 border-r border-gray-200 dark:border-gray-700"
          >
            <ChatListing />
          </Drawer>
          <div className="flex-grow flex flex-col">
            <div className="flex-grow overflow-y-auto">
              <ChatContent onClickMobile={() => setIsOpenChat(true)} />
            </div>
            <HR className="my-0 flex-shrink-0" />
            <div className="p-4 flex-shrink-0">
              <ChatMsgInput 
                onSend={handleSendMessage} 
                disabled={!selectedChat} 
              />
            </div>
          </div>
        </div>
      </CardBox>
    </>
  );
};

const WrappedChatsApp = () => (
  <ChatProvider>
    <ChatsApp />
  </ChatProvider>
);

export default WrappedChatsApp;
