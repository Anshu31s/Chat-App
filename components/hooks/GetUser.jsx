import { useState, useEffect } from "react";

const GetUser = (query) => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoading] = useState(true);
  const [userError, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setUsers([]);
      return;
    }
    const fetchusers = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await fetch(`/api/users?query=${query}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setUsers(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchusers();
  }, [query]);

  return { users, userError, loadingUsers };
};

export default GetUser;
