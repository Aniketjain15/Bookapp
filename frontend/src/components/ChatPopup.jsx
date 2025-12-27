import React, { useState } from "react";
import ChatBox from "./chatbox";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 w-16 h-16 bg-indigo-600/80 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl backdrop-blur-md hover:bg-indigo-700 transition-all"
        >
          💬
        </button>
      )}

      {/* Chatbox */}
      {isOpen && <ChatBox onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatPopup;
