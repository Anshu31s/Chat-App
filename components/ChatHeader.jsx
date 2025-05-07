import { ArrowLeft, Video, Phone, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChatStore from "@/(store)/ChatStore";
import axios from "axios";

const ChatHeader = ({
  isFriendOnline,
  openCallNotification,
  handleCall,
}) => {
  const { selectedFriend } = ChatStore();
  const clearSelectedFriend = ChatStore((state) => state.clearSelectedFriend);

  const deleteFriendAndChats = async () => {
    if (!confirm(`Are you sure you want to remove ${selectedFriend.name} and delete your conversation?`)) {
      return;
    }

    try {
      // Delete friend from friend list
      await axios.delete("/api/friends", {
        data: { friendId: selectedFriend.id },
      });
      // Delete chat history
      await axios.delete(`/api/messages/${selectedFriend.id}`);

      clearSelectedFriend();
    } catch (error) {
      console.error("Error removing friend or deleting chats:", error.response?.data?.message || error.message);
      alert("Failed to remove friend or delete chats. Please try again.");
    }
  };

  return (
    <div className="w-full top-0 sticky flex justify-between items-center p-2 border-y bg-gray-100">
      <div className="flex items-center">
        <button onClick={clearSelectedFriend} className="block md:hidden">
          <ArrowLeft />
        </button>
        <img
          src={selectedFriend.image}
          alt="Profile"
          className="rounded-full w-12 h-12 mr-3"
        />
        <span>
          <h2 className="text-md capitalize font-semibold">
            {selectedFriend.name}
          </h2>
          {isFriendOnline ? (
            <p className="text-xs capitalize text-green-400">online</p>
          ) : (
            <p className="text-xs capitalize">offline</p>
          )}
        </span>
      </div>
      <div className="flex justify-between w-32 items-center">
        <div className="flex justify-between w-20 bg-gray-200 rounded-md p-2">
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
              <img
                className="mb-3 h-24 w-24 rounded-full shadow-lg"
                src={selectedFriend.image}
                alt="Bonnie image"
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