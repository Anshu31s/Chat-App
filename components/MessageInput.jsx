import {
  Mic,
  Image as ImageIcon,
  File as FileIcon,
  X,
  SendHorizontal,
  Pause,
  Play,
  Square,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmojiPicker from "emoji-picker-react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { BsEmojiSmile, BsPaperclip } from "react-icons/bs";

// Utility function to determine file type
const detectFileType = (file) => {
  const type = file.type;
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "document";
};

// Utility function to check file size
const isFileSizeValid = (file, maxSizeMB = 50) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Utility function to format timer (MM:SS)
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const MessageInput = ({ message, setMessage, sendMessage, inputId }) => {
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isRecording && !isPaused) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, isPaused]);

  // Clean up preview URL on component unmount or preview removal
  useEffect(() => {
    return () => {
      if (previewUrl && (fileType === "image" || fileType === "video" || fileType === "audio")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, fileType]);

  // 🔹 Emoji Picker Handlers
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // 🔹 File Selection Handlers
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isFileSizeValid(file)) {
        alert("File size exceeds 50MB limit.");
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
      setFileType(detectFileType(file));
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isFileSizeValid(file)) {
        alert("File size exceeds 50MB limit.");
        return;
      }
      setPreviewUrl(file.name);
      setFileType(detectFileType(file));
      setSelectedFile(file);
    }
  };

  // 🔹 Remove Preview
  const removePreview = () => {
    if (previewUrl && (fileType === "image" || fileType === "video" || fileType === "audio")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileType(null);
    setSelectedFile(null);
    imageInputRef.current.value = "";
    fileInputRef.current.value = "";
  };

  // 🔹 Audio Recording Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        if (isFileSizeValid(audioFile)) {
          setPreviewUrl(URL.createObjectURL(audioFile));
          setFileType("audio");
          setSelectedFile(audioFile);
        } else {
          alert("Audio file size exceeds 50MB limit.");
        }

        // Clean up
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setIsPaused(false);
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Unable to access microphone. Please check permissions.");
      console.error(err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // 🔹 Modified Send Handler
  const handleSend = () => {
    if (selectedFile) {
      sendMessage(selectedFile);
      removePreview();
    } else if (message.trim()) {
      sendMessage();
    }
  };

  return (
    <div className="w-full bottom-0 bg-gray-100 fixed md:w-[75%]">
      {previewUrl && (
        <div className="relative p-2 flex items-center gap-2">
          <div className="flex items-center">
            {fileType === "image" ? (
              <Image
                src={previewUrl}
                alt="Preview"
                className="object-cover rounded border"
                width={64}
                height={64}
              />
            ) : fileType === "video" ? (
              <video
                src={previewUrl}
                className="w-16 h-16 object-cover rounded border"
                controls
              />
            ) : fileType === "audio" ? (
              <div className="flex items-center px-3 py-2 bg-white rounded border">
                <audio
                  src={previewUrl}
                  controls
                  className="max-w-[200px]"
                />
              </div>
            ) : (
              <div className="flex items-center px-3 py-2 bg-white rounded border">
                <FileIcon className="mr-2 w-5 h-5 text-gray-500" />
                <span className="text-sm truncate max-w-[200px]">
                  {previewUrl}
                </span>
              </div>
            )}
            <button
              onClick={removePreview}
              className="absolute top-1 right-2 bg-white border rounded-full p-1"
              aria-label="Remove preview"
            >
              <X className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </div>
      )}

      <div className="p-2 border-y flex items-center bg-gray-100 gap-2">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-200"
          onClick={toggleEmojiPicker}
          aria-label="Toggle emoji picker"
        >
          <BsEmojiSmile className="w-5 h-5" />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 z-50">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={300}
              height={400}
            />
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BsPaperclip className="text-gray-400 w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                imageInputRef.current.click();
              }}
            >
              <ImageIcon className="mr-2" /> Photos & Videos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                fileInputRef.current.click();
              }}
            >
              <FileIcon className="mr-2" /> Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="file"
          accept="image/*,video/*"
          ref={imageInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <textarea
          rows="1"
          placeholder="Type a message"
          className="w-full resize-none p-2 bg-transparent border-none outline-none"
          id={inputId}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          onFocus={() => setShowEmojiPicker(false)}
          aria-label="Type a message"
          disabled={isRecording} // Disable textarea during recording
        />

        {isRecording ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{formatTime(recordingTime)}</span>
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="text-gray-400 hover:text-gray-200"
              aria-label={isPaused ? "Resume recording" : "Pause recording"}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button
              onClick={stopRecording}
              className="text-gray-400 hover:text-gray-200"
              aria-label="Stop recording"
            >
              <Square className="w-5 h-5" />
            </button>
          </div>
        ) : message || previewUrl ? (
          <button
            type="submit"
            onClick={handleSend}
            className="ml-2 p-2 text-gray-400"
            aria-label="Send message"
          >
            <SendHorizontal />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="text-gray-400"
            aria-label="Record audio"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;