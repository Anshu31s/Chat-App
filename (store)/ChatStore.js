import { create } from "zustand";
import { devtools } from "zustand/middleware";

const ChatStore = create(
  devtools((set) => ({
    selectedFriend: null,
    onlineUsers: [],
    unreadMessages: {},
    typingStatus: {},

    setSelectedFriend: (friend) =>
      set((state) => ({
        selectedFriend: friend,
        unreadMessages: {
          ...state.unreadMessages,
          [friend?.id]: 0, // Reset unread count when selecting a friend
        },
      })),
    clearSelectedFriend: () => set({ selectedFriend: null }),

    setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
    addUnreadMessage: (userId) =>
      set((state) => ({
        unreadMessages: {
          ...state.unreadMessages,
          [userId]: (state.unreadMessages[userId] || 0) + 1,
        },
      })),
    clearUnreadMessages: (userId) =>
      set((state) => ({
        unreadMessages: {
          ...state.unreadMessages,
          [userId]: 0,
        },
      })),
    setUnreadMessages: (counts) => set({ unreadMessages: counts }),
    setTypingStatus: (userId, isTyping) =>
      set((state) => ({
        typingStatus: {
          ...state.typingStatus,
          [userId]: isTyping,
        },
      })),
  }))
);

export default ChatStore;
