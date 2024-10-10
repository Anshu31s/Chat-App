"use client";
import React, { useState } from "react";

import { useSession, signOut } from "next-auth/react";
import { useDebounceCallback } from 'usehooks-ts'
import axios from "axios";
import GetUser from "./hooks/GetUser";
import FriendDetails from "./hooks/GetFriend";
import { Search, UserRoundPlus, LogOut, MessageCircleMore } from "lucide-react";
import ChatStore from "@/(store)/ChatStore";
const Sidebar = ({ showSidebar }) => {
  const [query, setQuery] = useState("");
  const debounced = useDebounceCallback(setQuery, 500)
  const { data: session } = useSession();
  const { users, userError, loadingUsers } = GetUser(query);
  const { friends, loadingFriends, friendError } = FriendDetails();
  const setSelectedFriend = ChatStore((state) => state.setSelectedFriend);

  const addFriend = async (friendId) => {
    try {
      const response = await axios.post("/api/friends", { friend: friendId });

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Network response was not ok");
      }
      console.log(response.data);
    } catch (error) {
      console.error("There was a problem with the request:", error);
    }
  };
  if (!showSidebar) {
    return null;
  }
  return (
    <div className="border-gray-500 flex flex-col-reverse w-full md:flex-row  bg-white text-black border-x md:w-[25%] h-full fixed z-10 ">
      <aside className="fixed md:static flex flex-row md:flex-col max-[768px]:p-5 max-[768px]:justify-evenly  md:w-[14%] w-full md:py-4 items-center bg-white text-gray-700 shadow">
        <div>
          <a href="#">
            <img
              className="h-6 w-6 outline outline-green-500 outline-offset-2 rounded-full"
              src={session.user.image}
              alt="svelte logo"
            />
          </a>
        </div>
        <ul className="md:flex-grow">
          <li className="max-[768px]:ml-5 md:mt-5">
            <a href=".">
              <MessageCircleMore className="hover:text-blue-400" />
            </a>
          </li>
        </ul>
        <button onClick={() => signOut()} className="hover:text-red-500">
          <LogOut />
        </button>
      </aside>

      <div className="md:w-full">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold ml-4">Chats</h1>
          <div className="items-center px-2"></div>
        </div>

        <div className="px-4 items-center">
          <div className="relative">
            <input
              type="text"
              
              onChange={(e) => debounced(e.target.value)}
              className="w-full p-2 h-10 rounded-md bg-gray-100 focus:outline-none"
              placeholder="Search"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <Search strokeWidth={1} />
            </div>
          </div>
        </div>

        <div className="mt-6 p-2 h-[calc(100vh-160px)] overflow-y-auto">
          {query ? (
            <>
              {loadingUsers && <div>Loading users...</div>}
              {userError && <div className="text-red-500">{userError}</div>}
              {users.length === 0 && !loadingUsers && !userError && (
                <div>
                  Have no friends
                  <br /> search to add friends
                </div>
              )}
              {users.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 hover:bg-gray-100 rounded-lg"
                >
                  <img
                    src={user.image}
                    alt={user.name}
                    className="rounded-full outline outline-gray-200 w-12 h-12 mr-3"
                  />
                  <div className="w-full flex justify-between ml-2">
                    <div>
                      <p className="capitalize text-md">{user.name}</p>
                      <p className="text-xs lowercase text-gray-400">{user.email}</p>
                    </div>
                    <button onClick={() => addFriend(user.id)}>
                      <UserRoundPlus />
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {loadingFriends && <div>Loading friends...</div>}
              {friendError && <div className="text-red-500">{friendError}</div>}
              {friends.length === 0 && !loadingFriends && !friendError && (
                <div>
                  Have no friends
                  <br /> search to add friends
                </div>
              )}
              {friends.map((friend, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <img
                    src={friend.image}
                    alt={friend.name}
                    className="rounded-full outline outline-gray-200 w-12 h-12 mr-3"
                  />
                  <button
                    onClick={() => setSelectedFriend(friend)}
                    className="w-full flex justify-between ml-2"
                  >
                    <div className="text-left">
                      <h4 className="text-md capitalize">{friend.name}</h4>
                      <p className="text-xs text-gray-400 capitalize">start convo</p>
                    </div>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
