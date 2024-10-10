import { create } from "zustand";

const ChatStore = create((set) => ({
    selectedFriend: null,

    setSelectedFriend: (selectedFriend) => set({ selectedFriend }),
    clearSelectedFriend: () => set({ selectedFriend: null }),
}));

export default ChatStore;