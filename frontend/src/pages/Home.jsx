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
  GEMINI_API_URL,
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
  const [isMuted, setIsMuted] = useState(true); // start muted
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  const [voices, setVoices] = useState([]);

  // refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const isFirstInteractionRef = useRef(isFirstInteraction);
  const chatTopRef = useRef(null);

  // keep ref in sync to avoid stale closures in event handlers
  useEffect(() => {
    isFirstInteractionRef.current = isFirstInteraction;
  }, [isFirstInteraction]);

  // Filter quick messages
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

  // Load voices (handles onvoiceschanged)
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
      try {
        window.speechSynthesis.onvoiceschanged = null;
      } catch (e) {}
    };
  }, []);

  // Initialize SpeechRecognition once
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

        // On first voice input, unlock audio and unmute
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

    // cleanup on unmount
    return () => {
      try {
        recognition.stop();
      } catch (e) {}
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognitionRef.current = null;
    };
    // create once -> empty deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When selectedLanguage changes, update recognition lang (do not recreate)
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  // Auth & sessions (same as before)
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
          });
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load messages for current session
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
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up session listener:", error);
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
      const localSessionId = `local-${Date.now()}`;
      setCurrentSessionId(localSessionId);
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

  const callGeminiAPI = async (userMessage, language) => {
    setIsTyping(true);

    try {
      const prompt = `
You are EduBot, the official student assistant for Brainware University.  
Your style must always be:
- 🎯 Give the **direct answer first** (not vague or generic).  
- 📌 If exact date/info is unknown, provide the **most likely details** (like typical admission months) and then politely suggest checking the official site for confirmation.  
- 📝 Format clearly with bullet points, numbered steps, or short paragraphs.  
- ✅ Keep tone professional and helpful (no "Hello there!" intros).  
- 🌐 Provide links only as *additional reference* at the end, not in the middle of the answer.  

Example (for "last date of application"):
"📅 The last date for application is usually **July–August** for most UG/PG programs.  
For exact current deadlines, please check the Admission Notice section.  

🔗 Official site: www.brainwareuniversity.ac.in | ☎️ Helpline: +91-33-7144-5590"
`;

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.5, // less random, more factual
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
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
        let geminiResponse = data.candidates[0].content.parts[0].text.trim();

        // 🌐 Translate if user selected another language
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
      return "⚠️ Sorry, I'm having trouble connecting. Please try again later or contact Brainware University administration.";
    }
  };

  // --- audio unlock helper (important to bypass browser autoplay restrictions) ---
  const ensureAudioUnlocked = async () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // create a tiny silent buffer and play it to guarantee audio output unlocked
      try {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(ctx.destination);
        src.start(0);
        src.stop(0);
      } catch (e) {
        // some platforms may not allow this; it's best-effort
      }
    } catch (err) {
      console.warn("ensureAudioUnlocked error:", err);
    }
  };

  // speak response with best matching voice
  const speakResponse = (text) => {
    if (isMuted) return;
    if (!("speechSynthesis" in window)) return;

    try {
      const synth = window.speechSynthesis;
      // If voices still empty, try to fetch once more
      const availableVoices = voices.length ? voices : synth.getVoices();
      const utter = new SpeechSynthesisUtterance(text);

      // Prefer voice that matches selectedLanguage (prefix match)
      if (availableVoices && availableVoices.length > 0) {
        const match = availableVoices.find((v) =>
          v.lang.toLowerCase().startsWith(selectedLanguage.toLowerCase())
        );
        if (match) utter.voice = match;
      }

      // make sure lang is something supported (fallback to 'en-US' if single letter 'en')
      try {
        utter.lang =
          selectedLanguage.length === 2
            ? `${selectedLanguage}-US`
            : selectedLanguage;
      } catch (e) {
        utter.lang = selectedLanguage;
      }

      synth.cancel();
      synth.speak(utter);
    } catch (err) {
      console.error("speakResponse error:", err);
    }
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    // On first user-generated send, unlock audio and unmute
    if (isFirstInteraction) {
      try {
        await ensureAudioUnlocked();
      } catch (e) {
        console.warn("Audio unlock attempt failed:", e);
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
    }

    setInputMessage("");

    // Scroll to top immediately after sending the message
    if (chatTopRef.current) {
      chatTopRef.current.scrollIntoView({ behavior: "smooth" });
    }

    const botResponse = await callGeminiAPI(messageText, selectedLanguage);

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

      // Speak the response (will be no-op if still muted)
      speakResponse(botResponse);
    } catch (error) {
      console.error("Error saving AI message:", error);
    }
  };

  const handleQuickMessage = async (messageText) => {
    if (isFirstInteraction) {
      try {
        await ensureAudioUnlocked();
      } catch (e) {
        console.warn("Audio unlock attempt failed:", e);
      } finally {
        setIsMuted(false);
        setIsFirstInteraction(false);
      }
    }

    // Scroll to top before sending the message
    if (chatTopRef.current) {
      chatTopRef.current.scrollIntoView({ behavior: "smooth" });
    }

    handleSendMessage(messageText);
  };

  const toggleVoice = async () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        console.warn("recognition stop error:", e);
      }
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        console.error("Speech recognition not supported");
        return;
      }

      // first interaction unlock
      if (isFirstInteraction) {
        try {
          await ensureAudioUnlocked();
        } catch (e) {
          console.warn("Audio unlock attempt failed:", e);
        } finally {
          setIsMuted(false);
          setIsFirstInteraction(false);
        }
      }

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        // start() may throw if called twice or if permissions denied
        console.error("recognition.start() error:", err);
        setIsListening(false);
      }
    }
  };

  const toggleMute = async () => {
    // treat manual toggle as a user interaction (unlocks audio)
    if (isFirstInteraction) {
      try {
        await ensureAudioUnlocked();
      } catch (e) {
        console.warn("Audio unlock attempt failed:", e);
      } finally {
        setIsFirstInteraction(false);
      }
    }

    setIsMuted((prev) => {
      const next = !prev;
      // if unmuting right away, very small chance voices not loaded; try to fetch
      if (!next && window.speechSynthesis) {
        window.speechSynthesis.getVoices();
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
