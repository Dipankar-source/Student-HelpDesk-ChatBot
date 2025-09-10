import { Trash2 } from "lucide-react";

const ChatHistory = ({ 
  chatSessions, 
  currentSessionId, 
  setCurrentSessionId, 
  createNewSession, 
  deleteSession, 
  userId 
}) => {
  return (
    <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Chat History
        </h3>
        <button
          onClick={() => createNewSession(userId)}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          New Chat
        </button>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {chatSessions.length === 0 ? (
          <p className="text-slate-500 text-center py-4">
            No chat history yet
          </p>
        ) : (
          chatSessions.map((sessionItem) => (
            <div
              key={sessionItem.id}
              className={`p-3 rounded-lg border transition-colors ${
                sessionItem.id === currentSessionId
                  ? "bg-blue-50 border-blue-200"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="flex justify-between items-start">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setCurrentSessionId(sessionItem.id)}
                >
                  <h4 className="font-medium text-slate-800">
                    {sessionItem.title || "New Chat"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {sessionItem.lastActivity?.toDate
                      ? sessionItem.lastActivity
                          .toDate()
                          .toLocaleDateString()
                      : new Date(
                          sessionItem.lastActivity
                        ).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteSession(sessionItem.id)}
                  className="p-1 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory;