import { FormEvent, useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";

type Country = {
  name: string;
  cost_of_living: string;
  visa_process: string;
};

const AIChatBot = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi! I’m your Study Abroad AI. Ask about visas, costs, or countries!", isUser: false },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false); // Toggle live chat
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch countries for context
  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from("countries")
        .select("name, cost_of_living, visa_process");

      if (error) console.error("Error fetching countries:", error);
      else setCountries(data || []);
    };

    fetchCountries();
  }, []);

  const fetchHuggingFaceResponse = async (message: string) => {
    setIsLoading(true);
    try {
      // Build context from Supabase countries
      const context = countries
        .map((c) => `${c.name}: Cost: ${c.cost_of_living}, Visa: ${c.visa_process}`)
        .join("\n");

      const response = await fetch(
        "https://api-inference.huggingface.co/models/mixtralai/Mixtral-8x7B-Instruct-v0.1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer hf_YourTokenHere`, // Replace with your token
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `You are a Study Abroad AI Assistant. Use this data:\n${context}\nAnswer this question concisely: "${message}"`,
            parameters: { max_length: 150, temperature: 0.7 },
          }),
        }
      );

      if (!response.ok) throw new Error(`Hugging Face API error: ${response.status}`);
      const data = await response.json();
      const text = data[0]?.generated_text || "I couldn’t generate a response.";
      return text.replace(/You are a Study Abroad AI Assistant.*?"${message}"/, "").trim();
    } catch (error) {
      console.error("Hugging Face error:", error);
      return "Oops! Try again or switch to live chat.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput;
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setChatInput("");
    setChatError(null);

    const aiResponse = await fetchHuggingFaceResponse(userMessage);
    setMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
  };

  const toggleLiveChat = () => {
    setIsChatOpen(false);
    setIsLiveChatOpen(true); // Trigger live chat (handled by Chat.tsx visibility)
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-all animate-bounce"
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
              d="M16 8v-2a4 4 0 00-8 0v2m-4 6h16m-2-4h-2v4h2v-4zm-8 0h-2v4h2v-4zm4-4h4m-2 0v4"
            />
          </svg>
        </button>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-36 right-4 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="bg-green-600 text-white p-2 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">AI Study Abroad Bot</h3>
            <button onClick={() => setIsChatOpen(false)} className="text-sm underline">
              Close
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.isUser ? "text-right" : "text-left"}`}>
                <span className="text-gray-600 text-sm">{new Date().toLocaleTimeString()}</span>
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
              placeholder="Ask about study abroad..."
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </form>
          <button
            onClick={toggleLiveChat}
            className="w-full text-blue-600 p-2 text-sm hover:underline"
          >
            Switch to Live Chat
          </button>
          {chatError && <p className="p-2 text-center text-sm text-red-500">{chatError}</p>}
        </div>
      )}
    </>
  );
};

export default AIChatBot;