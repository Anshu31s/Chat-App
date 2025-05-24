import { ArrowLeft, Video, Phone, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChatStore from "@/(store)/ChatStore";
import axios from "axios";
import useFriendStore from "@/(store)/FriendStore";
import { DateTimeFormatter } from "./hooks/DateTimeFormatter";
import Image from "next/image";
const ChatHeader = ({ openCallNotification, handleCall }) => {
  const { selectedFriend, onlineUsers, typingStatus } = ChatStore();
  const receiverId = selectedFriend?.id;
  const isFriendOnline = onlineUsers.includes(receiverId);
  const isTyping = typingStatus[receiverId] || false;
  const clearSelectedFriend = ChatStore((state) => state.clearSelectedFriend);
  const { fetchFriends } = useFriendStore();
  const { formatDate } = DateTimeFormatter();

  const deleteFriendAndChats = async () => {
    if (
      !confirm(
        `Are you sure you want to remove ${selectedFriend.name} and delete your conversation?`
      )
    ) {
      return;
    }

    try {
      // Delete friend from friend list
      await axios.delete("/api/friends", {
        data: { friendId: selectedFriend.id },
      });
      // Delete chat history
      await axios.delete(`/api/messages/${selectedFriend.id}`);
      fetchFriends();
      clearSelectedFriend();
    } catch (error) {
      console.error(
        "Error removing friend or deleting chats:",
        error.response?.data?.message || error.message
      );
      alert("Failed to remove friend or delete chats. Please try again.");
    }
  };

  return (
    <div className="w-full md:w-[75%] top-0 fixed z-10 flex justify-between items-center p-2 border-y bg-gray-100">
      {/* Left section: back button + profile */}
      <div className="flex items-center space-x-3 overflow-hidden">
        <button onClick={clearSelectedFriend} className="block md:hidden">
          <ArrowLeft />
        </button>
        <Image
          src={selectedFriend.image || "/profile.jpg"}
          alt="Profile"
          className="rounded-full w-10 h-10"
          width={40}
          height={40}
        />
        <div className="flex flex-col min-w-0">
          <h2 className="text-sm font-bold truncate">{selectedFriend.name}</h2>
          <span className="text-xs text-gray-600 truncate">
            {isTyping ? (
              "typing..."
            ) : isFriendOnline ? (
              <span className="text-green-500">online</span>
            ) : (
              `last seen ${formatDate(selectedFriend.lastOnline)}`
            )}
          </span>
        </div>
      </div>
{/* Right section: action icons */}
  <div className="flex items-center space-x-2">
         <div className="flex items-center bg-gray-200 rounded-md px-2 py-1 space-x-2">
          <button>
            <Video onClick={openCallNotification} size={24} strokeWidth={1} />
          </button>
          <button>
            <Phone onClick={handleCall} size={20} strokeWidth={1} />
          </button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-md hover:bg-gray-200">
            <Info size={24} strokeWidth={1} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4">
            <DropdownMenuItem className="flex w-64 border-none flex-col items-center justify-center rounded-lg border pb-10">
              <Image
                className="mb-3 rounded-full shadow-lg"
                src={selectedFriend.image || '/profile.jpg'}
                alt="Bonnie image"
                width={96}
                height={96}
              />
              <h3 className="mb-1 text-xl capitalize font-medium text-gray-900">
                {selectedFriend.name}
              </h3>
              <span className="text-sm lowercase text-gray-500">
                {selectedFriend.email}
              </span>
              <button
                onClick={deleteFriendAndChats}
                className="mt-5 inline-flex items-center rounded-lg bg-red-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-400 focus:ring-4 focus:ring-red-400"
              >
                Remove
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
