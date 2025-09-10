import { Bot } from "lucide-react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import { useEffect, useRef } from "react";

const Chat = ({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);


  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 h-[450px] lg:h-[500px] flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">EduBot Assistant</h3>
            <p className="text-blue-100 text-sm flex items-center">
              Online & Ready to Help
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chat;