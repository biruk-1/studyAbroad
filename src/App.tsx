import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"; // Added useLocation
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Countries from "./components/Countries";
import CountryDetail from "./components/CountryDetail";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";
import Chat from "./components/Chat";
import AIChatBot from "./components/AIChatBot";
import Recommendations from "./components/Recommendations";
import Documents from "./components/Documents";
import Profile from "./components/Profile";
import Testimonials from "./components/Testimonials";
import Blog from "./components/Blog";
import Login from "./components/Login";
import ProtectedAdminChat from "./components/ProtectedAdminChat";
import { useAuth } from "./hooks/useAuth";
import { JSX } from "react";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation(); // Now defined
  console.log("ProtectedRoute - User:", user, "Loading:", loading);
  if (loading) return <div className="text-center py-16 text-gray-600">Loading...</div>;
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

function App() {
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
        <AIChatBot />
        <Chat />
      </div>
    </Router>
  );
}

export default App;