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
import withClassName from "./withClassName";

const CountriesWithClassName = withClassName(Countries);
const CountryDetailWithClassName = withClassName(CountryDetail);
const ServicesWithClassName = withClassName(Services);
const AboutWithClassName = withClassName(About);
const ContactWithClassName = withClassName(Contact);
const TestimonialsWithClassName = withClassName(Testimonials);
const BlogWithClassName = withClassName(Blog);
const LoginWithClassName = withClassName(Login);
const RecommendationsWithClassName = withClassName(Recommendations);
const DocumentsWithClassName = withClassName(Documents);
const ProfileWithClassName = withClassName(Profile);
const ProtectedAdminChatWithClassName = withClassName(ProtectedAdminChat);

function ProtectedRoute({ children, user, loading }: { children: JSX.Element, user: any, loading: boolean }) {
  if (loading) return <div className="text-center py-16 text-yellow-400 font-poppins">Loading...</div>;
  return user ? children : <Navigate to="/" state={{ from: window.location.pathname }} replace />;
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Home />
      <div className="container py-16 space-y-16 overflow-y-auto">
        <CountriesWithClassName className="font-roboto" />
        <ServicesWithClassName className="font-lora" />
        <AboutWithClassName className="font-source-sans" />
        <ContactWithClassName className="font-noto-serif" />
        <TestimonialsWithClassName className="font-playfair" />
        <BlogWithClassName className="font-raleway" />
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
            <Route path="/about" element={<AboutWithClassName className="font-source-sans" />} />
            <Route path="/contact" element={<ContactWithClassName className="font-noto-serif" />} />
            <Route path="/testimonials" element={<TestimonialsWithClassName className="font-playfair" />} />
            <Route path="/blog" element={<BlogWithClassName className="font-raleway" />} />
            <Route path="/login" element={<LoginWithClassName className="font-poppins" />} />
            <Route
              path="/countries"
              element={<ProtectedRoute user={user} loading={loading}><CountriesWithClassName className="font-roboto" /></ProtectedRoute>}
            />
            <Route
              path="/countries/:countryName"
              element={<ProtectedRoute user={user} loading={loading}><CountryDetailWithClassName className="font-roboto" /></ProtectedRoute>}
            />
            <Route
              path="/services"
              element={<ProtectedRoute user={user} loading={loading}><ServicesWithClassName className="font-lora" /></ProtectedRoute>}
            />
            <Route
              path="/recommendations"
              element={<ProtectedRoute user={user} loading={loading}><RecommendationsWithClassName className="font-open-sans" /></ProtectedRoute>}
            />
            <Route
              path="/documents"
              element={<ProtectedRoute user={user} loading={loading}><DocumentsWithClassName className="font-montserrat" /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute user={user} loading={loading}><ProfileWithClassName className="font-merriweather" /></ProtectedRoute>}
            />
            <Route
              path="/admin/chat"
              element={<ProtectedRoute user={user} loading={loading}><ProtectedAdminChatWithClassName className="font-montserrat" /></ProtectedRoute>}
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