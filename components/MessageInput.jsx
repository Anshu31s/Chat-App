import {
  Smile,
  Mic,
  Paperclip,
  Image as ImageIcon,
  File as FileIcon,
  X,
  SendHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmojiPicker from "emoji-picker-react";
import { useRef, useState } from "react";
import Image from "next/image";
// Utility function to determine file type
const detectFileType = (file) => {
  const type = file.type;
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  return "document";
};
const isFileSizeValid = (file, maxSizeMB = 50) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

const MessageInput = ({ message, setMessage, sendMessage, inputId }) => {
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
    setPreviewUrl(null);
    setFileType(null);
    setSelectedFile(null);
    imageInputRef.current.value = "";
    fileInputRef.current.value = "";
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
    <div className="bottom-0 w-full flex flex-col p-2 border-y sticky bg-gray-100">
      {previewUrl && (
        <div className="relative mb-2 flex items-center gap-3">
          <div className="flex items-center">
            {fileType === "image" || fileType === "video" ? (
              fileType === "video" ? (
                <video
                  src={previewUrl}
                  className="w-16 h-16 object-cover rounded border"
                  controls
                />
              ) : (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded border"
                />
              )
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
              className="absolute -top-2 -right-2 bg-white border rounded-full p-1"
              aria-label="Remove preview"
            >
              <X className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center">
        <div className="w-20 flex justify-between relative">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-200"
            onClick={toggleEmojiPicker}
            aria-label="Toggle emoji picker"
          >
            <Smile className="w-5 h-5" />
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
              <Paperclip className="text-gray-400 w-5 h-5" />
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
        </div>

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
          className="w-full resize-none px-4 py-2 mx-2 bg-transparent border-none outline-none"
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
        />

        {message || previewUrl ? (
          <button
            type="submit"
            onClick={handleSend}
            className="ml-2 p-2 text-gray-400"
            aria-label="Send message"
          >
            <SendHorizontal />
          </button>
        ) : (
          <button className="text-gray-400" aria-label="Record audio">
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
