// import { FormEvent, useState, useEffect, useRef } from "react";
// import { supabase } from "../supabase";
// import { useAuth } from "../hooks/useAuth";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FaComments } from "react-icons/fa";

// type ChatMessage = {
//   id: number;
//   message: string;
//   is_admin: boolean;
//   created_at: string;
// };

// const Chat = () => {
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
//   const [chatInput, setChatInput] = useState("");
//   const [chatStatus, setChatStatus] = useState("");
//   const [chatError, setChatError] = useState<string | null>(null);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const { user, loading: authLoading, signOut } = useAuth();
//   const chatEndRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (!user) return;

//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from("chat")
//         .select("id, message, is_admin, created_at")
//         .eq("user_id", user.id)
//         .order("created_at", { ascending: true });

//       if (error) {
//         console.error("Error fetching messages:", error);
//         setChatStatus("Failed to load chat history.");
//       } else {
//         setChatMessages(data || []);
//       }
//     };

//     fetchMessages();

//     const channel = supabase
//       .channel(`chat-${user.id}`)
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "chat", filter: `user_id=eq.${user.id}` },
//         (payload) => {
//           setChatMessages((prev) => [...prev, payload.new as ChatMessage]);
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [user]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatMessages]);

//   const handleChatSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!chatInput.trim()) return;

//     if (!user) {
//       navigate("/login", { state: { from: location.pathname, pendingMessage: chatInput } });
//       setChatInput("");
//       return;
//     }

//     try {
//       const { error } = await supabase.from("chat").insert([
//         {
//           user_id: user.id,
//           sender_name: user.user_metadata?.name || "User",
//           sender_email: user.email || "unknown@example.com",
//           message: chatInput,
//         },
//       ]);

//       if (error) throw error;
//       setChatInput("");
//       setChatStatus("Message sent! Waiting for admin reply...");
//       setChatError(null);
//     } catch (error: any) {
//       console.error("Error sending chat message:", error);
//       setChatError(`Failed to send message: ${error.message}`);
//       setChatStatus("");
//     }
//   };

//   const handleLogout = async () => {
//     await signOut();
//     setIsChatOpen(false);
//   };

//   if (authLoading) return null;

//   return (
//     <>
//       <div className="fixed bottom-4 right-4 z-50">
//         <button
//           onClick={() => setIsChatOpen(!isChatOpen)}
//           className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all animate-bounce"
//         >
//           <FaComments className="text-2xl" />
//         </button>
//       </div>

//       {isChatOpen && (
//         <div className="fixed bottom-20 right-4 w-80 bg-white border rounded-xl shadow-lg z-50">
//           {user ? (
//             <>
//               <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">Admin Chat</h3>
//                 <button onClick={handleLogout} className="text-sm underline">
//                   Logout
//                 </button>
//               </div>
//               <div className="p-4 h-64 overflow-y-auto bg-gray-50">
//                 {chatMessages.length === 0 ? (
//                   <p className="text-gray-500 text-center">Chat with an admin! Type below.</p>
//                 ) : (
//                   chatMessages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`mb-2 ${msg.is_admin ? "text-right" : "text-left"}`}
//                     >
//                       <span className="text-gray-600 text-sm">
//                         {new Date(msg.created_at).toLocaleTimeString()}
//                       </span>
//                       <p className={msg.is_admin ? "text-blue-600" : "text-gray-800"}>{msg.message}</p>
//                     </div>
//                   ))
//                 )}
//                 <div ref={chatEndRef} />
//               </div>
//               <form onSubmit={handleChatSubmit} className="p-3 flex gap-2">
//                 <input
//                   type="text"
//                   value={chatInput}
//                   onChange={(e) => setChatInput(e.target.value)}
//                   className="flex-grow border p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Type your message..."
//                 />
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-all"
//                 >
//                   Send
//                 </button>
//               </form>
//               {chatStatus && <p className="p-2 text-center text-sm text-gray-600">{chatStatus}</p>}
//               {chatError && <p className="p-2 text-center text-sm text-red-500">{chatError}</p>}
//             </>
//           ) : (
//             <div className="p-4">
//               <p className="text-gray-500 text-center">Please log in to chat with an admin!</p>
//               <button
//                 onClick={() => navigate("/login", { state: { from: location.pathname } })}
//                 className="w-full bg-blue-600 text-white py-2 px-4 mt-4 rounded-xl hover:bg-blue-700 transition-all"
//               >
//                 Login
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Chat;

import { FormEvent, useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { FaComments } from "react-icons/fa";

type ChatMessage = {
  id: number;
  message: string;
  is_admin: boolean;
  created_at: string;
};

const Chat = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatStatus, setChatStatus] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat")
        .select("id, message, is_admin, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        setChatStatus("Failed to load chat history.");
      } else {
        setChatMessages(data || []);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat", filter: `user_id=eq.${user.id}` },
        (payload) => {
          setChatMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (!user) {
      navigate("/login", { state: { from: location.pathname, pendingMessage: chatInput } });
      setChatInput("");
      return;
    }

    try {
      const { error } = await supabase.from("chat").insert([
        {
          user_id: user.id,
          sender_name: user.user_metadata?.name || "User",
          sender_email: user.email || "unknown@example.com",
          message: chatInput,
        },
      ]);

      if (error) throw error;
      setChatInput("");
      setChatStatus("Message sent! Waiting for admin reply...");
      setChatError(null);
    } catch (error: any) {
      console.error("Error sending chat message:", error);
      setChatError(`Failed to send message: ${error.message}`);
      setChatStatus("");
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsChatOpen(false);
  };

  if (authLoading) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all animate-bounce"
        >
          <FaComments className="text-2xl" />
        </button>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white border rounded-xl shadow-lg z-50">
          {user ? (
            <>
              <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
                <h3 className="text-lg font-semibold">Admin Chat</h3>
                <button onClick={handleLogout} className="text-sm underline">
                  Logout
                </button>
              </div>
              <div className="p-4 h-64 overflow-y-auto bg-gray-50">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500 text-center">Chat with an admin! Type below.</p>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-2 ${msg.is_admin ? "text-right" : "text-left"}`}
                    >
                      <span className="text-gray-600 text-sm">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                      <p className={msg.is_admin ? "text-blue-600" : "text-gray-800"}>{msg.message}</p>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleChatSubmit} className="p-3 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow border p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-all"
                >
                  Send
                </button>
              </form>
              {chatStatus && <p className="p-2 text-center text-sm text-gray-600">{chatStatus}</p>}
              {chatError && <p className="p-2 text-center text-sm text-red-500">{chatError}</p>}
            </>
          ) : (
            <div className="p-4">
              <p className="text-gray-500 text-center">Please log in to chat with an admin!</p>
              <button
                onClick={() => navigate("/login", { state: { from: location.pathname } })}
                className="w-full bg-blue-600 text-white py-2 px-4 mt-4 rounded-xl hover:bg-blue-700 transition-all"
              >
                Login
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chat;