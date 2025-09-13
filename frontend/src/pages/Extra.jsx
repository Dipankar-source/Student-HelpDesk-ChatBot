import { Bot, Download, FileText, Loader2 } from "lucide-react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import { useEffect, useRef, useState } from "react";

const Chat = ({ messages, isTyping, onDownload }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      await onDownload();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 h-[450px] lg:h-[500px] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">BrainuBot Assistant</h3>
            <p className="text-blue-100 text-sm flex items-center">
              Online & Ready to Help
            </p>
          </div>
        </div>

        <button
          onClick={handleExportClick}
          disabled={messages.length <= 1 || isExporting}
          className="flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          title="Download conversation as PDF"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>{isExporting ? "Exporting..." : "Export"}</span>
        </button>
      </div>

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