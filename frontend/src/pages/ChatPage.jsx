import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useMessageStore } from "../stores/useChatStore";

export const ChatPage = ({ thisRoom }) => {
  const {
    getMessage,
    isLoadingMessage,
    isSending,
    messages,
    sendMessage,
    addIncomingMessage,
  } = useMessageStore();

  const { authPlayer, connectSocket } = useAuthStore();
  const [text, setText] = useState("");

  // Connect socket when component mounts
  useEffect(() => {
    if (authPlayer) {
      connectSocket(authPlayer.name);
    }
  }, [authPlayer]);

  // Load historical messages when room changes
  useEffect(() => {
    if (thisRoom?._id) {
      getMessage(thisRoom._id).then(() => {
        connectSocket();
      });
    } else return;
  }, [thisRoom?._id, getMessage]);

  useEffect(() => {
    const { socket } = useAuthStore.getState();
    if (!socket) return;

    const onReceiveMessage = ({ message }) => {
      addIncomingMessage(message);
    };
    
    socket.on("receive_message", onReceiveMessage);

    return () => {
      socket.off("receive_message", onReceiveMessage);
    };
  }, [getMessage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      console.log("Error Sending");
      return;
    }
    await sendMessage(text, thisRoom._id);
    setText("");
  };

  return (
    <div className="min-w-[380px] min-h-[300px] bg-gray-900/70 rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800/90 p-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-semibold">
            {thisRoom?.name || "Chat Room"}
          </h3>
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
            {thisRoom.members.length || 0} online
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`} />
          <span className="text-xs text-gray-400">Connected</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-h-[200px] p-3 space-y-2 text-sm">
        {isLoadingMessage ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-400">Loading messages...</div>
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-400 text-center">
              <p>No messages yet.</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            if (msg.isSystem || msg.system) {
              return (
                <div
                  key={idx}
                  className="w-full flex justify-center text-gray-500 italic py-1"
                >
                  {msg.text}
                </div>
              );
            } else {
              return (
                <div key={idx} className="flex justify-start items-center">
                  <div className="flex items-center gap-2 text-gray-300 text-xs">
                    <span className="text-gray-400 font-medium">
                      {msg.sender?.name}:
                    </span>
                    <span className="text-gray-200">{msg.text}</span>
                  </div>
                </div>
              );
            }
          })
        )}
        <div />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center bg-gray-800/80 p-2 border-t border-gray-700"
      >
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isSending ? "Type a message..." : "Connecting to chat..."
          }
          disabled={isSending}
          className="flex-1 resize-none bg-gray-700/70 text-sm text-white rounded-md p-1.5 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed max-h-24"
        />
        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};
