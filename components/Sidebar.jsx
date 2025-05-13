"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, UserRoundPlus, LogOut, MessageSquareText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import UnreadMessages from "./hooks/UnreadMessages";
import { useSession, signOut } from "next-auth/react";
import { useDebounceCallback } from "usehooks-ts";
import GetUser from "./hooks/GetUser";
import useFriendStore from "@/(store)/FriendStore";
import ChatStore from "@/(store)/ChatStore";
import { toast } from "sonner";
import Image from "next/image";

const Sidebar = ({ showSidebar }) => {
  const [query, setQuery] = useState("");
  const debounced = useDebounceCallback(setQuery, 500);
  const { data: session } = useSession();
  const { users, userError, loadingUsers } = GetUser(query);
  const { friends, loadingFriends, friendError, fetchFriends } =
    useFriendStore();

  const setSelectedFriend = ChatStore((state) => state.setSelectedFriend);
  const [clickedUsers, setClickedUsers] = useState(new Set());
  const selectedFriend = ChatStore((state) => state.selectedFriend);
  const { unreadMessages } = ChatStore();

  // Fetch unread message counts
  const userId = session?.user?.id;
  const { error: unreadError, refetch: refetchUnreadCounts } =
    UnreadMessages(userId);
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleAddFriend = async (friendId) => {
    if (clickedUsers.has(friendId)) return;
    setClickedUsers((prev) => new Set(prev).add(friendId));
    try {
      const response = await axios.post("/api/friends", { friend: friendId });
      if (response.status >= 200 && response.status < 300) {
        fetchFriends();
        setQuery("");
        toast("Friend is added successfully.");
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("There was a problem with the request:", error);
    }
  };

  // Refetch unread counts after selecting a friend
  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setTimeout(() => refetchUnreadCounts(), 250); // Delay to ensure POST completes
  };

  if (!showSidebar) return null;

  return (
    <div className="border-black flex flex-col-reverse w-full md:flex-row bg-gray-100 text-black border-x md:w-[25%] h-full fixed">
      <aside className="fixed md:static flex flex-row md:flex-col justify-evenly md:justify-normal p-2 w-full md:w-auto md:py-4 items-center bg-gray-200 text-gray-800 shadow">
        {session?.user && (
          <Image
            width={32}
            height={32}
            className="outline outline-green-500 outline-offset-2 rounded-full"
            src={session.user.image || "/profile.jpg"}
            alt="user Avatar"
          />
        )}
        <ul className="md:flex-grow">
          <li className="max-[768px]:ml-5 md:mt-5">
            <a href=".">
              <MessageSquareText />
            </a>
          </li>
        </ul>
        <button onClick={() => signOut()} className="hover:text-red-500">
          <LogOut />
        </button>
      </aside>

      <div className="md:w-full">
        <header className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Chats</h2>
          <button
            id="close-sidebar-btn"
            className="md:hidden text-gray-600 hover:text-gray-800"
            aria-label="Close sidebar"
          ></button>
        </header>

        <div className="px-4 items-center">
          <div className="relative">
            <input
              type="text"
              onChange={(e) => debounced(e.target.value)}
              className="w-full p-2 h-10 rounded-md bg-gray-200 focus:outline-none"
              placeholder="Search"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <Search strokeWidth={1} />
            </div>
          </div>
        </div>

        <div className="p-2 h-[calc(100vh-160px)] overflow-y-auto overflow-x-hidden">
          {query ? (
            <>
              {loadingUsers ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 space-y-4"
                  >
                    <Skeleton className="h-8 w-8 md:h-12 md:w-12 rounded-full bg-gray-300" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px] bg-gray-300" />
                      <Skeleton className="h-4 w-[200px] bg-gray-300" />
                    </div>
                  </div>
                ))
              ) : userError ? (
                <div className="text-red-500 text-sm m-24">{userError}</div>
              ) : users.length === 0 ? (
                <div className="w-full">
                  <h2 className="text-sm text-gray-800 m-28">No Results</h2>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center p-4 hover:bg-gray-300 rounded-lg"
                  >
                    <Image
                      src={user.image || "/profile.jpg"}
                      alt={user.name}
                      className="rounded-full outline outline-gray-500 mr-3"
                      width={48}
                      height={48}
                    />
                    <div className="w-full flex justify-between ml-2">
                      <div>
                        <p className="capitalize text-md">{user.name}</p>
                        <p className="text-xs lowercase text-gray-400">
                          {user.email}
                        </p>
                      </div>
                      <button
                        className="hover:text-blue-700"
                        onClick={() => handleAddFriend(user.id)}
                        disabled={clickedUsers.has(user.id)}
                        aria-label="Add friend"
                      >
                        <UserRoundPlus />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <>
              {loadingFriends ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 space-y-4"
                  >
                    <Skeleton className="h-12 w-12 rounded-full bg-gray-300" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px] bg-gray-300" />
                      <Skeleton className="h-4 w-[200px] bg-gray-300" />
                    </div>
                  </div>
                ))
              ) : friendError ? (
                <div className="text-red-500 text-sm m-24">{friendError}</div>
              ) : (
                friends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => handleSelectFriend(friend)}
                    data-selected={selectedFriend?.id === friend.id}
                    className={`flex items-center p-3 m-1 rounded-lg w-full text-left transition-colors ${
                      selectedFriend?.id === friend.id
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <Image
                      src={friend.image || "/profile.jpg"}
                      alt={friend.name}
                      className="rounded-full outline outline-gray-500 mr-3"
                      width={40}
                      height={40}
                    />
                    <div className="w-full flex justify-between ml-2">
                      <div className="text-left">
                        <h4 className="text-sm font-bold capitalize">
                          {friend.name}
                        </h4>
                        <p className="text-xs text-gray-400 capitalize">
                          start convo
                        </p>
                      </div>
                      {unreadMessages[friend.id] > 0 && (
                        <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {unreadMessages[friend.id]}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
