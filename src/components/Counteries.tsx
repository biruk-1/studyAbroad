import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

type Country = {
  id: number;
  name: string;
  flag: string;
  details: string;
};

const Countries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data, error } = await supabase
          .from("countries")
          .select("id, name, flag, details")
          .order("name", { ascending: true });

        if (error) throw error;
        setCountries(data || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) return <div className="py-10 text-center">Loading countries...</div>;

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Explore Countries</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {countries.map((country) => (
            <div key={country.id} className="border p-4 rounded-lg text-center">
              <span className="text-4xl">{country.flag}</span>
              <h3 className="text-xl font-semibold mt-2">{country.name}</h3>
              <p>{country.details}</p>
              <Link to={`/countries/${country.name}`} className="text-blue-600">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Countries;