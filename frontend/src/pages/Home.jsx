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
import { useNavigate } from "react-router-dom";
import { signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";
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
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import { href } from "react-router-dom";

const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
  const navigate = useNavigate();
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

  const UNIVERSITY_LOGO = "./university-logo.png";
  const UNIVERSITY_BUILDING = "./university-building.png";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      setUserId(user.uid);
      loadChatSessions(user.uid);
      if (!currentSessionId) {
        createNewSession(user.uid);
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserId(null);
      setCurrentSessionId(null);
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your AI assistant. How can I help you today? 👋",
          sender: "bot",
          timestamp: new Date(),
          language: "en",
        },
      ]);

      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error logging out");
    }
  };
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
      if (!uid.startsWith("local-user-")) {
        const docRef = await addDoc(collection(db, "sessions"), {
          userId: uid,
          createdAt: new Date(),
          lastActivity: new Date(),
          title: "New Chat",
        });
        setCurrentSessionId(docRef.id);
      } else {
        setCurrentSessionId(`local-${Date.now()}`);
      }
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

  const callGeminiAPI = async (userMessage, language) => {
    setIsTyping(true);
    setApiError(null);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are BrainuBot, the official student assistant for Brainware University.  
                IMPORTANT: You must ONLY answer questions related to Brainware University, its programs, admissions, facilities, events, and related academic matters.
                
                If a question is not related to Brainware University, politely decline to answer and redirect the user to ask about university-related topics.
                
                Your style must always be:
                - 🎯 Give the direct answer first.
                - 🔍 Search the web for the most current info when needed.
                - 📌 If exact date/info is unknown, provide the most likely details.
                - 📝 Format clearly with bullets, numbered steps, or short paragraphs.
                - ✅ Keep tone professional.
                - 🌐 Provide links at the end only.
                - Use markdown formatting.
                
                User question: ${userMessage}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errorMsg =
          errData?.error?.message || `HTTP error: ${response.status}`;

        setApiError(errorMsg);
        toast.error(`AI service error: ${errorMsg}`);

        if (response.status === 401) {
          throw new Error(
            `Authentication failed. Please check your API key. Details: ${errorMsg}`
          );
        } else {
          throw new Error(`Gemini API error: ${response.status} - ${errorMsg}`);
        }
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        let geminiResponse = data.candidates[0].content.parts[0].text.trim();

        // Check if the response is about Brainware University
        const universityKeywords = [
          "brainware",
          "university",
          "admission",
          "course",
          "program",
          "faculty",
          "campus",
          "academic",
          "student",
          "library",
          "hostel",
          "fee",
          "scholarship",
          "placement",
          "event",
        ];

        const isAboutUniversity = universityKeywords.some((keyword) =>
          geminiResponse.toLowerCase().includes(keyword)
        );

        // If the response doesn't seem to be about the university, provide a fallback
        if (
          !isAboutUniversity &&
          !userMessage.toLowerCase().includes("brainware")
        ) {
          geminiResponse =
            "I'm sorry, but I'm specifically designed to answer questions about Brainware University. Please ask me about our programs, admissions process, campus facilities, or any other university-related topics. You can visit our official website https://www.brainwareuniversity.ac.in/ for more information.";
        }

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

  const generatePDF = async () => {
    try {
      const printDiv = document.createElement("div");
      printDiv.style.position = "absolute";
      printDiv.style.left = "-9999px";
      printDiv.style.width = "210mm";
      printDiv.style.padding = "20px";
      printDiv.style.fontSize = "14px";
      printDiv.style.fontFamily = "Arial, sans-serif";
      printDiv.style.backgroundColor = "#f9fafb";

      printDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #2563eb; position: relative;">
        <div style="position: absolute; left: 0; top: 0; opacity: 1;">
          <img src="${UNIVERSITY_LOGO}" style="height: 60px;">
        </div>
        <h1 style="color: #2563eb; margin: 0 50px;">BRAINWARE UNIVERSITY</h1>
        <h2 style="color: #4b5563; margin: 5px 0 10px 0;">AI Assistant Conversation Transcript</h2>
        <p style="color: #6b7280; margin: 0;">Date: ${format(
          new Date(),
          "PPPP"
        )}</p>
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="color: #374151; margin-bottom: 10px; background: linear-gradient(90deg, #2563eb, #1e40af); color: white; padding: 8px 12px; border-radius: 4px;">CONVERSATION TRANSCRIPT</h3>
        <p style="color: #6b7280; margin: 0;">Participants: You & BrainuBot Assistant • ${format(
          new Date(),
          "PPpp"
        )}</p>
      </div>
    `;

      const messagesHTML = messages
        .map((message, index) => {
          const isUser = message.sender === "user";
          const timestamp = message.timestamp?.toDate
            ? format(message.timestamp.toDate(), "p")
            : format(new Date(message.timestamp), "p");
          let processedText = message.text
            .replace(
              /\*\*(.*?)\*\*/g,
              '<strong style="color: #1e40af;">$1</strong>'
            )
            .replace(/\*(.*?)\*/g, '<em style="color: #4338ca;">$1</em>')
            .replace(
              /`(.*?)`/g,
              '<code style="background: #e5e7eb; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>'
            )
            .replace(
              /\[(.*?)\]\((.*?)\)/g,
              '<a href="$2" style="color: #2563eb; text-decoration: underline;">$1</a>'
            )
            .replace(
              /^- (.*?)(?=\n|$)/g,
              '<li style="margin-bottom: 5px;">$1</li>'
            )
            .replace(
              /^\d+\. (.*?)(?=\n|$)/g,
              '<li style="margin-bottom: 5px;">$1</li>'
            )
            .replace(/\n/g, "<br>");

          if (processedText.includes("<li")) {
            if (message.text.match(/^\d+\./)) {
              processedText = `<ol style="padding-left: 20px; margin: 10px 0;">${processedText}</ol>`;
            } else {
              processedText = `<ul style="padding-left: 20px; margin: 10px 0;">${processedText}</ul>`;
            }
          }

          return `
          <div style="margin-bottom: 20px; display: flex; justify-content: ${
            isUser ? "flex-end" : "flex-start"
          };">
            <div style="max-width: 70%; background: ${
              isUser
                ? "linear-gradient(135deg, #dbeafe, #bfdbfe)"
                : "linear-gradient(135deg, #f0f9ff, #e0f2fe)"
            }; 
                        border: ${
                          isUser ? "1px solid #93c5fd" : "1px solid #7dd3fc"
                        }; 
                        border-radius: 12px; padding: 12px 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="font-weight: bold; color: ${
                isUser ? "#1e40af" : "#0c4a6e"
              }; margin-bottom: 5px; display: flex; align-items: center;">
                ${
                  isUser
                    ? '<svg style="width: 16px; height: 16px; margin-right: 5px;" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>'
                    : '<svg style="width: 16px; height: 16px; margin-right: 5px;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>'
                }
                ${isUser ? "You" : "BrainuBot Assistant"}
              </div>
              <div style="color: ${
                isUser ? "#1e3a8a" : "#0c4a6e"
              }; line-height: 1.5; font-size: 13px;">
                ${processedText}
              </div>
              <div style="font-size: 11px; color: ${
                isUser ? "#64748b" : "#0ea5e9"
              }; margin-top: 8px; display: flex; align-items: center;">
                <svg style="width: 12px; height: 12px; margin-right: 4px;" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                </svg>
                ${timestamp}
              </div>
            </div>
          </div>
        `;
        })
        .join("");

      printDiv.innerHTML += messagesHTML;

      printDiv.innerHTML += `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.5; z-index: -1;">
        <img src="${UNIVERSITY_BUILDING}" style="width: 100%; height: 100%; object-fit: contain;">
      </div>
    `;

      document.body.appendChild(printDiv);

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      const canvas = await html2canvas(printDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#f9fafb",
        width: printDiv.offsetWidth,
        height: printDiv.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgProps = doc.getImageProperties(imgData);
      const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

      let position = 0;
      let currentPage = 1;
      const totalPages = Math.ceil(imgHeight / pageHeight);

      while (position < imgHeight) {
        if (currentPage > 1) {
          doc.addPage();
        }

        const srcY = position * (canvas.height / imgHeight);
        const srcHeight = Math.min(
          pageHeight * (canvas.height / imgHeight),
          canvas.height - srcY
        );

        doc.addImage(
          imgData,
          "PNG",
          margin,
          -position + margin,
          contentWidth,
          imgHeight
        );

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${currentPage} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          {
            align: "center",
          }
        );

        position += pageHeight;
        currentPage++;
      }

      document.body.removeChild(printDiv);

      const timestamp = format(new Date(), "yyyy-MM-dd-HH-mm");
      doc.save(`Brainware-Conversation-${timestamp}.pdf`);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = url;
    });
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    if (isFirstInteraction) {
      try {
        await ensureAudioUnlocked();
      } catch (e) {
        console.warn("Audio unlock failed:", e);
      } finally {
        setIsMuted(true);
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

    const predefinedAnswer = quickMessages.find(
      (msg) => msg.text === messageText
    )?.answer;

    let botResponse;
    if (predefinedAnswer) {
      botResponse = predefinedAnswer;
      setIsTyping(false);
    } else {
      botResponse = await callGeminiAPI(messageText, selectedLanguage);
    }

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
        onLogout={handleLogout}
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
            <Chat
              messages={messages}
              isTyping={isTyping}
              onDownload={generatePDF}
            />
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
