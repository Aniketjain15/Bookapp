import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! 👋 I’m your BookHeaven Assistant. Ask me about recent books, authors, or price.",
    },
  ]);
  const [input, setInput] = useState("");
  const boxRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    try {
      const res = await axios.post("https://bookverse-tpi0.onrender.com/api/chat", {
        message: userMsg.text,
      });

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: res.data.reply || "Sorry, I couldn’t understand that." },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Error connecting to AI service." },
      ]);
    }
  };

  return (
    <div
      className="fixed bottom-5 right-5 w-80 h-[400px] backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 transform transition-transform duration-500 scale-0 animate-scaleUp"
      style={{ animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="bg-indigo-600/80 text-white p-3 font-semibold text-lg flex justify-between items-center backdrop-blur-md">
        <span>BookHeaven AI 🤖</span>
        <button onClick={onClose} className="text-white font-bold text-lg">
          ✖
        </button>
      </div>

      {/* Messages */}
      <div
        ref={boxRef}
        className="flex-1 p-3 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-300"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-xl max-w-[75%] ${
              msg.from === "user"
                ? "bg-indigo-500 text-white ml-auto"
                : "bg-white/70 text-gray-900 mr-auto backdrop-blur-md"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex border-t border-white/30 backdrop-blur-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me about books..."
          className="flex-1 p-2 outline-none bg-white/20 text-gray-900 placeholder-gray-700"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600/80 text-white px-4 hover:bg-indigo-700 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
