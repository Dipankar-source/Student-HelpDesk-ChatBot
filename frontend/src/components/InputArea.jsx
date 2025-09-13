import { Send, Mic, MicOff, Search } from "lucide-react";

const InputArea = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isListening,
  toggleVoice,
  searchQuery,
  setSearchQuery,
  filteredQuickMessages,
  handleQuickMessage,
  quickMessages,
}) => {
  return (
    <div className="p-4 bg-white border-t border-slate-200 rounded-2xl">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type here for better results..."
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={toggleVoice}
          className={`p-3 rounded-xl transition-colors ${
            isListening
              ? "bg-red-100 text-red-600"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {isListening ? (
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim()}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quick questions..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>

        {searchQuery && (
          <div className="mt-2 grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {filteredQuickMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleQuickMessage(msg.text)}
                className="flex items-center space-x-3 p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-sm"
              >
                <div
                  className={`w-8 h-8 ${msg.color} rounded-lg flex items-center justify-center text-white`}
                >
                  <msg.icon className="w-4 h-4" />
                </div>
                <span className="text-slate-700 font-medium flex-1">
                  {msg.text}
                </span>
              </button>
            ))}
            {filteredQuickMessages.length === 0 && (
              <p className="text-center text-slate-500 py-2 text-sm">
                No quick questions found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputArea;
