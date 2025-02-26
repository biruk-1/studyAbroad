// import { useState, useEffect, FormEvent } from "react";
// import { supabase } from "../supabase";
// import { Link } from "react-router-dom";

// type Country = {
//   id: number;
//   name: string;
//   flag: string;
//   details: string;
//   education_system: string;
//   cost_of_living: string;
//   visa_process: string;
// };

// const Recommendations = () => {
//   const [budgetRange, setBudgetRange] = useState("");
//   const [fieldOfStudy, setFieldOfStudy] = useState("");
//   const [preferredCountry, setPreferredCountry] = useState("");
//   const [recommendations, setRecommendations] = useState<Country[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [countries, setCountries] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchCountries = async () => {
//       const { data, error } = await supabase
//         .from("countries")
//         .select("name")
//         .order("name", { ascending: true });

//       if (error) setError("Failed to load country options.");
//       else setCountries(data.map((c: { name: string }) => c.name));
//     };

//     fetchCountries();
//   }, []);

//   const fetchRecommendations = async (e: FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setRecommendations([]);

//     try {
//       let query = supabase.from("countries").select("*");

//       if (budgetRange) {
//         const [minStr, maxStr] = budgetRange.split("-");
//         const min = parseInt(minStr.replace(/\D/g, ""));
//         const max = maxStr ? parseInt(maxStr.replace(/\D/g, "")) : Infinity;
//         // More flexible: match if cost_of_living contains min OR max
//         query = query.or(
//           `cost_of_living.ilike.%${min}K%,cost_of_living.ilike.%${max}K%`
//         );
//       }

//       if (fieldOfStudy) query = query.ilike("education_system", `%${fieldOfStudy}%`);
//       if (preferredCountry) query = query.eq("name", preferredCountry);

//       const { data, error } = await query;
//       if (error) throw error;

//       console.log("Recommendations fetched:", data);

//       if (data.length === 0) setError("No matches found. Adjust filters or check Supabase data!");
//       else setRecommendations(data);
//     } catch (err: any) {
//       setError(`Failed to fetch: ${err.message || "Unknown error"}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const saveRecommendation = async (countryId: number) => {
//     try {
//       const { data: userData } = await supabase.auth.getUser();
//       if (!userData.user) throw new Error("User not authenticated");

//       const { error } = await supabase
//         .from("user_preferences")
//         .insert([{ user_id: userData.user.id, country_id: countryId }]);

//       if (error) throw error;
//       alert("Saved to your profile!");
//     } catch (err: any) {
//       setError(`Failed to save: ${err.message}`);
//     }
//   };

//   const resetFilters = () => {
//     setBudgetRange("");
//     setFieldOfStudy("");
//     setPreferredCountry("");
//     setRecommendations([]);
//     setError(null);
//   };

//   return (
//     <div className="py-10">
//       <div className="container mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-6">Find Your Study Abroad Match</h2>
//         <form onSubmit={fetchRecommendations} className="max-w-lg mx-auto space-y-6 bg-gray-100 p-6 rounded-lg shadow-md">
//           <div>
//             <label htmlFor="budgetRange" className="block mb-1 font-semibold">Budget (per year)</label>
//             <select
//               id="budgetRange"
//               value={budgetRange}
//               onChange={(e) => setBudgetRange(e.target.value)}
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Any Budget</option>
//               <option value="$10K-$20K">$10K - $20K</option>
//               <option value="$20K-$30K">$20K - $30K</option>
//               <option value="$30K-$50K">$30K - $50K</option>
//               <option value="$50K+">$50K+</option>
//             </select>
//           </div>
//           <div>
//             <label htmlFor="fieldOfStudy" className="block mb-1 font-semibold">Field of Study</label>
//             <select
//               id="fieldOfStudy"
//               value={fieldOfStudy}
//               onChange={(e) => setFieldOfStudy(e.target.value)}
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Any Field</option>
//               <option value="Engineering">Engineering</option>
//               <option value="Business">Business</option>
//               <option value="Medicine">Medicine</option>
//               <option value="Arts">Arts</option>
//               <option value="Science">Science</option>
//             </select>
//           </div>
//           <div>
//             <label htmlFor="preferredCountry" className="block mb-1 font-semibold">Preferred Country</label>
//             <select
//               id="preferredCountry"
//               value={preferredCountry}
//               onChange={(e) => setPreferredCountry(e.target.value)}
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Any Country</option>
//               {countries.map((country) => (
//                 <option key={country} value={country}>
//                   {country}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex gap-4">
//             <button
//               type="submit"
//               className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
//               disabled={isLoading}
//             >
//               {isLoading ? "Finding..." : "Get Recommendations"}
//             </button>
//             <button
//               type="button"
//               onClick={resetFilters}
//               className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
//             >
//               Reset
//             </button>
//           </div>
//         </form>

//         {error && <p className="mt-4 text-center text-red-500">{error}</p>}

