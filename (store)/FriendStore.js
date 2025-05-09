// /store/FriendStore.js
import { create } from 'zustand';
import axios from 'axios';

const useFriendStore = create((set) => ({
  friends: [],
  loadingFriends: false,
  friendError: null,

  fetchFriends: async () => {
    set({ loadingFriends: true });
    try {
      const response = await axios.get('/api/friends');
      set({ friends: response.data, friendError: null });
    } catch (err) {
      set({ friendError: err.message || 'Failed to load friends' });
    } finally {
      set({ loadingFriends: false });
    }
  },
}));

export default useFriendStore;
