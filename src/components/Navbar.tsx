import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaPlaneDeparture, FaBars, FaTimes, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-b from-black to-blue-900 text-white shadow-lg sticky top-0 z-50 font-poppins">
      {/* Top Bar (Contact Info & Socials) */}
      <div className="hidden md:flex items-center justify-between px-4 py-2 bg-gray-900 text-sm text-white">
        {/* <div className="flex items-center gap-4">
          <span>📧 info@studyabroad.com</span>
          <span>📍 12 Queen Park, LA, USA</span>
          <span>🕒 Mon-Sat: 09:00-18:00</span>
        </div> */}
        {/* <div className="flex items-center gap-4">
          <a href="#" className="hover:text-yellow-400 transition-colors duration-300"><FaFacebook /></a>
          <a href="#" className="hover:text-yellow-400 transition-colors duration-300"><FaTwitter /></a>
          <a href="#" className="hover:text-yellow-400 transition-colors duration-300"><FaInstagram /></a>
          <Link
            to="/login"
            className="bg-yellow-500 text-black px-3 py-1 rounded-full hover:bg-yellow-600 transition-all duration-300"
          >
            Appointment
          </Link>
        </div>*/}
      </div> 

      {/* Main Navbar */}
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold transition-transform hover:scale-105">
          <FaPlaneDeparture className="text-yellow-400" />
          Study Abroad
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            // Secured Components (Logged In) - Dim Colors
            <>
              <Link to="/countries" className="hover:text-yellow-400 transition-colors duration-300 text-gray-dim">Countries</Link>
              <Link to="/services" className="hover:text-yellow-400 transition-colors duration-300 text-gray-dim">Services</Link>
              <Link to="/recommendations" className="hover:text-yellow-400 transition-colors duration-300 text-gray-dim">Recommendations</Link>
              <Link to="/documents" className="hover:text-yellow-400 transition-colors duration-300 text-gray-dim">Documents</Link>
              <Link to="/profile" className="hover:text-yellow-400 transition-colors duration-300 text-gray-dim">Profile</Link>
              <Link to="/admin/chat" className="hover:text-yellow-400 transition-colors duration-300 text-gray-dim">Admin Chat</Link>
              <button
                onClick={handleLogout}
                className="bg-gray-dim text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            // Public Components (Not Logged In) - Bright Colors
            <>
              <Link to="/" className="hover:text-yellow-400 transition-colors duration-300 text-yellow-400">Home</Link>
              <Link to="/about" className="hover:text-yellow-400 transition-colors duration-300 text-yellow-400">About</Link>
              <Link to="/contact" className="hover:text-yellow-400 transition-colors duration-300 text-yellow-400">Contact</Link>
              <Link to="/testimonials" className="hover:text-yellow-400 transition-colors duration-300 text-yellow-400">Testimonials</Link>
              <Link to="/blog" className="hover:text-yellow-400 transition-colors duration-300 text-yellow-400">Blog</Link>
              <Link
                to="/login"
                className="bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600 transition-all duration-300"
              >
                Login / Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl focus:outline-none text-yellow-400"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-900 text-white px-4 py-6 space-y-4 animate-slide-in font-poppins">
          {user ? (
            // Secured Components (Logged In) - Dim Colors
            <>
              <Link to="/countries" className="block hover:text-yellow-400 transition-colors duration-300 text-gray-dim" onClick={toggleMobileMenu}>
                Countries
              </Link>
              <Link to="/services" className="block hover:text-yellow-400 transition-colors duration-300 text-gray-dim" onClick={toggleMobileMenu}>
                Services
              </Link>
              <Link to="/recommendations" className="block hover:text-yellow-400 transition-colors duration-300 text-gray-dim" onClick={toggleMobileMenu}>
                Recommendations
              </Link>
              <Link to="/documents" className="block hover:text-yellow-400 transition-colors duration-300 text-gray-dim" onClick={toggleMobileMenu}>
                Documents
              </Link>
              <Link to="/profile" className="block hover:text-yellow-400 transition-colors duration-300 text-gray-dim" onClick={toggleMobileMenu}>
                Profile
              </Link>
              <Link to="/admin/chat" className="block hover:text-yellow-400 transition-colors duration-300 text-gray-dim" onClick={toggleMobileMenu}>
                Admin Chat
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left bg-gray-dim text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            // Public Components (Not Logged In) - Bright Colors
            <>
              <Link to="/" className="block hover:text-yellow-400 transition-colors duration-300 text-yellow-400" onClick={toggleMobileMenu}>
                Home
              </Link>
              <Link to="/about" className="block hover:text-yellow-400 transition-colors duration-300 text-yellow-400" onClick={toggleMobileMenu}>
                About
              </Link>
              <Link to="/contact" className="block hover:text-yellow-400 transition-colors duration-300 text-yellow-400" onClick={toggleMobileMenu}>
                Contact
              </Link>
              <Link to="/testimonials" className="block hover:text-yellow-400 transition-colors duration-300 text-yellow-400" onClick={toggleMobileMenu}>
                Testimonials
              </Link>
              <Link to="/blog" className="block hover:text-yellow-400 transition-colors duration-300 text-yellow-400" onClick={toggleMobileMenu}>
                Blog
              </Link>
              <Link
                to="/login"
                className="block bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600 transition-all duration-300"
                onClick={toggleMobileMenu}
              >
                Login / Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;