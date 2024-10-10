"use client";
import { useSession } from "next-auth/react";
import ChatStore from "@/(store)/ChatStore";
import React, { useState, useRef, useEffect } from "react";
import { Mic, Camera, PhoneOff, MicOff, CameraOff } from "lucide-react";

const CallInterface = () => {
  const { selectedFriend } = ChatStore();
  const { session } = useSession();
  const [CameraOn, setCamera] = useState(false);
  const [MicOn, setMic] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [remoteCamera, setremoteCamera] = useState(false);

  const remoteUserId = selectedFriend?.id;
  const localUserId = session?.user?.id;

  const remoteVideo = useRef(null);  
  const localVideo = useRef(null);

  useEffect(() => {
    startVoiceCall();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startVoiceCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
    } catch (error) {
      console.error("Error accessing audio:", error);
    }
  };

  const toggleCamera = async () => {
    if (!CameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: MicOn });
        setLocalStream(stream);
        setCamera(true);

        if (remoteVideo.current) {
          remoteVideo.current.srcObject = stream;
        }
        if (localVideo.current) {
          localVideo.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    } else {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) videoTrack.stop();
      setCamera(false);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => (track.enabled = !MicOn));
    }
    setMic((prev) => !prev);
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setCamera(false);
    setMic(false);
    setCamera(false);
  };
  const bothCamerasOff = !CameraOn && !remoteCamera;

  return (
    <div className=" bg-black">
      <div className=" border h-screen border-white p-2 rounded-xl shadow-lg bg-black/30">
        <div className="flex flex-col items-center justify-center border rounded-xl w-full h-[90%]">
          {bothCamerasOff ? (
            <div className="">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="rounded-full w-24 h-24"
              />
              <div className="text-center">
                <h2 className="text-white text-2xl mt-4">John</h2>
                <p className="text-gray-400 text-sm ml-2">Ringing...</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full">
              <video
                ref={remoteVideo}
                className="w-full object-cover rounded-xl bg-black"
                autoPlay
                muted
                controls={false}
              ></video>

              <div className="absolute bottom-4 right-4 border border-gray-300 rounded-xl w-32 h-32 bg-white shadow-lg">
                <video
                  ref={localVideo}
                  className="w-full rounded-xl h-full object-cover"
                  autoPlay
                  muted
                  controls={false}
                ></video>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center space-x-8 p-4">
          <button
            onClick={toggleCamera}
            className="flex items-center justify-center w-12 h-12 hover:bg-gray-400 bg-gray-600 rounded-full text-white"
          >
            {CameraOn ? <CameraOff /> : <Camera />}
          </button>
          <button
            onClick={toggleMic}
            className="flex items-center justify-center w-12 h-12 hover:bg-gray-400 bg-gray-600 rounded-full text-white"
          >
            {MicOn ? <Mic /> : <MicOff />}
          </button>
          <button
            onClick={endCall}
            className="flex items-center justify-center w-12 h-12 hover:bg-red-400 bg-red-600 rounded-full text-white"
          >
            <PhoneOff />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
