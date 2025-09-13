import { useState, useEffect, useRef } from "react";
import {
  History,
  Menu,
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  LogOut,
  User2,
  Globe,
  Play,
  Square,
} from "lucide-react";

const Header = ({
  showHistory,
  setShowHistory,
  selectedLanguage,
  setSelectedLanguage,
  isListening,
  toggleVoice,
  isMuted: propIsMuted = true,
  toggleMute: propToggleMute,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
  ],
  categories = [
    { id: 1, name: "Math", icon: () => <span>📊</span> },
    { id: 2, name: "Science", icon: () => <span>🔬</span> },
    { id: 3, name: "History", icon: () => <span>📚</span> },
    { id: 4, name: "Literature", icon: () => <span>📖</span> },
  ],
  selectedCategory = 1,
  setSelectedCategory = () => {},
  onLogout = () => {},
  navigate = () => {},
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const utteranceRef = useRef(null);
  const isMuted = propIsMuted;
  useEffect(() => {
    if ("speechSynthesis" in window) {
      setSpeechSupported(true);
    }
  }, []);

  const speakText = (text) => {
    if (!speechSupported || !text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const languageMap = {
      en: "en-US",
      es: "es-ES",
      fr: "fr-FR",
      hi: "hi-IN",
      de: "de-DE",
    };

    utterance.lang = languageMap[selectedLanguage] || "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  const handleToggleMute = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    if (propToggleMute) {
      propToggleMute();
    }
  };
  const speakSelectedText = () => {
    if (isMuted) {
      if (speechSupported) {
        const promptUtterance = new SpeechSynthesisUtterance(
          "Volume is muted. Please unmute to hear the text."
        );
        promptUtterance.volume = 0.3;
        window.speechSynthesis.speak(promptUtterance);
      }
      return;
    }

    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      speakText(selectedText);
    } else {
      speakText("No text selected. Please select some text to read aloud.");
    }
  };
  const handleMenuItemClick = (action) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-600 mr-2 hover:bg-slate-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-1 border-blue-700 bg-transparent flex items-center justify-center">
              <img
                className="h-full w-full object-cover rounded-full"
                src="./help.png"
                alt="bot"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BrainuBot
              </h1>
              <p className="text-xs text-slate-500">Student Help Desk</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg transition-colors ${
                showHistory
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title="Toggle History"
            >
              <History className="w-5 h-5" />
            </button>

            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-lg transition-colors ${
                isListening
                  ? "bg-red-100 text-red-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
              {isListening ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>
            {speechSupported && (
              <button
                onClick={isSpeaking ? stopSpeaking : speakSelectedText}
                className={`p-2 rounded-lg transition-colors ${
                  isSpeaking
                    ? "bg-green-100 text-green-600"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                title={isSpeaking ? "Stop Speaking" : "First On The Speaker"}
              >
                {isSpeaking ? (
                  <Square className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-lg transition-colors ${
                isMuted
                  ? "bg-red-100 text-red-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
              title="Profile"
            >
              <User2 className="w-5 h-5" />
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden bg-white border-t border-slate-200 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Navigation
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  handleMenuItemClick(() => setShowHistory(!showHistory))
                }
                className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${
                  showHistory
                    ? "bg-blue-100 text-blue-600 border border-blue-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <History className="w-5 h-5" />
                <span className="text-sm font-medium">History</span>
              </button>

              <button
                onClick={() => handleMenuItemClick(() => navigate("/profile"))}
                className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                <User2 className="w-5 h-5" />
                <span className="text-sm font-medium">Profile</span>
              </button>
            </div>
          </div>
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Settings
            </h3>

            <div className="relative">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Language
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full appearance-none bg-slate-100 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600">
                Voice Controls
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleMenuItemClick(toggleVoice)}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${
                    isListening
                      ? "bg-green-100 text-green-600 border border-green-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">
                    {isListening ? "Listening" : "Mic Off"}
                  </span>
                </button>

                <button
                  onClick={() => handleMenuItemClick(handleToggleMute)}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${
                    isMuted
                      ? "bg-red-100 text-red-600 border border-red-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">
                    {isMuted ? "Muted" : "Sound On"}
                  </span>
                </button>
              </div>
            </div>
            {speechSupported && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600">
                  Text-to-Speech
                </label>
                <button
                  onClick={() =>
                    handleMenuItemClick(
                      isSpeaking ? stopSpeaking : speakSelectedText
                    )
                  }
                  className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${
                    isSpeaking
                      ? "bg-green-100 text-green-600 border border-green-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {isSpeaking ? (
                    <Square className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">
                    {isSpeaking ? "Stop Speaking" : "Speak Selected"}
                  </span>
                </button>
              </div>
            )}
          </div>
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <category.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => handleMenuItemClick(onLogout)}
              className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
