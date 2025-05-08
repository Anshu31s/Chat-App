"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import ChatStore from "@/(store)/ChatStore";
import { socket } from "@/components/socket";

import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageInput from "./MessageInput";
import CallNotification from "./CallNotification";
import NoChatSelected from "./NoChatSelected";

const Message = ({ showMessage }) => {
  // ================================
  // 🔹 1. State Initialization
  // ================================

  const {
    selectedFriend,
    setOnlineUsers,
    setTypingStatus,
    addUnreadMessage,
    clearUnreadMessages,
  } = ChatStore(); // Chat store for selected friend and online users
  const { data: session } = useSession(); // User session from NextAuth

  const [message, setMessage] = useState(""); // Input message state
  const [messages, setMessages] = useState({}); // Messages per receiver
  const [callNotification, setCallNotification] = useState(false); // Call notification visibility
  const [loading, setLoading] = useState(false); // Loading state for fetching messages
  const [error, setError] = useState(null); // Error state for message fetching

  const senderId = session?.user?.id; // Current user ID
  const receiverId = selectedFriend?.id; // Selected friend ID
  const currentMessages = messages[receiverId] || []; // Messages for the current receiver

  // ================================
  // 🔹 2. Socket Setup (Join, Online Users, Message Receiving)
  // ================================
  useEffect(() => {
    if (!senderId) return;

    // Join socket with user ID
    socket.emit("Join", { userId: senderId });

    // Update online users
    socket.on("onlineUsers", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    // Receive private messages
    socket.on(
      "privateMessage",
      ({ senderId, message, time, messageType, type }) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [senderId]: [
            ...(prevMessages[senderId] || []),
            { senderId, message, time, messageType, type },
          ],
        }));
        if (senderId !== receiverId) {
          ChatStore.getState().addUnreadMessage(senderId);
        }
      }
    );
    // Receive typing events
    socket.on("typing", ({ senderId, isTyping }) => {
      setTypingStatus(senderId, isTyping); // Update typing status in store
    });
    // Cleanup socket listeners
    return () => {
      socket.off("privateMessage");
      socket.off("onlineUsers");
    };
  }, [senderId, receiverId, setOnlineUsers, setTypingStatus, addUnreadMessage]);

  // ================================
  // 🔹 4. Handle Typing Events
  // ================================
  useEffect(() => {
    if (!senderId || !receiverId) return;

    let typingTimeout;

    const handleTyping = () => {
      // Emit typing start
      socket.emit("typing", { senderId, receiverId, isTyping: true });

      // Clear previous timeout
      clearTimeout(typingTimeout);

      // Set timeout to stop typing after 2 seconds of inactivity
      typingTimeout = setTimeout(() => {
        socket.emit("typing", { senderId, receiverId, isTyping: false });
      }, 2000);
    };

    // Add event listener for input changes
    const inputElement = document.getElementById("message-input");
    if (inputElement) {
      inputElement.addEventListener("input", handleTyping);
    }

    // Cleanup
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("input", handleTyping);
      }
      clearTimeout(typingTimeout);
    };
  }, [senderId, receiverId, message]);

  // ================================
  // 🔹 4. Fetch Messages from Backend
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

  // Mark messages as read when selecting a friend
  useEffect(() => {
    if (!senderId || !receiverId) return;

    const markMessagesAsRead = async () => {
      try {
        const response = await axios.post("/api/messages", {
          userId: senderId,
          friendId: receiverId,
        });
        if (response.data.success) {
          ChatStore.getState().clearUnreadMessages(receiverId);
          // Trigger a refetch of unread counts (optional, see Sidebar)
        } else {
          throw new Error("Failed to mark messages as read");
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
        setError("Failed to mark messages as read. Please try again.");
      }
    };

    markMessagesAsRead();
  }, [senderId, receiverId]);
  // ================================
  // 🔹 5. Message Sending Handler
  // ================================
  const sendMessage = () => {
    const time = new Date().toISOString();
    const messageType = "text";

    if (receiverId && message && senderId) {
      // Emit message via socket
      socket.emit("privateMessage", {
        senderId,
        receiverId,
        message,
        messageType,
        time,
      });

      // Update local messages state
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

      // Clear input field
      setMessage("");
      socket.emit("typing", { senderId, receiverId, isTyping: false });
    }
  };

  // ================================
  // 🔹 6. Call Notification Handlers
  // ================================
  const openCallNotification = () => {
    setCallNotification(true);
  };

  const closeCallNotification = () => {
    setCallNotification(false);
  };

  const handleCall = () => {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
     width=800,height=700,left=-1000,top=-1000`;
    open("/call", "test", params); // Open call window
  };

  // ================================
  // 🔹 7. Conditional UI Rendering
  // ================================
  if (!showMessage) return null;

  return (
    <div className="z-10 bg-white text-black">
      {selectedFriend ? (
        <div>
          <ChatHeader
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
            inputId="message-input"
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
