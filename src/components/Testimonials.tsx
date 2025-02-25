import { useState, useEffect } from "react";
import { supabase } from "../supabase";

type Testimonial = {
  id: number;
  name: string;
  quote: string;
  details: string | null;
  created_at: string;
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, name, quote, details, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching testimonials:", error);
        setError("Failed to load testimonials.");
      } else {
        setTestimonials(data || []);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">What Our Students Say</h2>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        {testimonials.length === 0 && !error ? (
          <p className="text-center text-gray-600">No testimonials yet—check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-lg font-semibold text-gray-800">{testimonial.name}</p>
                <p className="text-sm text-gray-600 italic mt-1">{testimonial.details || "Student"}</p>
                <p className="text-gray-700 mt-4">“{testimonial.quote}”</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(testimonial.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;