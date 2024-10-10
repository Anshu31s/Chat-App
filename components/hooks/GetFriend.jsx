
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFriendDetails = () => {
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoading] = useState(true);
  const [friendError, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/friends'); 

        setFriends(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  return { friends, loadingFriends, friendError };
};

export default useFriendDetails;
