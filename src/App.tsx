import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import Home from "./components/Home.tsx";
import Countries from "./components/Countries.tsx";
import CountryDetail from "./components/CountryDetail.tsx";
import Services from "./components/Services.tsx";
import About from "./components/About.tsx";
import Contact from "./components/Contact.tsx";
import Chat from "./components/Chat.tsx";
import AIChatBot from "./components/AIChatBot.tsx";
import Recommendations from "./components/Recommendations.tsx";
import Documents from "./components/Documents.tsx";
import Profile from "./components/Profile.tsx";
import Testimonials from "./components/Testimonials.tsx";
import Blog from "./components/Blog.tsx";
import Login from "./components/Login.tsx";
import ProtectedAdminChat from "./components/ProtectedAdminChat.tsx";
import { useAuth } from "./hooks/useAuth"; // Correct path assuming src/hooks/

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/countries"
              element={<ProtectedRoute><Countries /></ProtectedRoute>}
            />
            <Route
              path="/countries/:countryName"
              element={<ProtectedRoute><CountryDetail /></ProtectedRoute>}
            />
            <Route
              path="/services"
              element={<ProtectedRoute><Services /></ProtectedRoute>}
            />
            <Route
              path="/recommendations"
              element={<ProtectedRoute><Recommendations /></ProtectedRoute>}
            />
            <Route
              path="/documents"
              element={<ProtectedRoute><Documents /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/admin/chat"
              element={<ProtectedRoute><ProtectedAdminChat /></ProtectedRoute>}
            />
          </Routes>
        </main>
        <Footer />
        <AIChatBot onLiveChatToggle={() => setIsLiveChatOpen(true)} />
        <Chat isLiveChatOpen={isLiveChatOpen} />
      </div>
    </Router>
  );
}

export default App;