// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";
// import { FaQuoteLeft } from "react-icons/fa";

// type Testimonial = {
//   id: number;
//   name: string;
//   quote: string;
//   details: string | null;
//   created_at: string;
// };

// const Testimonials = () => {
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTestimonials = async () => {
//       const { data, error } = await supabase
//         .from("testimonials")
//         .select("id, name, quote, details, created_at")
//         .order("created_at", { ascending: false });

//       if (error) setError("Failed to load testimonials.");
//       else setTestimonials(data || []);
//     };

//     fetchTestimonials();
//   }, []);

//   return (
//     <div className="py-16">
//       <div className="container">
//         <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">What Students Say</h2>
//         {error && <p className="text-center text-red-500 mb-4">{error}</p>}
//         {testimonials.length === 0 && !error ? (
//           <p className="text-center text-gray-600">No testimonials yet.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {testimonials.map((testimonial) => (
//               <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-custom">
//                 <FaQuoteLeft className="text-blue-600 text-3xl mb-4" />
//                 <p className="text-gray-700 italic">“{testimonial.quote}”</p>
//                 <p className="text-lg font-semibold text-gray-800 mt-4">{testimonial.name}</p>
//                 <p className="text-sm text-gray-600">{testimonial.details || "Student"}</p>
//                 <p className="text-sm text-gray-500 mt-2">{new Date(testimonial.created_at).toLocaleDateString()}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Testimonials;

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { FaQuoteLeft } from "react-icons/fa";

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

      if (error) setError("Failed to load testimonials.");
      else setTestimonials(data || []);
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="py-16 bg-green-bright text-black font-playfair">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">What Students Say</h2>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        {testimonials.length === 0 && !error ? (
          <p className="text-center text-gray-700">No testimonials yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-custom">
                <FaQuoteLeft className="text-blue-900 text-3xl mb-4" />
                <p className="text-gray-800 italic">“{testimonial.quote}”</p>
                <p className="text-lg font-semibold text-blue-900 mt-4">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.details || "Student"}</p>
                <p className="text-sm text-gray-500 mt-2">{new Date(testimonial.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;