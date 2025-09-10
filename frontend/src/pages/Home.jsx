// Home.jsx
import { useState, useRef, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../service/firebase";
import {
  languages,
  categories,
  quickMessages,
  stats,
} from "../assets/constants";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatHistory from "../components/ChatHistory";
import Chat from "../components/Chat";
import InputArea from "../components/InputArea";
import QuickMessages from "../components/QuickMessages";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// DeepSeek API configuration
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY =
  "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"; // Replace with a valid key

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
  const [isMuted, setIsMuted] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  const [voices, setVoices] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const isFirstInteractionRef = useRef(isFirstInteraction);
  const chatTopRef = useRef(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    isFirstInteractionRef.current = isFirstInteraction;
  }, [isFirstInteraction]);

  const filteredQuickMessages =
    selectedCategory === "all"
      ? quickMessages.filter((msg) =>
          msg.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : quickMessages.filter(
          (msg) =>
            msg.category === selectedCategory &&
            msg.text.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // Load voices
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        setVoices(available || []);
      } catch (e) {
        console.warn("Could not get voices:", e);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.info("SpeechRecognition not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedLanguage;

    recognition.onresult = async (event) => {
      try {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);

        if (isFirstInteractionRef.current) {
          try {
            await ensureAudioUnlocked();
          } catch (e) {
            console.warn("Audio unlock failed:", e);
          } finally {
            setIsMuted(false);
            setIsFirstInteraction(false);
          }
        }
      } catch (err) {
        console.error("onresult handler error:", err);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop?.();
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  // Auth & sessions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        loadChatSessions(user.uid);
        if (!currentSessionId) {
          createNewSession(user.uid);
        }
      } else {
        signInAnonymously(auth)
          .then((userCredential) => {
            setUserId(userCredential.user.uid);
          })
          .catch((error) => {
            console.error("Anonymous sign-in failed:", error);
            toast.error("Authentication error: " + error.message);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentSessionId) return;

    const q = query(
      collection(db, "messages"),
      where("sessionId", "==", currentSessionId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [currentSessionId]);

  const loadChatSessions = (uid) => {
    try {
      const q = query(
        collection(db, "sessions"),
        where("userId", "==", uid),
        orderBy("lastActivity", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const sessions = [];
          querySnapshot.forEach((doc) => {
            sessions.push({ id: doc.id, ...doc.data() });
          });
          setChatSessions(sessions);

          if (sessions.length > 0 && !currentSessionId) {
            setCurrentSessionId(sessions[0].id);
          }
        },
        (error) => {
          console.error("Error loading sessions:", error);
          toast.error("Error loading chat sessions: " + error.message);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up session listener:", error);
      toast.error("Error loading chat sessions");
    }
  };

  const createNewSession = async (uid) => {
    try {
      const docRef = await addDoc(collection(db, "sessions"), {
        userId: uid,
        createdAt: new Date(),
        lastActivity: new Date(),
        title: "New Chat",
      });
      setCurrentSessionId(docRef.id);
    } catch (error) {
      console.error("Error creating new session:", error);
      toast.error("Error creating new session");
      setCurrentSessionId(`local-${Date.now()}`);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await deleteDoc(doc(db, "sessions", sessionId));
      if (sessionId === currentSessionId) {
        createNewSession(userId);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Error deleting session");
    }
  };

  const translateText = async (text, targetLang) => {
    const translations = {
      en: text,
      es: text
        .replace(/Hello/g, "Hola")
        .replace(/How can I help/g, "Cómo puedo ayudar"),
    };
    return translations[targetLang] || text;
  };

  const callDeepSeekAPI = async (userMessage, language) => {
    setIsTyping(true);
    setApiError(null); // Reset any previous errors

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `You are EduBot, the official student assistant for Brainware University.  
              Your style must always be:
              - 🎯 Give the direct answer first.
              - 🔍 Search the web for the most current info when needed.
              - 📌 If exact date/info is unknown, provide the most likely details.
              - 📝 Format clearly with bullets, numbered steps, or short paragraphs.
              - ✅ Keep tone professional.
              - 🌐 Provide links at the end only.
              - Use markdown formatting.`,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          temperature: 0.5,
          max_tokens: 1024,
          web_search: true,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errorMsg =
          errData?.error?.message || `HTTP error: ${response.status}`;

        setApiError(errorMsg);
        toast.error(`AI service error: ${errorMsg}`);

        // Check if it's an authentication error specifically
        if (response.status === 401) {
          throw new Error(
            `Authentication failed. Please check your API key. Details: ${errorMsg}`
          );
        } else {
          throw new Error(
            `DeepSeek API error: ${response.status} - ${errorMsg}`
          );
        }
      }

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        let deepseekResponse = data.choices[0].message.content.trim();
        if (language !== "en") {
          deepseekResponse = await translateText(deepseekResponse, language);
        }
        setIsTyping(false);
        return deepseekResponse;
      } else {
        throw new Error("Invalid response format from DeepSeek API");
      }
    } catch (error) {
      console.error("Error calling DeepSeek API:", error);
      setIsTyping(false);

      // Provide a helpful fallback response
      return (
        "I'm currently unable to access the AI service. " +
        "This might be due to an invalid API key or service outage. " +
        "Please check your API configuration or try again later. " +
        "In the meantime, you can visit the [official Brainware University website](https://www.brainwareuniversity.ac.in/) for information."
      );
    }
  };

  const ensureAudioUnlocked = async () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") await ctx.resume();
      const buffer = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.start(0);
      src.stop(0);
    } catch (err) {
      console.warn("ensureAudioUnlocked error:", err);
    }
  };

  const speakResponse = (text) => {
    if (isMuted || !("speechSynthesis" in window)) return;
    try {
      const synth = window.speechSynthesis;
      const availableVoices = voices.length ? voices : synth.getVoices();
      const utter = new SpeechSynthesisUtterance(text);
      if (availableVoices.length > 0) {
        const match = availableVoices.find((v) =>
          v.lang.toLowerCase().startsWith(selectedLanguage.toLowerCase())
        );
        if (match) utter.voice = match;
      }
      utter.lang =
        selectedLanguage.length === 2
          ? `${selectedLanguage}-US`
          : selectedLanguage;
      synth.cancel();
      synth.speak(utter);
    } catch (err) {
      console.error("speakResponse error:", err);
    }
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    if (isFirstInteraction) {
      try {
        await ensureAudioUnlocked();
      } catch (e) {
        console.warn("Audio unlock failed:", e);
      } finally {
        setIsMuted(false);
        setIsFirstInteraction(false);
      }
    }

    const userMessage = {
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      language: selectedLanguage,
      sessionId: currentSessionId,
      userId,
    };

    try {
      await addDoc(collection(db, "messages"), userMessage);

      if (currentSessionId) {
        await updateDoc(doc(db, "sessions", currentSessionId), {
          lastActivity: new Date(),
          title:
            messageText.length > 30
              ? `${messageText.substring(0, 30)}...`
              : messageText,
        });
      }
    } catch (error) {
      console.error("Error saving message:", error);
      toast.error("Error saving your message");
    }

    setInputMessage("");

    chatTopRef.current?.scrollIntoView({ behavior: "smooth" });

    const botResponse = await callDeepSeekAPI(messageText, selectedLanguage);

    const aiMessage = {
      text: botResponse,
      sender: "bot",
      timestamp: new Date(),
      language: selectedLanguage,
      sessionId: currentSessionId,
      userId,
    };

    try {
      await addDoc(collection(db, "messages"), aiMessage);
      if (currentSessionId) {
        await updateDoc(doc(db, "sessions", currentSessionId), {
          lastActivity: new Date(),
        });
      }
      speakResponse(botResponse);
    } catch (error) {
      console.error("Error saving AI message:", error);
      toast.error("Error saving AI response");
    }
  };

  const handleQuickMessage = async (messageText) => {
    handleSendMessage(messageText);
  };

  const toggleVoice = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) return;
      if (isFirstInteraction) {
        try {
          await ensureAudioUnlocked();
        } catch (e) {}
        setIsMuted(false);
        setIsFirstInteraction(false);
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("recognition.start() error:", err);
        setIsListening(false);
      }
    }
  };

  const toggleMute = async () => {
    if (isFirstInteraction) {
      try {
        await ensureAudioUnlocked();
      } catch (e) {}
      setIsFirstInteraction(false);
    }
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ToastContainer position="top-right" autoClose={5000} />
      <div ref={chatTopRef}></div>
      <Header
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        isListening={isListening}
        toggleVoice={toggleVoice}
        isMuted={isMuted}
        toggleMute={toggleMute}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        languages={languages}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {!showHistory && (
            <Sidebar
              stats={stats}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )}

          {showHistory && (
            <ChatHistory
              chatSessions={chatSessions}
              currentSessionId={currentSessionId}
              setCurrentSessionId={setCurrentSessionId}
              createNewSession={createNewSession}
              deleteSession={deleteSession}
              userId={userId}
            />
          )}

          <div className="lg:col-span-2 col-span-1">
            <Chat messages={messages} isTyping={isTyping} />
            <InputArea
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              isListening={isListening}
              toggleVoice={toggleVoice}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredQuickMessages={filteredQuickMessages}
              handleQuickMessage={handleQuickMessage}
              inputRef={inputRef}
            />
            {!searchQuery && (
              <QuickMessages
                filteredQuickMessages={filteredQuickMessages}
                handleQuickMessage={handleQuickMessage}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
