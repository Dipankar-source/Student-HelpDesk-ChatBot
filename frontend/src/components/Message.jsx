import { Bot, User } from "lucide-react";

const Message = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
          message.sender === "user"
            ? "flex-row-reverse space-x-reverse"
            : ""
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.sender === "user"
              ? "bg-blue-600 text-white"
              : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
          }`}
        >
          {message.sender === "user" ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
        <div
          className={`px-4 py-2 rounded-2xl ${
            message.sender === "user"
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-white text-slate-800 rounded-bl-md shadow-sm border border-slate-200"
          }`}
        >
          <p className="text-sm">{message.text}</p>
          <p
            className={`text-xs mt-1 ${
              message.sender === "user"
                ? "text-blue-200"
                : "text-slate-500"
            }`}
          >
            {message.timestamp?.toDate
              ? message.timestamp
                  .toDate()
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
              : new Date(message.timestamp).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;