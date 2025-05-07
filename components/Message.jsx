"use client";
import { useEffect, useState } from "react";
import ChatStore from "@/(store)/ChatStore";
import { useSession } from "next-auth/react";
import { socket } from "@/components/socket";
import axios from "axios";

import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageInput from "./MessageInput";
import CallNotification from "./CallNotification";
import NoChatSelected from "./NoChatSelected";

const Message = ({ showMessage }) => {
  // ================================
  // 🔹 State Variables
  // ================================

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [callNotification, setCallNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { selectedFriend } = ChatStore();
  const { data: session } = useSession();

  const senderId = session?.user?.id;
  const receiverId = selectedFriend?.id;
  const isFriendOnline = onlineUsers.includes(receiverId);

  
  // ================================
  // 🔹 Call Notification Handlers
  // ================================
  const openCallNotification = () => {
    setCallNotification(true);
  };

  const closeCallNotification = () => {
    setCallNotification(false);
  };

  // ================================
  // 🔹 Fetch Messages from Backend
  // ================================
  useEffect(() => {
    if (!senderId || !receiverId) return;

    const loadMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/messages/${receiverId}`);
        const { messages } = response.data;
        const formattedMessages = messages.map((msg) => ({
          ...msg,
          type: msg.senderId === senderId ? "outgoing" : "incoming",
        }));
        setMessages((prevMessages) => ({
          ...prevMessages,
          [receiverId]: formattedMessages,
        }));
      } catch (error) {
        console.error("Error loading messages:", error);
        setError("Failed to load messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [senderId, receiverId]);

  // ================================
  // 🔹 Send Message
  // ================================
  const sendMessage = () => {
    const time = new Date().toISOString();
    const messageType = "text";

    if (receiverId && message && senderId) {
      socket.emit("privateMessage", {
        senderId,
        receiverId,
        message,
        messageType,
        time,
      });

      setMessages((prevMessages) => ({
        ...prevMessages,
        [receiverId]: [
          ...(prevMessages[receiverId] || []),
          {
            senderId,
            message,
            messageType,
            time,
            type: "outgoing",
          },
        ],
      }));

      setMessage("");
    }
  };

  // ================================
  // 🔹 Socket Setup (Join, Online Users, Message Receiving)
  // ================================
  useEffect(() => {
    if (senderId) {
      socket.emit("Join", { userId: senderId });
    }

    socket.on("onlineUsers", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    socket.on(
      "privateMessage",
      ({ senderId, message, time, messageType, type }) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [receiverId]: [
            ...(prevMessages[receiverId] || []),
            { senderId, message, time, messageType, type },
          ],
        }));
      }
    );

    return () => {
      socket.off("privateMessage");
      socket.off("onlineUsers");
    };
  }, [senderId, receiverId]);

  // ================================
  // 🔹 Initiate Call Handler
  // ================================
  const handleCall = () => {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
     width=800,height=700,left=-1000,top=-1000`;
    open("/call", "test", params);
  };

  const currentMessages = messages[receiverId] || [];

  // ================================
  // 🔹 Conditional UI Rendering
  // ================================
  if (!showMessage) return null;

  return (
    <div className="z-10 bg-white text-black">
      {selectedFriend ? (
        <div>
          <ChatHeader
            isFriendOnline={isFriendOnline}
            openCallNotification={openCallNotification}
            handleCall={handleCall}
          />

          {loading ? (
            <div className="flex justify-center items-center h-[83vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <ChatContainer currentMessages={currentMessages} />
          )}

          <MessageInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <NoChatSelected />
        </div>
      )}

      {callNotification && (
        <CallNotification onDecline={closeCallNotification} />
      )}
    </div>
  );
};

export default Message;