//         {recommendations.length > 0 && (
//           <div className="mt-8">
//             <h3 className="text-2xl font-semibold text-center mb-4">Your Recommendations</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {recommendations.map((country) => (
//                 <div key={country.id} className="border p-4 rounded-lg text-center bg-white shadow-md">
//                   <span className="text-4xl">{country.flag}</span>
//                   <h4 className="text-xl font-semibold mt-2">{country.name}</h4>
//                   <p className="text-sm text-gray-600">{country.details}</p>
//                   <p className="text-sm mt-2"><strong>Cost:</strong> {country.cost_of_living}</p>
//                   <p className="text-sm"><strong>Visa:</strong> {country.visa_process}</p>
//                   <div className="mt-2 flex gap-2 justify-center">
//                     <Link
//                       to={`/countries/${country.name.toLowerCase()}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Learn More
//                     </Link>
//                     <button
//                       onClick={() => saveRecommendation(country.id)}
//                       className="text-green-600 hover:underline"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Recommendations;

import { useState, useEffect, FormEvent } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";
import { FaSave } from "react-icons/fa";

type Country = {
  id: number;
  name: string;
  flag: string;
  details: string;
  education_system: string;
  cost_of_living: string;
  visa_process: string;
};

const Recommendations = () => {
  const [budgetRange, setBudgetRange] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [preferredCountry, setPreferredCountry] = useState("");
  const [recommendations, setRecommendations] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase.from("countries").select("name");
      if (error) setError("Failed to load options.");
      else setCountries(data.map((c: { name: string }) => c.name));
    };
    fetchCountries();
  }, []);

  const fetchRecommendations = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      let query = supabase.from("countries").select("*");
      if (budgetRange) {
        const [minStr, maxStr] = budgetRange.split("-");
        const min = parseInt(minStr.replace(/\D/g, ""));
        const max = maxStr ? parseInt(maxStr.replace(/\D/g, "")) : Infinity;
        query = query.or(`cost_of_living.ilike.%${min}K%,cost_of_living.ilike.%${max}K%`);
      }
      if (fieldOfStudy) query = query.ilike("education_system", `%${fieldOfStudy}%`);
      if (preferredCountry) query = query.eq("name", preferredCountry);

      const { data, error } = await query;
      if (error) throw error;
      if (data.length === 0) setError("No matches found.");
      else setRecommendations(data);
    } catch (err: any) {
      setError(`Failed to fetch: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecommendation = async (countryId: number) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");
      const { error } = await supabase.from("user_preferences").insert([{ user_id: userData.user.id, country_id: countryId }]);
      if (error) throw error;
      alert("Saved!");
    } catch (err: any) {
      setError(`Failed to save: ${err.message}`);
    }
  };

  const resetFilters = () => {
    setBudgetRange("");
    setFieldOfStudy("");
    setPreferredCountry("");
    setRecommendations([]);
    setError(null);
  };

  return (
    <div className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Find Your Match</h2>
        <form onSubmit={fetchRecommendations} className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-custom space-y-6">
          <div>
            <label htmlFor="budgetRange" className="block mb-1 font-semibold text-gray-800">Budget</label>
            <select
              id="budgetRange"
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Any Budget</option>
              <option value="$10K-$20K">$10K - $20K</option>
              <option value="$20K-$30K">$20K - $30K</option>
              <option value="$30K-$50K">$30K - $50K</option>
              <option value="$50K+">$50K+</option>
            </select>
          </div>
          <div>
            <label htmlFor="fieldOfStudy" className="block mb-1 font-semibold text-gray-800">Field</label>
            <select
              id="fieldOfStudy"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Any Field</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Medicine">Medicine</option>
              <option value="Arts">Arts</option>
              <option value="Science">Science</option>
            </select>
          </div>
          <div>
            <label htmlFor="preferredCountry" className="block mb-1 font-semibold text-gray-800">Country</label>
            <select
              id="preferredCountry"
              value={preferredCountry}
              onChange={(e) => setPreferredCountry(e.target.value)}
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Any Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Finding..." : "Get Recommendations"}
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-xl hover:bg-gray-700 transition-all"
            >
              Reset
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800">Your Recommendations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((country) => (
                <div key={country.id} className="bg-white p-6 rounded-xl shadow-custom hover:shadow-lg transition-all">
                  <span className="text-5xl block text-center mb-4">{country.flag}</span>
                  <h4 className="text-xl font-semibold text-gray-800 text-center">{country.name}</h4>
                  <p className="text-gray-600 text-center mt-2">{country.details}</p>
                  <p className="text-sm text-gray-600 mt-2"><strong>Cost:</strong> {country.cost_of_living}</p>
                  <p className="text-sm text-gray-600"><strong>Visa:</strong> {country.visa_process}</p>
                  <div className="mt-4 flex gap-4 justify-center">
                    <Link
                      to={`/countries/${country.name.toLowerCase()}`}
                      className="text-blue-600 hover:underline"
                    >
                      Learn More
                    </Link>
                    <button
                      onClick={() => saveRecommendation(country.id)}
                      className="text-green-600 hover:underline flex items-center gap-1"
                    >
                      <FaSave /> Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;