import { useState } from "react";
import {
  Bot,
  History,
  Settings,
  Menu,
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  LogOut,
  User2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({
  showHistory,
  setShowHistory,
  selectedLanguage,
  setSelectedLanguage,
  isListening,
  toggleVoice,
  isMuted,
  toggleMute,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  languages,
  categories,
  selectedCategory,
  setSelectedCategory,
  onLogout,
  navigate = useNavigate()
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-600 mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <img
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-700 object-cover "
              src="./help.png"
              alt="logo"
            />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BrainuBot
              </h1>
              <p className="text-xs text-slate-500">Student Help Desk</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg transition-colors ${
                showHistory
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
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
            >
              {isListening ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg transition-colors ${
                isMuted
                  ? "bg-red-100 text-red-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-100"
              title="Profile"
            >
              <User2 className="w-5 h-5" />
            </button>

            {/* Logout Button */}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center justify-around">
              
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`w-1/2 flex items-center justify-center space-x-2 p-2 rounded-lg ${
                showHistory
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <History className="w-5 h-5" />
              <span>History</span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-100 "
              title="Profile"
            >
              <User2 className="w-6 h-6" />
            </button>
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full appearance-none bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-sm"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>

            <div className="flex space-x-2">
              <button
                onClick={toggleVoice}
                className={`flex-1 p-2 rounded-lg transition-colors ${
                  isListening
                    ? "bg-red-100 text-red-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 mx-auto" />
                ) : (
                  <Mic className="w-5 h-5 mx-auto" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className={`flex-1 p-2 rounded-lg transition-colors ${
                  isMuted
                    ? "bg-red-100 text-red-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 mx-auto" />
                ) : (
                  <Volume2 className="w-5 h-5 mx-auto" />
                )}
              </button>
            </div>

            {/* Mobile Logout Button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>

            <div className="pt-2 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 p-2 rounded-lg text-xs ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
