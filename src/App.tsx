import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

interface ComponentWithClassNameProps {
  className?: string;
}

function ProtectedRoute({ children, user, loading }: { children: JSX.Element, user: any, loading: boolean }) {
  if (loading) return <div className="text-center py-16 text-yellow-400 font-poppins">Loading...</div>;
  return user ? children : <Navigate to="/" state={{ from: window.location.pathname }} replace />;
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Home />
      <div className="container py-16 space-y-16 overflow-y-auto">
        <Countries className="font-roboto" />
        <Services className="font-lora" />
        <About className="font-source-sans" />
        <Contact className="font-noto-serif" />
        <Testimonials className="font-playfair" />
        <Blog className="font-raleway" />
         {/* Optional—only visible if logged in, but show placeholder */}
      </div>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-16 text-yellow-400 font-poppins">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/countries" replace /> : <LandingPage />} />
            <Route path="/about" element={<About className="font-source-sans" />} />
            <Route path="/contact" element={<Contact className="font-noto-serif" />} />
            <Route path="/testimonials" element={<Testimonials className="font-playfair" />} />
            <Route path="/blog" element={<Blog className="font-raleway" />} />
            <Route path="/login" element={<Login className="font-poppins" />} />
            <Route
              path="/countries"
              element={<ProtectedRoute user={user} loading={loading}><Countries className="font-roboto" /></ProtectedRoute>}
            />
            <Route
              path="/countries/:countryName"
              element={<ProtectedRoute user={user} loading={loading}><CountryDetail className="font-roboto" /></ProtectedRoute>}
            />
            <Route
              path="/services"
              element={<ProtectedRoute user={user} loading={loading}><Services className="font-lora" /></ProtectedRoute>}
            />
            <Route
              path="/recommendations"
              element={<ProtectedRoute user={user} loading={loading}><Recommendations className="font-open-sans" /></ProtectedRoute>}
            />
            <Route
              path="/documents"
              element={<ProtectedRoute user={user} loading={loading}><Documents className="font-montserrat" /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute user={user} loading={loading}><Profile className="font-merriweather" /></ProtectedRoute>}
            />
            <Route
              path="/admin/chat"
              element={<ProtectedRoute user={user} loading={loading}><ProtectedAdminChat className="font-montserrat" /></ProtectedRoute>}
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