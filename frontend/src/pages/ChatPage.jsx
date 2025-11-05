import { useState } from "react";
import { useMessageStore } from "../stores/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

export const ChatPage = ({ thisRoom }) => {
  const {
    allMessage,
    getMessage,
    isLoadingMessage,
    sendMessage,
    replyMessage,
    isSending,
  } = useMessageStore();

  const { authPlayer } = useAuthStore();

  useEffect(() => {
    getMessage;
  }, [getMessage]);

  const [text, setText] = useState("");

  return (
    <div className="min-w-[380px] min-h-[300px] bg-gray-900/70 rounded-lg shadow-lg flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm text-white">
        <div className="text-gray-400 p-2 rounded-md flex justify-center w-full">
          <p>Player join in the room</p>
        </div>
        <div className="p-2 rounded-md flex gap-2">
          <p className="font-medium">Player #1: </p>
          <span className="text-blue-300">Hello everyone 👋</span>
        </div>
      </div>

      <div className="flex items-center bg-gray-800/80 p-2">
        <textarea
          rows={1}
          placeholder="Type a message..."
          className="flex-1 resize-none bg-gray-700/70 text-white rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 text-sm">
          Send
        </button>
      </div>
    </div>
  );
};
