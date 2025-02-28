import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black to-blue-900 text-white py-8 font-poppins">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-center md:text-left text-gray-300">© 2025 Study Abroad Consultation. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="text-xl hover:text-yellow-400 transition-colors duration-300"><FaFacebook /></a>
          <a href="#" className="hover:text-yellow-400 transition-colors duration-300 text-xl"><FaTwitter /></a>
          <a href="#" className="hover:text-yellow-400 transition-colors duration-300 text-xl"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;