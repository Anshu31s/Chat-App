// components/VideoMessage.jsx
import { useState } from "react";

const VideoMessage = ({ src }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return !isLoaded ? (
    <div
      className="cursor-pointer bg-black text-white flex items-center justify-center h-48 w-80 rounded-lg"
      onClick={() => setIsLoaded(true)}
    >
      <span className="text-sm">Click to load video</span>
    </div>
  ) : (
    <video src={src} className="rounded-lg max-w-xs" controls />
  );
};

export default VideoMessage;
