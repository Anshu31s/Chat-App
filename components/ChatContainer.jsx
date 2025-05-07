import ChatStore from "@/(store)/ChatStore";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatContainer = ({ currentMessages }) => {
  const selectedFriend = ChatStore((state) => state.selectedFriend);
  const { data: session } = useSession();
  const messageEndRef = useRef(null);

  // 🔹 Scroll to bottom on new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);
  return (
    <div
      className="flex flex-col-reverse h-[83vh]  bg-gray-200 rounded-lg shadow-lg bg-contain bg-center"
      style={{ backgroundImage: "url('/mobile.png')" }}
    >
      <div className="overflow-y-auto">
        {currentMessages.map((msg, index) => {
          if (msg.type === "incoming") {
            return (
              <div key={index} className="flex items-center mb-2">
                <img
                  className="w-8 h-8 rounded-full ml-2 shadow-md"
                  src={selectedFriend.image}
                  alt="Sender Avatar"
                />
                <div className="flex flex-col select-text">
                  <div className="bg-blue-500 text-white rounded-lg p-2 shadow mb-2 max-w-sm">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {msg.message}
                    </Markdown>
                  </div>
                  <p className="text-[10px]">{msg.time}</p>
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className="flex items-center justify-end mb-2">
                <div className="flex flex-col">
                  <div className="bg-blue-500 text-white rounded-lg p-2 shadow mb-2 max-w-sm select-text">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {msg.message}
                    </Markdown>
                  </div>
                  <p className="text-[10px] select-text">{msg.time}</p>
                </div>
                <img
                  className="w-8 h-8 rounded-full ml-2 shadow-md"
                  src={session.user.image}
                  alt="Avatar"
                />
              </div>
            );
          }
        })}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
