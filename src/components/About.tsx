import { useState, useEffect } from "react";
import { supabase } from "../supabase";

type TeamMember = {
  id: number;
  name: string;
  title: string;
  bio: string;
};

const About = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase.from("team").select("id, name, title, bio");
      if (error) {
        console.error("Supabase error:", error);
        setError("Failed to load team data.");
      } else {
        setTeam(data || []);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Study Abroad Consultation</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We’re dedicated to helping students achieve their dreams of studying abroad with expert guidance and personalized support.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">Our Mission</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-center">
            At Study Abroad Consultation, our mission is to simplify the journey to international education...
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-center mb-6">Meet Our Team</h2>
          {error && <p className="text-center text-red-500">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.id} className="text-center bg-white p-6 rounded-lg shadow-md">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.title}</p>
                <p className="text-sm text-gray-500 mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;