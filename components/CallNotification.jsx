import { Phone, PhoneOff } from "lucide-react";
import React from "react";
import { useState, useEffect } from "react";
import SimplePeer from "simple-peer";
const CallNotification = ({onDecline}) => {
  

  const handleDecline = () => {
    onDecline();
  }

  return (
    <div>
      <div className="fixed bg-opacity-50 inset-0 w-full flex justify-center items-center h-screen z-50 bg-black">
        <div className="bg-white shadow-lg text-white rounded-lg p-2 border">
          <div className="flex flex-col items-center justify-center shadow-inner shadow-gray-200 px-20 py-2 border rounded-xl ">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="rounded-full w-24 h-24"
            />
            <div className="text-center">
              <h2 className="text-xl mt-2">Users</h2>
              <p className=" ml-2 text-sm">Ringing...</p>
            </div>
          </div>
          <div className="flex justify-evenly p-2">
            <button className="flex items-center justify-center w-10 h-10 hover:bg-green-400 bg-green-600 rounded-full text-white">
              <Phone/>
            </button>
            <button onClick={handleDecline} className="flex items-center justify-center w-10 h-10 hover:bg-red-400 bg-red-600 rounded-full text-white">
              <PhoneOff />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
