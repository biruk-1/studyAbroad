import { useState, useEffect } from "react";
import { supabase } from "../supabase";

type ChatMessage = {
  id: number;
  user_id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  is_admin: boolean;
  created_at: string;
};

const AdminChat = () => {
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from("chat")
        .select("id, user_id, sender_name, sender_email, message, is_admin, created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching chats:", error);
      } else {
        const groupedChats = data.reduce((acc: Record<string, ChatMessage[]>, msg) => {
          const userId = msg.user_id;
          if (!acc[userId]) acc[userId] = [];
          acc[userId].push(msg);
          return acc;
        }, {});
        setChats(groupedChats);
      }
    };

    fetchChats();

    const channel = supabase
      .channel("chat-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat" },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setChats((prev) => ({
            ...prev,
            [newMsg.user_id]: [...(prev[newMsg.user_id] || []), newMsg],
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !reply.trim()) return;

    try {
      const { error } = await supabase
        .from("chat")
        .insert([
          {
            user_id: selectedUser,
            sender_name: "Admin",
            sender_email: "admin@studyabroad.com",
            message: reply,
            is_admin: true,
          },
        ]);

      if (error) throw error;
      setReply("");
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return (
    <div className="py-10">
      <div className="container mx-auto flex gap-4">
        {/* User List */}
        <div className="w-1/3 border rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">Active Chats</h2>
          {Object.keys(chats).length === 0 ? (
            <p>No active chats yet.</p>
          ) : (
            Object.entries(chats).map(([userId, messages]) => (
              <div
                key={userId}
                className={`p-2 mb-2 cursor-pointer rounded ${selectedUser === userId ? "bg-blue-100" : "hover:bg-gray-100"}`}
                onClick={() => setSelectedUser(userId)}
              >
                <p className="font-semibold">{messages[0].sender_name}</p>
                <p className="text-sm text-gray-600">{messages[0].sender_email}</p>
              </div>
            ))
          )}
        </div>

        {/* Chat Window */}
        <div className="w-2/3 border rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">
            {selectedUser ? `Chat with ${chats[selectedUser]?.[0]?.sender_name}` : "Select a user"}
          </h2>
          {selectedUser ? (
            <>
              <div className="h-64 overflow-y-auto bg-gray-50 p-2 rounded">
                {chats[selectedUser]?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 ${msg.is_admin ? "text-right" : "text-left"}`}
                  >
                    <span className="text-gray-600 text-sm">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                    <p className={msg.is_admin ? "text-blue-600" : ""}>{msg.message}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleReply} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="flex-grow border p-2 rounded"
                  placeholder="Type your reply..."
                />
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                  Send
                </button>
              </form>
            </>
          ) : (
            <p className="text-gray-500">Select a user to start chatting.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;