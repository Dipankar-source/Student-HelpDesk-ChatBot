import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-end space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <img
            className="h-full w-full object-cover"
            src="./help.png"
            alt="bot"
          />
        </div>
        <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-slate-200 px-4 py-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
