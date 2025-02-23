import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li><NavLink to="/" className="hover:underline">Home</NavLink></li>
            <li><NavLink to="/countries" className="hover:underline">Countries</NavLink></li>
            <li><NavLink to="/services" className="hover:underline">Services</NavLink></li>
            <li><NavLink to="/about" className="hover:underline">About Us</NavLink></li>
            <li><NavLink to="/contact" className="hover:underline">Contact</NavLink></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">Instagram</a>
          </div>
        </div>

        {/* Copyright */}
        <div>
          <p>© {new Date().getFullYear()} Study Abroad Consultation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;