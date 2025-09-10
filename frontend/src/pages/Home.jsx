import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Globe,
  BookOpen,
  GraduationCap,
  Clock,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Zap,
  Shield,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Menu,
  X,
  ChevronDown,
  Star,
  Users,
  Award,
  Target,
} from "lucide-react";

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyAE1wNbllIfA6dUjadWzdoAs5StzXlUdPk";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const Home = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today? 👋",
      sender: "bot",
      timestamp: new Date(),
      language: "en",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  ];

  const categories = [
    { id: "all", name: "All Topics", icon: Target },
    { id: "academics", name: "Academics", icon: BookOpen },
    { id: "admissions", name: "Admissions", icon: GraduationCap },
    { id: "financial", name: "Financial", icon: CreditCard },
    { id: "campus", name: "Campus Life", icon: MapPin },
    { id: "technical", name: "Technical", icon: Settings },
  ];

  const quickMessages = [
    {
      id: 1,
      text: "What are the admission requirements?",
      category: "admissions",
      icon: GraduationCap,
      color: "bg-blue-500",
    },
    {
      id: 2,
      text: "How do I register for classes?",
      category: "academics",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      id: 3,
      text: "What financial aid is available?",
      category: "financial",
      icon: CreditCard,
      color: "bg-purple-500",
    },
    {
      id: 4,
      text: "Where is the library located?",
      category: "campus",
      icon: MapPin,
      color: "bg-orange-500",
    },
    {
      id: 5,
      text: "How to reset my student portal password?",
      category: "technical",
      icon: Shield,
      color: "bg-red-500",
    },
    {
      id: 6,
      text: "What are the semester dates?",
      category: "academics",
      icon: Clock,
      color: "bg-teal-500",
    },
    {
      id: 7,
      text: "How to apply for scholarships?",
      category: "financial",
      icon: Award,
      color: "bg-indigo-500",
    },
    {
      id: 8,
      text: "Student housing information",
      category: "campus",
      icon: Users,
      color: "bg-pink-500",
    },
  ];

  const stats = [
    { label: "Students Helped", value: "10,000+", icon: Users },
    { label: "Questions Answered", value: "50,000+", icon: MessageCircle },
    { label: "Languages Supported", value: "8+", icon: Globe },
    { label: "Average Response Time", value: "<2s", icon: Zap },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const translateText = async (text, targetLang) => {
    // Simulate translation - in real implementation, use Google Translate API
    const translations = {
      en: text,
      es: text
        .replace(/Hello/g, "Hola")
        .replace(/How can I help/g, "Cómo puedo ayudar"),
      fr: text
        .replace(/Hello/g, "Bonjour")
        .replace(/How can I help/g, "Comment puis-je aider"),
      de: text
        .replace(/Hello/g, "Hallo")
        .replace(/How can I help/g, "Wie kann ich helfen"),
      zh: text
        .replace(/Hello/g, "你好")
        .replace(/How can I help/g, "我如何帮助你"),
      ja: text
        .replace(/Hello/g, "こんにちは")
        .replace(/How can I help/g, "どのようにお手伝いできますか"),
      ar: text
        .replace(/Hello/g, "مرحبا")
        .replace(/How can I help/g, "كيف يمكنني المساعدة"),
      hi: text
        .replace(/Hello/g, "नमस्ते")
        .replace(/How can I help/g, "मैं कैसे मदद कर सकता हूं"),
    };
    return translations[targetLang] || text;
  };

  const callGeminiAPI = async (userMessage, language) => {
    setIsTyping(true);

    try {
      const prompt = `You are EduBot, a helpful AI assistant for university students. 
      Provide clear, concise, and helpful responses to student inquiries about:
      - Admissions and enrollment
      - Academic programs and courses
      - Financial aid and scholarships
      - Campus facilities and services
      - Student life and activities
      - Technical support
      
      User question: "${userMessage}"
      
      Please respond in a friendly, professional manner and keep responses under 200 words.`;

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        let geminiResponse = data.candidates[0].content.parts[0].text;

        // Clean up the response
        geminiResponse = geminiResponse.trim();

        // Translate if needed (for non-English languages)
        if (language !== "en") {
          geminiResponse = await translateText(geminiResponse, language);
        }

        setIsTyping(false);
        return geminiResponse;
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setIsTyping(false);

      // Fallback response if API fails
      const fallbackResponses = {
        en: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or contact our human support team for immediate assistance.",
        es: "Lo siento, pero estoy teniendo problemas para conectarme a mi base de conocimientos en este momento. Por favor, inténtelo de nuevo en un momento o contacte a nuestro equipo de soporte humano para asistencia inmediata.",
        fr: "Je m'excuse, mais j'ai des difficultés à me connecter à ma base de connaissances pour le moment. Veuillez réessayer dans un instant ou contactez notre équipe de support humain pour une assistance immédiate.",
        de: "Es tut mir leid, aber ich habe momentan Probleme, mich mit meiner Wissensdatenbank zu verbinden. Bitte versuchen Sie es in einem Moment erneut oder wenden Sie sich an unser menschliches Support-Team für sofortige Hilfe.",
        zh: "抱歉，我现在无法连接到我的知识库。请稍后再试，或联系我们的人工支持团队以获得即时帮助。",
        ja: "申し訳ありませんが、現在ナレッジベースに接続できません。しばらくしてからもう一度お試しいただくか、人間のサポートチームに連絡してすぐに支援を受けてください。",
        ar: "أعتذر، لكنني أواجه مشكلة في الاتصال بقاعدة المعرفة الخاصة بي الآن. يرجى المحاولة مرة أخرى بعد قليل، أو الاتصال بفريق الدعم البشري للحصول على المساعدة الفورية.",
        hi: "मैं माफी चाहता हूं, लेकिन मुझे अभी अपने नॉलेज बेस से कनेक्ट होने में परेशानी हो रही है। कृपया एक पल में फिर से कोशिश करें, या तत्काल सहायता के लिए हमारी मानव सहायता टीम से संपर्क करें।",
      };

      return fallbackResponses[language] || fallbackResponses["en"];
    }
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    const botResponse = await callGeminiAPI(messageText, selectedLanguage);

    const aiMessage = {
      id: Date.now() + 1,
      text: botResponse,
      sender: "bot",
      timestamp: new Date(),
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleQuickMessage = (messageText) => {
    handleSendMessage(messageText);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Implement speech recognition here
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Implement text-to-speech toggle here
  };

  const filteredQuickMessages =
    selectedCategory === "all"
      ? quickMessages
      : quickMessages.filter((msg) => msg.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center"
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EduBot
                </h1>
                <p className="text-xs text-slate-500">Student Help Desk</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
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
                <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleVoice}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? "bg-red-100 text-red-600"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              <button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
            </div>

            {/* Mobile Menu Button */}
            <button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-slate-200"
          >
            <div className="px-4 py-4 space-y-3">
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
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Welcome Section */}
            <div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
            >
              <div className="text-center mb-6">
                <div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Welcome to EduBot
                </h2>
                <p className="text-slate-600">
                  Your 24/7 AI-powered student assistant
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center p-3 bg-slate-50 rounded-lg"
                  >
                    <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-800">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Category Filter */}
            <div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Need Human Help?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-slate-600">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>help@university.edu</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Mon-Fri 8AM-6PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 h-[600px] flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">EduBot Assistant</h3>
                    <p className="text-blue-100 text-sm flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Online & Ready to Help
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
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
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-end space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-slate-200 px-4 py-2">
                        <div className="flex space-x-1">
                          <div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              delay: 0,
                            }}
                            className="w-2 h-2 bg-slate-400 rounded-full"
                          />
                          <div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              delay: 0.2,
                            }}
                            className="w-2 h-2 bg-slate-400 rounded-full"
                          />
                          <div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              delay: 0.4,
                            }}
                            className="w-2 h-2 bg-slate-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Type your question here..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Messages */}
            <div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Quick Questions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredQuickMessages.map((msg, index) => (
                  <button
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickMessage(msg.text)}
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-900 text-white py-8 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bot className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">EduBot</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Powered by Google Gemini AI technology to help students succeed
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <span className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure & Private</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Instant Response</span>
              </span>
              <span className="flex items-center space-x-1">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Multilingual Support</span>
              </span>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
              © 2025 University Help Desk. All rights reserved. | Privacy Policy
              | Terms of Service
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
