// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { supabase } from "../supabase";

// type Country = {
//   id: number;
//   name: string;
//   flag: string;
// };
// type Service = {
//   id: number;
//   name: string;
//   icon: string;
// };

// const Home = () => {
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [countriesRes, servicesRes] = await Promise.all([
//           supabase.from("countries").select("id, name, flag").order("name", { ascending: true }),
//           supabase.from("services").select("id, name, icon").order("name", { ascending: true }),
//         ]);

//         if (countriesRes.error) throw countriesRes.error;
//         if (servicesRes.error) throw servicesRes.error;

//         setCountries(countriesRes.data || []);
//         setServices(servicesRes.data || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <div className="py-10 text-center">Loading...</div>;

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
//         <div className="container mx-auto text-center">
//           <h1 className="text-4xl font-bold mb-4">Your Journey to Study Abroad Starts Here</h1>
//           <p className="text-lg mb-8">Expert guidance for your global education dreams.</p>
//           <Link to="/contact" className="bg-white text-blue-600 py-3 px-6 rounded-lg">
//             Get Started
//           </Link>
//         </div>
//       </section>

//       {/* Featured Countries Section */}
//       <section className="py-10">
//         <div className="container mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-6">Featured Countries</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {countries.map((country) => (
//               <div key={country.id} className="border p-4 rounded-lg text-center">
//                 <span className="text-4xl">{country.flag}</span>
//                 <h3 className="text-xl font-semibold mt-2">{country.name}</h3>
//                 <Link to={`/countries/${country.name}`} className="text-blue-600">
//                   Learn More
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Services Intro */}
//       <section className="py-10 bg-gray-100">
//         <div className="container mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {services.map((service) => (
//               <div key={service.id} className="border p-4 rounded-lg text-center">
//                 <span className="text-4xl">{service.icon}</span>
//                 <h3 className="text-xl font-semibold mt-2">{service.name}</h3>
//               </div>
//             ))}
//           </div>
//           <div className="text-center mt-6">
//             <Link to="/services" className="text-blue-600">See All Services</Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

import { Link } from "react-router-dom";
import { FaGlobe, FaGraduationCap } from "react-icons/fa";

const Home = () => {
  return (
    <div className="py-16">
      <div className="container">
        <section className="relative bg-cover bg-center h-96 rounded-xl shadow-custom" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Your Study Abroad Journey</h1>
            <p className="text-lg md:text-xl mb-6">Personalized guidance for your global education dreams.</p>
            <Link to="/recommendations" className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all">Get Started</Link>
          </div>
        </section>
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-custom text-center">
            <FaGlobe className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Discover Countries</h3>
            <p className="text-gray-600">Explore top study destinations worldwide.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-custom text-center">
            <FaGraduationCap className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
            <p className="text-gray-600">Tailored advice for applications and visas.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-custom text-center">
            <FaGlobe className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Stories</h3>
            <p className="text-gray-600">Hear from students who’ve been there.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;