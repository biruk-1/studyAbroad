// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../supabase";

// type CountryDetailData = {
//   flag: string;
//   education_system: string;
//   cost_of_living: string;
//   visa_process: string;
// };

// const CountryDetail = () => {
//   const { countryName } = useParams<{ countryName: string }>();
//   const [country, setCountry] = useState<CountryDetailData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCountry = async () => {
//       console.log("URL countryName:", countryName);
//       try {
//         const { data, error } = await supabase
//           .from("countries")
//           .select("flag, education_system, cost_of_living, visa_process")
//           .eq("name", countryName) // No .toLowerCase()
//           .single();

//         console.log("Supabase response:", { data, error });
//         if (error) throw error;
//         setCountry(data || null);
//       } catch (error) {
//         console.error("Error fetching country:", error);
//         setCountry(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCountry();
//   }, [countryName]);

//   if (loading) return <div className="py-10 text-center">Loading...</div>;
//   if (!country) return <div className="py-10 text-center">Country not found.</div>;

//   return (
//     <div className="py-10">
//       <div className="container mx-auto">
//         <h2 className="text-3xl font-bold mb-6">
//           {countryName} {country.flag}
//         </h2>
//         <p><strong>Education System:</strong> {country.education_system}</p>
//         <p><strong>Cost of Living:</strong> {country.cost_of_living}</p>
//         <p><strong>Visa Process:</strong> {country.visa_process}</p>
//       </div>
//     </div>
//   );
// };

// export default CountryDetail;

// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../supabase";
// import { FaInfoCircle } from "react-icons/fa";

// type Country = {
//   id: number;
//   name: string;
//   flag: string;
//   details: string;
//   education_system: string;
//   cost_of_living: string;
//   visa_process: string;
// };

// const CountryDetail = () => {
//   const { countryName } = useParams<{ countryName: string }>();
//   const [country, setCountry] = useState<Country | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCountry = async () => {
//       const { data, error } = await supabase
//         .from("countries")
//         .select("*")
//         .eq("name", countryName?.toLowerCase())
//         .single();

//       if (error) setError("Failed to load country details.");
//       else setCountry(data);
//     };
//     fetchCountry();
//   }, [countryName]);

//   if (error) return <p className="text-center text-red-500 py-16">{error}</p>;
//   if (!country) return <p className="text-center text-gray-600 py-16">Loading...</p>;

//   return (
//     <div className="py-16">
//       <div className="container">
//         <div className="bg-white p-8 rounded-xl shadow-custom">
//           <div className="flex flex-col md:flex-row items-center gap-8">
//             <span className="text-6xl">{country.flag}</span>
//             <div>
//               <h2 className="text-3xl font-bold text-gray-800 mb-4">{country.name}</h2>
//               <p className="text-gray-600">{country.details}</p>
//             </div>
//           </div>
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-gray-100 p-4 rounded-xl">
//               <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <FaInfoCircle /> Education
//               </h3>
//               <p className="text-gray-600 mt-2">{country.education_system}</p>
//             </div>
//             <div className="bg-gray-100 p-4 rounded-xl">
//               <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <FaInfoCircle /> Cost
//               </h3>
//               <p className="text-gray-600 mt-2">{country.cost_of_living}</p>
//             </div>
//             <div className="bg-gray-100 p-4 rounded-xl">
//               <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <FaInfoCircle /> Visa
//               </h3>
//               <p className="text-gray-600 mt-2">{country.visa_process}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CountryDetail;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import { FaInfoCircle } from "react-icons/fa";

type Country = {
  id: number;
  name: string;
  flag: string;
  details: string;
  education_system: string;
  cost_of_living: string;
  visa_process: string;
};

const CountryDetail = () => {
  const { countryName } = useParams<{ countryName: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countryName) {
      setError("Country name not provided.");
      return;
    }

    const fetchCountry = async () => {
      // Use ilike for case-insensitive matching
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .ilike("name", countryName.toLowerCase())
        .single();

      if (error) {
        setError(`Failed to load country details: ${error.message}`);
        console.error("Fetch country error:", error);
      } else if (!data) {
        setError("Country not found.");
      } else {
        setCountry(data);
      }
    };
    fetchCountry();
  }, [countryName]);

  if (error) return <p className="text-center text-red-500 py-16 font-roboto">{error}</p>;
  if (!country) return <p className="text-center text-gray-300 py-16 font-roboto">Loading...</p>;

  return (
    <div className="py-16 bg-blue-dark font-roboto">
      <div className="container">
        <div className="bg-gray-dark p-8 rounded-xl shadow-custom">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <span className="text-6xl">{country.flag}</span>
            <div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">{country.name}</h2>
              <p className="text-white">{country.details}</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-dark p-4 rounded-xl">
              <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                <FaInfoCircle /> Education
              </h3>
              <p className="text-gray-300 mt-2">{country.education_system}</p>
            </div>
            <div className="bg-blue-dark p-4 rounded-xl">
              <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                <FaInfoCircle /> Cost
              </h3>
              <p className="text-gray-300 mt-2">{country.cost_of_living}</p>
            </div>
            <div className="bg-blue-dark p-4 rounded-xl">
              <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                <FaInfoCircle /> Visa
              </h3>
              <p className="text-gray-300 mt-2">{country.visa_process}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;