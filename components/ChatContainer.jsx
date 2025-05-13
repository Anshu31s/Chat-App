import ChatStore from "@/(store)/ChatStore";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DateTimeFormatter } from "./hooks/DateTimeFormatter";
import { FileIcon } from "lucide-react";
import { FaRegFilePdf, FaRegFileWord } from "react-icons/fa6";
import { BsFiletypePpt } from "react-icons/bs";
import Image from "next/image";

const ChatContainer = ({ currentMessages }) => {
  const selectedFriend = ChatStore((state) => state.selectedFriend);
  const { data: session } = useSession();
  const messageEndRef = useRef(null);
  const { formatDate } = DateTimeFormatter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100); // give time for DOM + image/video render

    return () => clearTimeout(timeout);
  }, [currentMessages]);

  // 🔹 Render message content based on messageType
  const renderMessageContent = (msg) => {
    switch (msg.messageType) {
      case "image":
        return (
          <Image
            src={msg.message}
            alt="Shared image"
            width={800}
            height={800}
            layout="responsive"
            className="max-w-xs rounded-lg"
          />
        );
      case "video":
        return (
          <video
            src={msg.message}
            alt="Shared video"
            className="max-w-xs rounded-lg"
            controls
          />
        );
      case "pdf":
        return (
          <a
            href={msg.message}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-100 hover:underline"
          >
            <FaRegFilePdf className="w-5 h-5 mr-2" />
            <span>View Document</span>
          </a>
        );
      case "word":
        return (
          <a
            href={msg.message}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-100 hover:underline"
          >
            <FaRegFileWord className="w-5 h-5 mr-2" />
            <span>View Document</span>
          </a>
        );
      case "excel":
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
      case "ppt":
        return (
          <a
            href={msg.message}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-100 hover:underline"
          >
            <BsFiletypePpt className="w-5 h-5 mr-2" />
            <span>View Document</span>
          </a>
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
      className="flex flex-col flex-1 pb-12 overflow-y-auto bg-gray-200 bg-fixed bg-center"
      style={{ backgroundImage: "url('/mobile.png')" }}
    >
      {currentMessages.map((msg, index) => {
        if (msg.type === "incoming") {
          return (
            <div
              key={index}
              className="flex items-center justify-start mb-4 ml-2"
            >
              <Image
                className="rounded-full mr-2 shadow-md"
                src={selectedFriend.image || "/profile.jpg"}
                alt="Sender Avatar"
                width={32}
                height={32}
              />
              <div className="select-text items-end bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-lg max-w-md hover:shadow-xl">
                <div className="text-white text-sm">
                  {renderMessageContent(msg)}
                </div>
                <p className="text-[8px] text-right text-blue-100">
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
              <div className="flex flex-col select-text items-end bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-lg max-w-md hover:shadow-xl">
                <div className="text-white text-sm">
                  {renderMessageContent(msg)}
                </div>
                <span className="text-[8px] text-left text-blue-100">
                  {formatDate(msg.time)}
                </span>
              </div>
              <Image
                className="rounded-full ml-2 shadow-md"
                src={session.user.image || "/profile.jpg"}
                alt="Avatar"
                width={32}
                height={32}
              />
            </div>
          );
        }
      })}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatContainer;
