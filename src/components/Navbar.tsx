// import { Link } from "react-router-dom";
// import { supabase } from "../supabase";
// import { useAuth } from "../hooks/useAuth";

// const Navbar = () => {
//   const { user, signOut } = useAuth();

//   const handleLogout = async () => {
//     await signOut();
//   };

//   return (
//     <nav className="bg-blue-600 text-white p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold">Study Abroad</Link>
//         <div className="flex items-center space-x-4">
//           <Link to="/" className="hover:underline">Home</Link>
//           <Link to="/countries" className="hover:underline">Countries</Link>
//           <Link to="/services" className="hover:underline">Services</Link>
//           <Link to="/recommendations" className="hover:underline">Recommendations</Link>
//           <Link to="/documents" className="hover:underline">Documents</Link>
//           <Link to="/profile" className="hover:underline">Profile</Link>
//           <Link to="/testimonials" className="hover:underline">Testimonials</Link>
//           <Link to="/blog" className="hover:underline">Blog</Link>
//           <Link to="/about" className="hover:underline">About</Link>
//           <Link to="/contact" className="hover:underline">Contact</Link>
//           {user ? (
//             <button
//               onClick={handleLogout}
//               className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
//             >
//               Logout
//             </button>
//           ) : (
//             <Link
//               to="/login"
//               className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
//             >
//               Login / Register
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaPlaneDeparture } from "react-icons/fa";

const Navbar = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 shadow-custom sticky top-0 z-50">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <FaPlaneDeparture className="text-orange-400" />
          Study Abroad
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6">
            <Link to="/" className="hover:text-orange-400 transition-all">Home</Link>
            <Link to="/countries" className="hover:text-orange-400 transition-all">Countries</Link>
            <Link to="/services" className="hover:text-orange-400 transition-all">Services</Link>
            <Link to="/recommendations" className="hover:text-orange-400 transition-all">Recommendations</Link>
            <Link to="/documents" className="hover:text-orange-400 transition-all">Documents</Link>
            <Link to="/profile" className="hover:text-orange-400 transition-all">Profile</Link>
            <Link to="/testimonials" className="hover:text-orange-400 transition-all">Testimonials</Link>
            <Link to="/blog" className="hover:text-orange-400 transition-all">Blog</Link>
            <Link to="/about" className="hover:text-orange-400 transition-all">About</Link>
            <Link to="/contact" className="hover:text-orange-400 transition-all">Contact</Link>
          </div>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-all"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;