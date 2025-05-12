import { Phone, PhoneOff } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import SimplePeer from "simple-peer";
const CallNotification = ({ onDecline }) => {
  const handleDecline = () => {
    onDecline();
  };

  return (
    <div className="fixed bg-opacity-50 inset-0 w-full flex justify-center items-center h-screen z-50 bg-black">
      <div className="bg-white shadow-lg shadow-black/20 text-white rounded-lg p-2 border">
        <div className="flex flex-col items-center justify-center shadow-inner shadow-gray-200 px-20 py-2 border rounded-xl ">
          <Image
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="rounded-full"
            width={96}
            height={96}
          />
          <div className="text-center text-black">
            <h2 className="text-sm mt-2 font-thin">Users</h2>
            <p className=" ml-2 text-xs font-thin">Ringing...</p>
          </div>
        </div>
        <div className="flex justify-evenly p-2">
          <button className="flex items-center justify-center w-10 h-10 hover:bg-green-400 bg-green-600 rounded-full text-white">
            <Phone />
          </button>
          <button
            onClick={handleDecline}
            className="flex items-center justify-center w-10 h-10 hover:bg-red-400 bg-red-600 rounded-full text-white"
          >
            <PhoneOff />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
