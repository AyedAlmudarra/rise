import  { useContext, useMemo } from "react";
import { uniq, flatten } from 'lodash';
import { Icon } from "@iconify/react";
import { ChatContext, ChatContextProps } from "@/context/ChatContext";
import { MessageType } from "../../../types/apps/chat";
import React from 'react';

const ChatInsideSidebar = () => {

  const { selectedChat } = useContext<ChatContextProps>(ChatContext);

  const totalAttachment = useMemo(() => {
    if (!selectedChat || !selectedChat.messages) return 0;
    const attachments = selectedChat.messages.map(item => item.attachment || []);
    return uniq(flatten(attachments)).length;
  }, [selectedChat]);

  const totalMedia = useMemo(() => {
    if (!selectedChat || !selectedChat.messages) return 0;
    const mediaMsgs = selectedChat.messages
      .filter(item => item?.type === 'image' && item.msg)
      .map(item => item.msg);
    return uniq(mediaMsgs).length;
  }, [selectedChat]);

  return (
    <>
      <div className="p-5">
        {/* Media */}
        <h6 className="text-sm"> Media ({totalMedia})</h6>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <>
            {selectedChat?.messages?.map((c: MessageType, index) => {
              return (
                <React.Fragment key={`${c.id}-media-${index}`}>
                  {c?.type === "image" && c.msg ? (
                    <div className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={c.msg}
                        alt="media"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })}
          </>
        </div>
        {/* Files */}
        <div className="mt-8">
          <h6 className="text-sm">  Attachments ({totalAttachment})</h6>
          <div>
            {selectedChat?.messages?.map((c: MessageType, index) => {
              return (
                c?.attachment && c.attachment.length > 0 && (
                  <div className="flex flex-col gap-4 mt-4" key={`${c.id}-attachment-${index}`}>
                    {c.attachment.map((a: MessageType['attachment'][number], attachIndex) => {
                      return (
                        <div key={attachIndex}>
                          <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="bg-muted dark:bg-darkmuted p-3 rounded-md">
                              <img
                                src={a.icon || ''}
                                height={24}
                                width={24}
                                alt="file type icon"
                              />
                            </div>
                            <div>
                              <h5 className="text-sm group-hover:text-primary">
                                {a.file || 'Unnamed File'}
                              </h5>
                              <p className="text-xs text-darklink dark:text-bodytext">
                                {a.fileSize || 'N/A'}
                              </p>
                            </div>
                            <div className="btn-circle-hover cursor-pointer invisible  group-hover:visible ms-auto  opacity-50">
                              <Icon icon="solar:download-outline" height="20" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInsideSidebar;