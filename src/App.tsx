import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import Home from "./components/Home.tsx";
import Countries from "./components/Counteries.js";
import CountryDetail from "./components/CountryDetail.tsx";
import Services from "./components/Services.tsx";
import About from "./components/About.tsx";
import Contact from "./components/Contact.tsx";
import Chat from "./components/Chat.tsx";
import ProtectedAdminChat from "./components/ProtectedAdminChat.tsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/countries/:countryName" element={<CountryDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/chat" element={<ProtectedAdminChat />} />
          </Routes>
        </main>
        <Footer />
        <Chat /> {/* Chat bubble on all pages */}
      </div>
    </Router>
  );
}

export default App;