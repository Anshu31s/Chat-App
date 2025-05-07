import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const FriendDetails = () => {
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoading] = useState(true);
  const [friendError, setError] = useState(null);

  // Memoized fetch function so it can be reused without re-creating it on every render
  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/friends');
      setFriends(response.data);
      setError(null); // reset error on success
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run only once on mount
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return {
    friends,
    loadingFriends,
    friendError,
    refetch: fetchFriends, // 👈 expose this
  };
};

export default FriendDetails;
