import { FormEvent, useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../hooks/useAuth";

type ChatMessage = {
  id: number;
  message: string;
  is_admin: boolean;
  created_at: string;
};

const Chat = () => {
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi! I’m your Study Abroad Bot. Ask me about visas, countries, or applications!", isUser: false },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatStatus, setChatStatus] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading: authLoading, error: authError, signIn, signUp, signOut } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginName, setLoginName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const fetchWitResponse = async (message: string) => {
    try {
      const response = await fetch(`https://api.wit.ai/message?v=20230215&q=${encodeURIComponent(message)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_WIT_AI_TOKEN}`,
        },
      });
      const data = await response.json();
      const intent = data.intents[0]?.name || "unknown";
      switch (intent) {
        case "visa_query":
          return "Visa processes vary by country. For example, the UK requires a Tier 4 Visa. Ask me about a specific country!";
        case "country_selection":
          return "Popular study abroad destinations include the UK, USA, and Canada. What field are you studying?";
        case "application_help":
          return "Applications typically need an SOP, transcripts, and recommendation letters. Need details?";
        default:
          return "I’m not sure about that. Try asking about visas, countries, or applications!";
      }
    } catch (error) {
      console.error("Wit.ai error:", error);
      return "Sorry, I couldn’t process that. Try again!";
    }
  };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [...prev, { text: chatInput, isUser: true }]);
    const userMessage = chatInput;
    setChatInput("");

    if (!user) {
      setPendingMessage(userMessage);
      setShowAuth(true);
      return;
    }

    try {
      const aiResponse = await fetchWitResponse(userMessage);
      setChatMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
      setChatStatus("AI responded!");
      setChatError(null);

      // Optionally store in Supabase chat table
      const { error } = await supabase.from("chat").insert([
        {
          user_id: user.id,
          sender_name: user.user_metadata?.name || "User",
          sender_email: user.email || "unknown@example.com",
          message: userMessage,
        },
      ]);
      if (error) throw error;
    } catch (error) {
      console.error("Error in chat:", error);
      setChatError(`Failed to process message: ${error.message}`);
      setChatStatus("");
    }
  };

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(loginEmail)) {
      setChatError("Please enter a valid email address.");
      return;
    }

    if (isSignup) {
      const signupMessage = await signUp(loginEmail, loginPassword, loginName);
      if (signupMessage) {
        setChatStatus(signupMessage);
        setChatError(null);
        setTimeout(() => {
          setIsSignup(false);
          setLoginPassword("");
          setLoginName("");
          setChatStatus("Please confirm your email, then log in.");
        }, 3000);
      }
    } else {
      await signIn(loginEmail, loginPassword);
      if (!authError && user) {
        setChatStatus("Successfully logged in!");
        setChatError(null);
        if (pendingMessage) {
          try {
            const aiResponse = await fetchWitResponse(pendingMessage);
            setChatMessages((prev) => [
              ...prev,
              { text: pendingMessage, isUser: true },
              { text: aiResponse, isUser: false },
            ]);
            const { error } = await supabase.from("chat").insert([
              {
                user_id: user.id,
                sender_name: user.user_metadata?.name || "User",
                sender_email: user.email || "unknown@example.com",
                message: pendingMessage,
              },
            ]);
            if (error) throw error;
            setPendingMessage(null);
            setShowAuth(false);
            setChatStatus("Message sent! Chatbot responded.");
          } catch (error) {
            console.error("Error sending pending message:", error);
            setChatError(`Failed to send message: ${error.message}`);
            setChatStatus("");
          }
        } else {
          setShowAuth(false);
        }
      } else if (authError) {
        setChatError(authError);
        setChatStatus("");
      }
    }
  };

  if (authLoading) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all animate-bounce"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white border rounded-lg shadow-lg z-50">
          {user && !showAuth ? (
            <>
              <div className="bg-blue-600 text-white p-2 rounded-t-lg flex justify-between items-center">
                <h3 className="text-lg font-semibold">Live Chat</h3>
                <button onClick={signOut} className="text-sm underline">
                  Logout
                </button>
              </div>
              <div className="p-4 h-64 overflow-y-auto bg-gray-50">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.isUser ? "text-right" : "text-left"}`}>
                    <span className="text-gray-600 text-sm">
                      {new Date().toLocaleTimeString()}
                    </span>
                    <p className={msg.isUser ? "text-blue-600" : "text-green-600"}>{msg.text}</p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleChatSubmit} className="p-2 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow border p-2 rounded"
                  placeholder="Ask the Study Abroad Bot..."
                />
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                  Send
                </button>
              </form>
              {chatStatus && <p className="p-2 text-center text-sm text-green-500">{chatStatus}</p>}
              {chatError && <p className="p-2 text-center text-sm text-red-500">{chatError}</p>}
            </>
          ) : (
            <div className="p-4">
              {showAuth ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">{isSignup ? "Sign Up" : "Login"} to Chat</h3>
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="loginEmail" className="block mb-1">Email</label>
                      <input
                        type="email"
                        id="loginEmail"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                    {isSignup && (
                      <div>
                        <label htmlFor="loginName" className="block mb-1">Name</label>
                        <input
                          type="text"
                          id="loginName"
                          value={loginName}
                          onChange={(e) => setLoginName(e.target.value)}
                          className="w-full border p-2 rounded"
                          required
                        />
                      </div>
                    )}
                    <div>
                      <label htmlFor="loginPassword" className="block mb-1">Password</label>
                      <input
                        type="password"
                        id="loginPassword"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                      {isSignup ? "Sign Up" : "Login"}
                    </button>
                  </form>
                  <button
                    onClick={() => setIsSignup(!isSignup)}
                    className="mt-2 text-blue-600 underline text-sm w-full text-center"
                  >
                    {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
                  </button>
                  {authError && <p className="mt-2 text-red-500 text-center">{authError}</p>}
                  {chatStatus && <p className="mt-2 text-green-500 text-center">{chatStatus}</p>}
                  {chatError && <p className="mt-2 text-red-500 text-center">{chatError}</p>}
                </>
              ) : (
                <>
                  <div className="p-4 h-64 overflow-y-auto bg-gray-50">
                    <p className="text-gray-500 text-center">
                      Chat with the Study Abroad Bot! Type your first message below.
                    </p>
                  </div>
                  <form onSubmit={handleChatSubmit} className="p-2 flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-grow border p-2 rounded"
                      placeholder="Ask about study abroad..."
                    />
                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                      Send
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chat;