import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

type CountryDetailData = {
  flag: string;
  education_system: string;
  cost_of_living: string;
  visa_process: string;
};

const CountryDetail = () => {
  const { countryName } = useParams<{ countryName: string }>();
  const [country, setCountry] = useState<CountryDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      console.log("URL countryName:", countryName);
      try {
        const { data, error } = await supabase
          .from("countries")
          .select("flag, education_system, cost_of_living, visa_process")
          .eq("name", countryName) // No .toLowerCase()
          .single();

        console.log("Supabase response:", { data, error });
        if (error) throw error;
        setCountry(data || null);
      } catch (error) {
        console.error("Error fetching country:", error);
        setCountry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [countryName]);

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (!country) return <div className="py-10 text-center">Country not found.</div>;

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6">
          {countryName} {country.flag}
        </h2>
        <p><strong>Education System:</strong> {country.education_system}</p>
        <p><strong>Cost of Living:</strong> {country.cost_of_living}</p>
        <p><strong>Visa Process:</strong> {country.visa_process}</p>
      </div>
    </div>
  );
};

export default CountryDetail;