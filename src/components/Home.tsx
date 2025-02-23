import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

type Country = {
  id: number;
  name: string;
  flag: string;
};
type Service = {
  id: number;
  name: string;
  icon: string;
};

const Home = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesRes, servicesRes] = await Promise.all([
          supabase.from("countries").select("id, name, flag").order("name", { ascending: true }),
          supabase.from("services").select("id, name, icon").order("name", { ascending: true }),
        ]);

        if (countriesRes.error) throw countriesRes.error;
        if (servicesRes.error) throw servicesRes.error;

        setCountries(countriesRes.data || []);
        setServices(servicesRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Your Journey to Study Abroad Starts Here</h1>
          <p className="text-lg mb-8">Expert guidance for your global education dreams.</p>
          <Link to="/contact" className="bg-white text-blue-600 py-3 px-6 rounded-lg">
            Get Started
          </Link>
        </div>
      </section>

      {/* Featured Countries Section */}
      <section className="py-10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Featured Countries</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {countries.map((country) => (
              <div key={country.id} className="border p-4 rounded-lg text-center">
                <span className="text-4xl">{country.flag}</span>
                <h3 className="text-xl font-semibold mt-2">{country.name}</h3>
                <Link to={`/countries/${country.name}`} className="text-blue-600">
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Intro */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="border p-4 rounded-lg text-center">
                <span className="text-4xl">{service.icon}</span>
                <h3 className="text-xl font-semibold mt-2">{service.name}</h3>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/services" className="text-blue-600">See All Services</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;