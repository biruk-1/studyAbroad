import { FormEvent, useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { FaComments } from "react-icons/fa"; // Updated icon for consistency

type Country = {
  name: string;
  cost_of_living: string;
  visa_process: string;
  education_system: string; // Added for more context
  scholarship_opportunities: string; // Added for scholarships
};

const AIChatBot = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! I’m your Study Abroad AI. Ask about visas, costs, scholarships, or countries!", isUser: false },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch countries for context, including scholarship opportunities
  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from("countries")
        .select("name, cost_of_living, visa_process, education_system, scholarship_opportunities");

      if (error) {
        console.error("Error fetching countries:", error.message);
        setChatError("Failed to load country data. Try again later.");
      } else {
        setCountries(data || []);
      }
    };

    fetchCountries();
  }, []);

  // const fetchHuggingFaceResponse = async (message: string) => {
  //   setIsLoading(true);
  //   try {
  //     // Build context from Supabase countries and add service-specific info
  //     const context = `
  //       Study Abroad Services:
  //       - Visas: Required for studying abroad; processes vary by country.
  //       - Costs: Tuition and living expenses differ by country; check cost_of_living.
  //       - Scholarships: Opportunities available; check scholarship_opportunities.
  //       - Countries: Offers education systems and details; use country data below.

  //       Country Data:
  //       ${countries
  //         .map(
  //           (c) => `${c.name}: 
  //             Cost: ${c.cost_of_living}, 
  //             Visa: ${c.visa_process}, 
  //             Education: ${c.education_system || "Not specified"}, 
  //             Scholarships: ${c.scholarship_opportunities || "Not specified"}`
  //         )
  //         .join("\n")}
  //     `;

  //     const response = await fetch(
  //       "https://api-inference.huggingface.co/models/mixtralai/Mixtral-8x7B-Instruct-v0.1",
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer hf_YourTokenHere`, // Replace with your actual Hugging Face token
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           inputs: `You are a Study Abroad AI Assistant for Study Abroad Consultation. Answer concisely and professionally, focusing on visas, costs, scholarships, or countries. Use this context:\n${context}\nQuestion: "${message}"`,
  //           parameters: { max_length: 200, temperature: 0.7, top_p: 0.9 },
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Hugging Face API error: ${response.status} - ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     const text = data[0]?.generated_text || "I’m sorry, I couldn’t generate a response. Please try again or contact support.";
  //     return text.replace(/You are a Study Abroad AI Assistant.*?"${message}"/, "").trim();
  //   } catch (error: any) {
  //     console.error("Hugging Face error:", error);
  //     setChatError(`Error: ${error.message}. Please try again or switch to live chat.`);
  //     return "Oops! There was an issue. Please try again or contact support.";
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchHuggingFaceResponse = async (message: string) => {
    setIsLoading(true);
    try {
      // Build context from Supabase countries and add service-specific info
      const context = `
        Study Abroad Services:
        - Visas: Required for studying abroad; processes vary by country.
        - Costs: Tuition and living expenses differ by country; check cost_of_living.
        - Scholarships: Opportunities available; check scholarship_opportunities for details like merit-based, government, or university grants.
        - Countries: Offers education systems and details; use country data below.
  
        Country Data:
        ${countries
          .map(
            (c) => `${c.name}: 
              Cost: ${c.cost_of_living}, 
              Visa: ${c.visa_process}, 
              Education: ${c.education_system || "Not specified"}, 
              Scholarships: ${c.scholarship_opportunities || "Not specified"}`
          )
          .join("\n")}
      `;
  
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mixtralai/Mixtral-8x7B-Instruct-v0.1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer your_actual_token_here`, // Replace with your token (e.g., hf_abc123xyz...)
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `You are a Study Abroad AI Assistant for Study Abroad Consultation. Answer concisely and professionally, focusing on visas, costs, scholarships, or countries. Use this context:\n${context}\nQuestion: "${message}"`,
            parameters: { max_length: 200, temperature: 0.7, top_p: 0.9 },
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      const text = data[0]?.generated_text || "I’m sorry, I couldn’t generate a response. Please try again or contact support.";
      return text.replace(/You are a Study Abroad AI Assistant.*?"${message}"/, "").trim();
    } catch (error: any) {
      console.error("Hugging Face error:", error);
      setChatError(`Error: ${error.message}. Please try again or switch to live chat.`);
      return "Oops! There was an issue. Please try again or contact support.";
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500 transition-all animate-bounce"
        >
          <FaComments className="w-6 h-6" />
        </button>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-36 right-4 w-80 bg-blue-dark border rounded-xl shadow-lg z-50 font-poppins">
          <div className="bg-yellow-400 text-black p-2 rounded-t-xl flex justify-between items-center">
            <h3 className="text-lg font-semibold">Study Abroad AI</h3>
            <button onClick={() => setIsChatOpen(false)} className="text-sm underline hover:text-gray-700">
              Close
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto bg-gray-dark">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.isUser ? "text-right" : "text-left"}`}>
                <span className="text-gray-400 text-xs block mb-1">{new Date().toLocaleTimeString()}</span>
                <p className={msg.isUser ? "text-yellow-400 bg-blue-dark p-3 rounded-lg inline-block" : "text-white bg-gray-700 p-3 rounded-lg inline-block"}>
                  {msg.text}
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleChatSubmit} className="p-2 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow border border-gray-600 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-700 text-white placeholder-gray-400"
              placeholder="Ask about study abroad, visas, scholarships..."
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black py-2 px-4 rounded-xl hover:bg-yellow-500 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </form>
          {chatError && <p className="p-2 text-center text-sm text-red-500">{chatError}</p>}
        </div>
      )}
    </>
  );
};

export default AIChatBot;