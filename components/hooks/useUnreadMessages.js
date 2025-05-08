import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ChatStore from "@/(store)/ChatStore";

const useUnreadMessages = (userId) => {
  const { setUnreadMessages } = ChatStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUnreadCounts = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      setError(null);
      const response = await axios.get("/api/messages", {
        params: { userId, action: "unreadCounts" },
      });
      const { unreadMessages } = response.data;
      setUnreadMessages(unreadMessages);
    } catch (error) {
      console.error("Error fetching unread counts:", error);
      setError("Failed to load unread message counts");
    } finally {
      setLoading(false);
    }
  }, [userId, setUnreadMessages]);

  useEffect(() => {
    fetchUnreadCounts();
  }, [fetchUnreadCounts]);

  return { loading, error, refetch: fetchUnreadCounts };
};

export default useUnreadMessages;