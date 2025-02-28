// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";

// type Preference = {
//   id: number;
//   country: {
//     name: string;
//     flag: string;
//     details: string;
//   };
//   saved_at: string;
// };

// type Document = {
//   id: number;
//   file_name: string;
//   uploaded_at: string;
//   file_size_mb: number | null;
//   word_count: number | null;
// };

// const Profile = () => {
//   const [preferences, setPreferences] = useState<Preference[]>([]);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data: userData } = await supabase.auth.getUser();
//       if (!userData.user) {
//         setError("Please log in to view your profile.");
//         return;
//       }

//       // Fetch saved preferences
//       const { data: prefData, error: prefError } = await supabase
//         .from("user_preferences")
//         .select(`
//           id,
//           saved_at,
//           country:countries (name, flag, details)
//         `)
//         .eq("user_id", userData.user.id)
//         .order("saved_at", { ascending: false });

//       if (prefError) {
//         console.error("Error fetching preferences:", prefError);
//         setError("Failed to load saved preferences.");
//       } else {
//         setPreferences(prefData || []);
//       }

//       // Fetch uploaded documents
//       const { data: docData, error: docError } = await supabase
//         .from("documents")
//         .select("id, file_name, uploaded_at, file_size_mb, word_count")
//         .eq("user_id", userData.user.id)
//         .order("uploaded_at", { ascending: false });

//       if (docError) {
//         console.error("Error fetching documents:", docError);
//         setError("Failed to load documents.");
//       } else {
//         setDocuments(docData || []);
//       }
//     };

//     fetchData();
//   }, []);

//   const getAnalysisFeedback = (doc: Document): string => {
//     const sizeFeedback = `File Size: ${doc.file_size_mb?.toFixed(2)} MB`;
//     const wordFeedback = doc.word_count
//       ? `Word Count: ${doc.word_count}`
//       : "Word count unavailable";
//     return `${sizeFeedback} | ${wordFeedback}`;
//   };

//   return (
//     <div className="py-10">
//       <div className="container mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-6">Your Profile</h2>
//         {error && <p className="text-center text-red-500 mb-4">{error}</p>}

//         {/* Saved Preferences */}
//         <section className="mb-12">
//           <h3 className="text-2xl font-semibold text-center mb-4">Saved Recommendations</h3>
//           {preferences.length === 0 ? (
//             <p className="text-center text-gray-600">No saved recommendations yet. Check out the Recommendations page to save some!</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {preferences.map((pref) => (
//                 <div key={pref.id} className="border p-4 rounded-lg text-center bg-white shadow-md">
//                   <span className="text-4xl">{pref.country.flag}</span>
//                   <h4 className="text-xl font-semibold mt-2">{pref.country.name}</h4>
//                   <p className="text-sm text-gray-600">{pref.country.details}</p>
//                   <p className="text-sm text-gray-500 mt-2">
//                     Saved: {new Date(pref.saved_at).toLocaleString()}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Uploaded Documents */}
//         <section>
//           <h3 className="text-2xl font-semibold text-center mb-4">Your Documents</h3>
//           {documents.length === 0 ? (
//             <p className="text-center text-gray-600">No documents uploaded yet. Visit the Documents page to add some!</p>
//           ) : (
//             <div className="space-y-4">
//               {documents.map((doc) => (
//                 <div key={doc.id} className="border p-4 rounded-lg bg-white shadow-md">
//                   <p className="text-lg font-semibold">{doc.file_name}</p>
//                   <p className="text-sm text-gray-600">
//                     Uploaded: {new Date(doc.uploaded_at).toLocaleString()}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Analysis: <span className="text-blue-600">{getAnalysisFeedback(doc)}</span>
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { FaUser } from "react-icons/fa";

type Preference = {
  id: number;
  country: {
    name: string;
    flag: string;
    details: string;
  };
  saved_at: string;
};

type Document = {
  id: number;
  file_name: string;
  uploaded_at: string;
  file_size_mb: number | null;
  word_count: number | null;
};

