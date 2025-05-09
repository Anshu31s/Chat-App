import ChatStore from "@/(store)/ChatStore";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DateTimeFormatter } from "./hooks/DateTimeFormatter";
import { FileIcon } from "lucide-react";

const ChatContainer = ({ currentMessages }) => {
  const selectedFriend = ChatStore((state) => state.selectedFriend);
  const { data: session } = useSession();
  const messageEndRef = useRef(null);
  const { formatDate } = DateTimeFormatter();

  // 🔹 Scroll to bottom on new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  // 🔹 Render message content based on messageType
  const renderMessageContent = (msg) => {
    switch (msg.messageType) {
      case "image":
        return (
          <img
            src={msg.message}
            alt="Shared image"
            className="max-w-xs rounded-lg"
          />
        );
      case "document":
        return (
          <a
            href={msg.message}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-100 hover:underline"
          >
            <FileIcon className="w-5 h-5 mr-2" />
            <span>View Document</span>
          </a>
        );
      default:
        return <Markdown remarkPlugins={[remarkGfm]}>{msg.message}</Markdown>;
    }
  };

  return (
    <div
      className="flex flex-col-reverse min-h-[83vh] h-auto max-h-[84vh] bg-gray-200 rounded-lg shadow-lg bg-contain bg-center"
      style={{ backgroundImage: "url('/mobile.png')" }}
    >
      <div className="overflow-y-auto">
        {currentMessages.map((msg, index) => {
          if (msg.type === "incoming") {
            return (
              <div
                key={index}
                className="flex items-center justify-start mb-4 ml-2"
              >
                <img
                  className="w-8 h-8 rounded-full mr-2 shadow-md"
                  src={selectedFriend.image || "/profile.jpg"}
                  alt="Sender Avatar"
                />
                <div className="flex select-text items-end bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-lg max-w-md hover:shadow-xl">
                  <div className="text-white text-sm">
                    {renderMessageContent(msg)}
                  </div>
                  <p className="text-[8px] mx-3 text-blue-100">
                    {formatDate(msg.time)}
                  </p>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="flex items-center justify-end mb-4 mr-2"
              >
                <div className="flex select-text items-end bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-lg max-w-md hover:shadow-xl">
                  <div className="text-white text-sm">
                    {renderMessageContent(msg)}
                  </div>
                  <p className="text-[8px] mx-3 text-blue-100">
                    {formatDate(msg.time)}
                  </p>
                </div>
                <img
                  className="w-8 h-8 rounded-full ml-2 shadow-md"
                  src={session.user.image || "/profile.jpg"}
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
