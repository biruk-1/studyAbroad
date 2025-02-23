import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Study Abroad</h1>
        <ul className="flex space-x-6">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "underline" : "")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/countries" className={({ isActive }) => (isActive ? "underline" : "")}>
              Countries
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className={({ isActive }) => (isActive ? "underline" : "")}>
              Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "underline" : "")}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? "underline" : "")}>
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;