"use client";
import ChatStore from "@/(store)/ChatStore";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Message from "@/components/Message";
import { useSession } from "next-auth/react";
const page = () => {
  const { status } = useSession();
  const selectedFriend = ChatStore((state) => state.selectedFriend);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 767) {
      setShowSidebar(true);
      setShowMessage(true);
    } else if (selectedFriend) {
      setShowSidebar(false);
      setShowMessage(true);
    } else {
      setShowSidebar(true);
      setShowMessage(false);
    }
  }, [selectedFriend]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Please log in to chat</div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar showSidebar={showSidebar} />
      <main className="md:w-[75%] md:float-right">
        <Message showMessage={showMessage} />
      </main>
    </div>
  );
};

export default page;
