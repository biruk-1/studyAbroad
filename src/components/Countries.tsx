// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { supabase } from "../supabase";

// type Country = {
//   id: number;
//   name: string;
//   flag: string;
//   details: string;
// };

// const Countries = () => {
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("countries")
//           .select("id, name, flag, details")
//           .order("name", { ascending: true });

//         if (error) throw error;
//         setCountries(data || []);
//       } catch (error) {
//         console.error("Error fetching countries:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCountries();
//   }, []);

//   if (loading) return <div className="py-10 text-center">Loading countries...</div>;

//   return (
//     <div className="py-10">
//       <div className="container mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-6">Explore Countries</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {countries.map((country) => (
//             <div key={country.id} className="border p-4 rounded-lg text-center">
//               <span className="text-4xl">{country.flag}</span>
//               <h3 className="text-xl font-semibold mt-2">{country.name}</h3>
//               <p>{country.details}</p>
//               <Link to={`/countries/${country.name}`} className="text-blue-600">
//                 View Details
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Countries;

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

type Country = {
  id: number;
  name: string;
  flag: string;
  details: string;
};

const Countries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase.from("countries").select("id, name, flag, details");
      if (error) setError("Failed to load countries.");
      else setCountries(data || []);
    };
    fetchCountries();
  }, []);

  return (
    <div className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Explore Countries</h2>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {countries.map((country) => (
            <Link
              key={country.id}
              to={`/countries/${country.name.toLowerCase()}`}
              className="bg-white p-6 rounded-xl shadow-custom hover:shadow-lg transition-all"
            >
              <span className="text-5xl block text-center mb-4">{country.flag}</span>
              <h3 className="text-xl font-semibold text-gray-800 text-center">{country.name}</h3>
              <p className="text-gray-600 text-center mt-2">{country.details}</p>
              <div className="flex justify-center mt-4 text-blue-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>Learn More</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Countries;