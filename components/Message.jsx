"use client";
import {
  Smile,
  Mic,
  Paperclip,
  Image as ImageIcon,
  File as FileIcon,
  Video,
  Phone,
  Info,
  ArrowLeft,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import ChatStore from "@/(store)/ChatStore";
import { useSession } from "next-auth/react";
import { socket } from "@/components/socket";
import CallNotification from "./CallNotification";

const Message = ({ showMessage }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messageEndRef = useRef(null);
  const { selectedFriend } = ChatStore();
  const { data: session } = useSession();
  const clearSelectedFriend = ChatStore((state) => state.clearSelectedFriend);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [callNotification, setCallNotification] = useState(false);
  

  const openCallNotification = () => {
    setCallNotification(true);
  };
  const closeCallNoitification = () => {
    setCallNotification(false);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
  };
  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (session?.user?.id) {
      socket.emit("Join", { userId: session.user.id });
    }

    // Listen for the list of online users from the server
    socket.on("onlineUsers", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    socket.on("privateMessage", ({ senderId, senderImage, message, type }) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [senderId]: [
          ...(prevMessages[senderId] || []),
          { senderId, senderImage, message, time, type },
        ],
      }));
    });

    return () => {
      socket.off("privateMessage");
      socket.off("onlineUsers");
    };
  }, [session]);

  const senderId = session?.user?.id;
  const senderImage = session?.user?.image;
  const receiverId = selectedFriend?.id;
  const isFriendOnline = onlineUsers.includes(receiverId);
  const time = new Date().toLocaleString();
  const sendMessage = () => {
    if (receiverId && message && senderId) {
      socket.emit("privateMessage", {
        senderId,
        senderImage,
        receiverId,
        message,
        time,
      });
      setMessages((prevMessages) => ({
        ...prevMessages,
        [receiverId]: [
          ...(prevMessages[receiverId] || []),
          { senderId, senderImage, message, time, type: "outgoing" },
        ],
      }));

      setMessage("");
    }
  };
  const currentMessages = messages[receiverId] || [];
  if (!showMessage) {
    return null;
  }
  return (
    <div className="z-10 bg-white text-black">
      {selectedFriend ? (
        <div>
          {/* header */}
          <div className="w-full md:w-[75%] fixed flex justify-between items-center mb-4 px-4 py-3 border-y bg-white">
            <div className="flex items-center">
              <button onClick={clearSelectedFriend} className="block md:hidden">
                <ArrowLeft />
              </button>
              <img
                src={selectedFriend.image}
                alt="Profile"
                className="rounded-full w-12 h-12 mr-3"
              />
              <span>
                <h2 className="text-md font-semibold">{selectedFriend.name}</h2>
                {isFriendOnline ? (
                  <p className="text-xs text-green-400">online</p>
                ) : (
                  <p className="text-xs">offline</p>
                )}
              </span>
            </div>
            <div className="flex justify-between w-32 items-center">
              <div className="flex justify-between w-20 bg-gray-200 rounded-md p-2">
                <button className="">
                  <Video onClick={openCallNotification} size={24} strokeWidth={1} />
                </button>
                <button className="">
                  <Phone size={20} strokeWidth={1} />
                </button>
              </div>
              <button className="p-2 rounded-md hover:bg-gray-200">
                <Info size={24} strokeWidth={1} />
              </button>
            </div>
          </div>

          {/* messages */}
          <div className="flex flex-col-reverse h-screen p-4 pb-14 bg-gray-100 rounded-lg shadow-lg">
            <div className="overflow-y-auto">
              {currentMessages.map((msg, index) => {
                if (msg.type === "incoming") {
                  return (
                    <div key={index} className="flex items-center mb-2">
                      <img
                        className="w-8 h-8 rounded-full mr-2"
                        src={msg.senderImage}
                        alt="Receiver Avatar"
                      />
                      <div className="flex flex-col">
                        <div className="bg-blue-500 text-white rounded-lg p-2 shadow mb-2 max-w-sm">
                          {msg.message}
                        </div>
                        <p className="text-[10px]">{msg.time}</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-end mb-2"
                    >
                      <div className="flex flex-col">
                        <div className="bg-blue-500 text-white rounded-lg p-2 shadow mb-2 max-w-sm">
                          {msg.message}
                        </div>
                        <p className="text-[10px]">{msg.time}</p>
                      </div>
                      <img
                        className="w-8 h-8 rounded-full ml-2"
                        src={msg.senderImage}
                        alt="Sender Avatar"
                      />
                    </div>
                  );
                }
              })}
              <div ref={messageEndRef} />
            </div>
          </div>

          {/* input field */}
          <div className="fixed bottom-0 right-0 w-full md:w-[75%] flex items-center px-4 py-2 border-y bg-white">
            <div className="w-20 flex justify-between relative">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-200"
                onClick={toggleEmojiPicker}
                aria-label="Toggle emoji picker"
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-12 emoji-picker">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                  />
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Paperclip className="text-gray-400 w-5 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44">
                  <DropdownMenuItem>
                    <label className="flex items-center">
                      <ImageIcon className="mr-2" /> Photos & Videos
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <label className="flex items-center">
                      <FileIcon className="mr-2" /> Document
                      <input type="file" name="document" className="hidden" />
                    </label>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <textarea
              type="text"
              rows="1"
              placeholder="Type a message"
              className="w-full resize-none px-4 py-2 mx-2 bg-transparent border-none outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {message ? (
              <button
                type="submit"
                onClick={sendMessage}
                className="ml-2 p-2 text-gray-400"
                aria-label="Send message"
              >
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.75 21.75 23.25 12 .75 2.25v7.5l15 2.25-15 2.25v7.5Z"></path>
                </svg>
              </button>
            ) : (
              <button className="text-gray-400" aria-label="Record audio">
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Chat App</h1>
            <p className="text-lg">Select a user to chat</p>
          </div>
        </div>
      )}

      {callNotification && <CallNotification onDecline={closeCallNoitification} />}
    </div>
  );
};

export default Message;
