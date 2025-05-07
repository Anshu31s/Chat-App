import { useEffect } from "react";
import { socket } from "@/components/socket";

const useSocket = (senderId, receiverId, onMessage, onOnlineUsers) => {
  useEffect(() => {
    if (!senderId) return;

    // Join the socket with user ID
    socket.emit("Join", { userId: senderId });

    // Handle online users
    const handleOnlineUsers = (onlineUserIds) => {
      if (onOnlineUsers) {
        onOnlineUsers(onlineUserIds);
      }
    };

    // Handle private messages
    const handlePrivateMessage = ({
      senderId: msgSenderId,
      message,
      time,
      messageType,
      type,
    }) => {
      if (
        (msgSenderId === receiverId || msgSenderId === senderId) &&
        onMessage
      ) {
        onMessage({ senderId: msgSenderId, message, time, messageType, type });
      }
    };

    // Set up socket listeners
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("privateMessage", handlePrivateMessage);

    // Cleanup listeners on unmount or dependency change
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("privateMessage", handlePrivateMessage);
    };
  }, [senderId, receiverId, onMessage, onOnlineUsers]);

  // Provide a method to emit messages
  const sendMessage = (messageData) => {
    if (messageData) {
      socket.emit("privateMessage", messageData);
    }
  };

  return { sendMessage };
};

export default useSocket;