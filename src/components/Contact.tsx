import { FormEvent, useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../hooks/useAuth";

type ChatMessage = {
  id: number;
  message: string;
  is_admin: boolean;
  created_at: string;
};

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const { user, loading: authLoading } = useAuth();

  // Contact form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("contacts")
        .insert([{ name, email, message }]);

      if (error) throw error;

      setStatus("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("Failed to send message.");
    }
  };

  // Chat logic
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

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !user || !name || !email) return;

    try {
      const { error } = await supabase
        .from("chat")
        .insert([{ user_id: user.id, sender_name: name, sender_email: email, message: chatInput }]);

      if (error) throw error;
      setChatInput("");
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  if (authLoading) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-1">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border p-2 rounded"
              rows={4}
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
            Send
          </button>
        </form>
        {status && <p className="mt-4 text-center">{status}</p>}

        <div className="mt-10 max-w-lg mx-auto">
          <h3 className="text-2xl font-semibold text-center mb-4">Live Chat</h3>
          <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-gray-50">
            {chatMessages.length === 0 ? (
              <p className="text-gray-500 text-center">Start chatting with us!</p>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 ${msg.is_admin ? "text-right" : "text-left"}`}
                >
                  <span className="text-gray-600 text-sm">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                  <p className={msg.is_admin ? "text-blue-600" : ""}>{msg.message}</p>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleChatSubmit} className="mt-4 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow border p-2 rounded"
              placeholder="Type your message..."
              disabled={!name || !email}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded"
              disabled={!name || !email}
            >
              Send
            </button>
          </form>
          {!name || !email ? (
            <p className="text-red-500 text-sm mt-2">Please enter your name and email to chat.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Contact;