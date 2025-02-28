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
      if (error) {
        setError("Failed to load countries.");
        console.error("Fetch countries error:", error);
      } else {
        setCountries(data || []);
      }
    };
    fetchCountries();
  }, []);

  return (
    <div className="py-16 bg-blue-dark font-roboto">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">Explore Countries</h2>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {countries.map((country) => (
            <Link
              key={country.id}
              to={`/countries/${country.name.toLowerCase()}`}
              className="bg-gray-dark p-6 rounded-xl shadow-custom hover:shadow-lg transition-all duration-300"
            >
              <span className="text-5xl block text-center mb-4">{country.flag}</span>
              <h3 className="text-xl font-semibold text-yellow-400 text-center">{country.name}</h3>
              <p className="text-white text-center mt-2">{country.details}</p>
              <div className="flex justify-center mt-4 text-yellow-400">
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