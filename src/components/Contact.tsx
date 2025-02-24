import { FormEvent, useState } from "react";
import { supabase } from "../supabase";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

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
      </div>
    </div>
  );
};

export default Contact;