const Profile = () => {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setError("Please log in to view your profile.");
        return;
      }

      const { data: prefData, error: prefError } = await supabase
        .from("user_preferences")
        .select(`
          id,
          saved_at,
          country:countries! (name, flag, details)
        `)
        .eq("user_id", userData.user.id);

      if (prefError) {
        setError("Failed to load preferences.");
      } else {
        const formattedPreferences = prefData.map((pref: any) => ({
          id: pref.id,
          saved_at: pref.saved_at,
          country: pref.countries[0]
        }));
        setPreferences(formattedPreferences || []);
      }

      const { data: docData, error: docError } = await supabase
        .from("documents")
        .select("id, file_name, uploaded_at, file_size_mb, word_count")
        .eq("user_id", userData.user.id);

      if (docError) setError("Failed to load documents.");
      else setDocuments(docData || []);
    };

    fetchData();
  }, []);

  const getAnalysisFeedback = (doc: Document): string => {
    const sizeFeedback = `Size: ${doc.file_size_mb?.toFixed(2)} MB`;
    const wordFeedback = doc.word_count ? `Words: ${doc.word_count}` : "Words: N/A";
    return `${sizeFeedback} | ${wordFeedback}`;
  };

  return (
    <div className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center gap-2">
          <FaUser /> Your Profile
        </h2>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Saved Recommendations</h3>
          {preferences.length === 0 ? (
            <p className="text-center text-gray-600">No saved recommendations yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {preferences.map((pref) => (
                <div key={pref.id} className="bg-white p-6 rounded-xl shadow-custom">
                  <span className="text-5xl block text-center mb-4">{pref.country.flag}</span>
                  <h4 className="text-xl font-semibold text-gray-800 text-center">{pref.country.name}</h4>
                  <p className="text-gray-600 text-center mt-2">{pref.country.details}</p>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Saved: {new Date(pref.saved_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Your Documents</h3>
          {documents.length === 0 ? (
            <p className="text-center text-gray-600">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-6">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white p-6 rounded-xl shadow-custom">
                  <p className="text-lg font-semibold text-gray-800">{doc.file_name}</p>
                  <p className="text-sm text-gray-600">Uploaded: {new Date(doc.uploaded_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Analysis: <span className="text-blue-600">{getAnalysisFeedback(doc)}</span></p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";
// import { useAuth } from "../hooks/useAuth";
// import { FaUser } from "react-icons/fa";

// type Preference = {
//   id: number;
//   country: {
//     name: string;
//     flag: string;
//     details: string;
//   };
//   saved_at: string;
// };

// type Document = {
//   id: number;
//   file_name: string;
//   uploaded_at: string;
//   file_size_mb: number | null;
//   word_count: number | null;
// };

// const Profile = () => {
//   const [preferences, setPreferences] = useState<Preference[]>([]);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     if (!user) return;

//     const fetchData = async () => {
//       try {
//         const { data: prefData, error: prefError } = await supabase
//           .from("user_preferences")
//           .select(`
//             id,
//             saved_at,
//             country:countries (name, flag, details)
//           `)
//           .eq("user_id", user.id);

//         if (prefError) throw prefError;
//         const formattedPreferences = prefData.map((pref: any) => ({
//           id: pref.id,
//           saved_at: pref.saved_at,
//           country: pref.country[0]
//         }));
//         setPreferences(formattedPreferences || []);

//         const { data: docData, error: docError } = await supabase
//           .from("documents")
//           .select("id, file_name, uploaded_at, file_size_mb, word_count")
//           .eq("user_id", user.id);

//         if (docError) throw docError;
//         setDocuments(docData || []);
//       } catch (err: any) {
//         setError(err.message || "Failed to load profile data.");
//         console.error("Profile fetch error:", err);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const getAnalysisFeedback = (doc: Document): string => {
//     const sizeFeedback = `Size: ${doc.file_size_mb?.toFixed(2)} MB`;
//     const wordFeedback = doc.word_count ? `Words: ${doc.word_count}` : "Words: N/A";
//     return `${sizeFeedback} | ${wordFeedback}`;
//   };

//   if (!user) {
//     return <div className="text-center py-16 text-yellow-400 font-merriweather">Loading user data...</div>;
//   }

//   return (
//     <div className="py-16 bg-maroon-dim font-merriweather">
//       <div className="container mx-auto max-w-4xl">
//         <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400 flex items-center justify-center gap-2">
//           <FaUser /> Your Profile
//         </h2>
//         {error && <p className="text-center text-red-500 mb-4">{error}</p>}
//         <section className="mb-12">
//           <h3 className="text-2xl font-semibold text-yellow-400 mb-6">Saved Recommendations</h3>
//           {preferences.length === 0 ? (
//             <p className="text-center text-gray-300">No saved recommendations yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {preferences.map((pref) => (
//                 <div key={pref.id} className="bg-gray-700 p-6 rounded-xl shadow-custom">
//                   <span className="text-5xl block text-center mb-4">{pref.country.flag}</span>
//                   <h4 className="text-xl font-semibold text-yellow-400 text-center">{pref.country.name}</h4>
//                   <p className="text-white text-center mt-2">{pref.country.details}</p>
//                   <p className="text-sm text-gray-300 text-center mt-2">
//                     Saved: {new Date(pref.saved_at).toLocaleString()}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//         <section>
//           <h3 className="text-2xl font-semibold text-yellow-400 mb-6">Your Documents</h3>
//           {documents.length === 0 ? (
//             <p className="text-center text-gray-300">No documents uploaded yet.</p>
//           ) : (
//             <div className="space-y-6">
//               {documents.map((doc) => (
//                 <div key={doc.id} className="bg-gray-700 p-6 rounded-xl shadow-custom">
//                   <p className="text-lg font-semibold text-yellow-400">{doc.file_name}</p>
//                   <p className="text-sm text-gray-300">Uploaded: {new Date(doc.uploaded_at).toLocaleString()}</p>
//                   <p className="text-sm text-gray-300">
//                     Analysis: <span className="text-yellow-400">{getAnalysisFeedback(doc)}</span>
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Profile;
