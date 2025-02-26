import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-8">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm">&copy; 2025 Study Abroad Consultation. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-xl hover:text-orange-400 transition-all"><FaFacebook /></a>
          <a href="#" className="text-xl hover:text-orange-400 transition-all"><FaTwitter /></a>
          <a href="#" className="text-xl hover:text-orange-400 transition-all"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;