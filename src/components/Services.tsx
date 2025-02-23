import { useState, useEffect } from "react";
import { supabase } from "../supabase";

type Service = {
  id: number;
  name: string;
  icon: string;
  description: string;
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("id, name, icon, description")
          .order("name", { ascending: true });

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div className="py-10 text-center">Loading services...</div>;

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="border p-4 rounded-lg text-center">
              <span className="text-4xl">{service.icon}</span>
              <h3 className="text-xl font-semibold mt-2">{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;