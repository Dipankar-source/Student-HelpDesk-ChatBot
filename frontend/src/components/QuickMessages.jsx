const QuickMessages = ({ filteredQuickMessages, handleQuickMessage }) => {
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-slate-200 h-75 lg:h-[675px] overflow-auto">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Quick Questions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredQuickMessages.map((msg) => (
          <button
            key={msg.id}
            onClick={() => {
              handleQuickMessage(msg.text);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3 p-4 text-left bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 group"
          >
            <div
              className={`w-10 h-10 ${msg.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
            >
              <msg.icon className="w-5 h-5" />
            </div>
            <span className="text-slate-700 text-sm font-medium flex-1">
              {msg.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickMessages;