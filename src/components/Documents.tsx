// import { useState, useEffect, FormEvent } from "react";
// import { supabase } from "../supabase";

// type Document = {
//   id: number;
//   user_id: string;
//   file_name: string;
//   uploaded_at: string;
//   file_size_mb: number | null;
//   word_count: number | null;
// };

// const Documents = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       const { data: userData } = await supabase.auth.getUser();
//       if (!userData.user) return;

//       const { data, error } = await supabase
//         .from("documents")
//         .select("id, user_id, file_name, uploaded_at, file_size_mb, word_count")
//         .eq("user_id", userData.user.id)
//         .order("uploaded_at", { ascending: false });

//       if (error) {
//         console.error("Supabase error fetching documents:", error);
//         setError("Failed to load documents.");
//       } else {
//         setDocuments(data || []);
//       }
//     };

//     fetchDocuments();
//   }, []);

//   const analyzeDocument = (file: File): { fileSizeMb: number; wordCount: number | null } => {
//     const fileSizeMb = file.size / (1024 * 1024);
//     let wordCount: number | null = null;

//     if (file.type === "text/plain") {
//       file.text().then((text) => {
//         wordCount = text.split(/\s+/).filter(Boolean).length;
//       });
//     }
//     return { fileSizeMb, wordCount };
//   };

//   const handleFileUpload = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!file) {
//       setError("Please select a file.");
//       return;
//     }

//     setIsUploading(true);
//     setError(null);

//     try {
//       const { data: userData } = await supabase.auth.getUser();
//       if (!userData.user) throw new Error("User not authenticated");

//       const filePath = `${userData.user.id}/${Date.now()}-${file.name}`;
//       const { fileSizeMb, wordCount } = analyzeDocument(file);

//       const { error: uploadError } = await supabase.storage
//         .from("documents")
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       const { error: insertError } = await supabase
//         .from("documents")
//         .insert([
//           {
//             user_id: userData.user.id,
//             file_name: file.name,
//             uploaded_at: new Date().toISOString(),
//             file_size_mb: fileSizeMb,
//             word_count: wordCount,
//           },
//         ]);

//       if (insertError) throw insertError;

//       const { data, error: fetchError } = await supabase
//         .from("documents")
//         .select("id, user_id, file_name, uploaded_at, file_size_mb, word_count")
//         .eq("user_id", userData.user.id)
//         .order("uploaded_at", { ascending: false });

//       if (fetchError) throw fetchError;

//       setDocuments(data || []);
//       setFile(null);
//     } catch (err: any) {
//       setError(`Failed to upload: ${err.message || "Unknown error"}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const getDownloadUrl = (fileName: string, userId: string) => {
//     const { data } = supabase.storage
//       .from("documents")
//       .getPublicUrl(`${userId}/${fileName.split("/").pop()}`);
//     return data.publicUrl;
//   };

//   const getAnalysisFeedback = (doc: Document): string => {
//     const sizeFeedback = `Size: ${doc.file_size_mb?.toFixed(2)} MB`;
//     const wordFeedback = doc.word_count
//       ? `Words: ${doc.word_count}`
//       : "Word count unavailable";
//     return `${sizeFeedback} | ${wordFeedback}`;
//   };

//   return (
//     <div className="py-10">
//       <div className="container mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-6">Document Analysis</h2>
//         <form onSubmit={handleFileUpload} className="max-w-lg mx-auto space-y-6 bg-gray-100 p-6 rounded-lg shadow-md">
//           <div>
//             <label htmlFor="file" className="block mb-1 font-semibold">Upload SOP or Resume (PDF, DOCX)</label>
//             <input
//               type="file"
//               id="file"
//               accept=".pdf,.docx,.txt"
//               onChange={(e) => setFile(e.target.files?.[0] || null)}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
//             disabled={isUploading || !file}
//           >
//             {isUploading ? "Uploading..." : "Upload & Analyze"}
//           </button>
//         </form>

//         {error && <p className="mt-4 text-center text-red-500">{error}</p>}

//         {documents.length > 0 && (
//           <div className="mt-8">
//             <h3 className="text-2xl font-semibold text-center mb-4">Your Uploaded Documents</h3>
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
//                   <a
//                     href={getDownloadUrl(doc.file_name, doc.user_id)}
//                     className="text-blue-600 hover:underline mt-2 inline-block"
//                     download
//                   >
//                     Download
//                   </a>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Documents;

// import { useState, useEffect, FormEvent } from "react";
// import { supabase } from "../supabase";
// import { FaFileUpload, FaDownload } from "react-icons/fa";

// type Document = {
//   id: number;
//   user_id: string;
//   file_name: string;
//   uploaded_at: string;
//   file_size_mb: number | null;
//   word_count: number | null;
// };

// const Documents = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       const { data: userData } = await supabase.auth.getUser();
//       if (!userData.user) return;

//       const { data, error } = await supabase
//         .from("documents")
//         .select("id, user_id, file_name, uploaded_at, file_size_mb, word_count")
//         .eq("user_id", userData.user.id)
//         .order("uploaded_at", { ascending: false });

//       if (error) setError("Failed to load documents.");
//       else setDocuments(data || []);
//     };

//     fetchDocuments();
//   }, []);

//   const analyzeDocument = (file: File): { fileSizeMb: number; wordCount: number | null } => {
//     const fileSizeMb = file.size / (1024 * 1024);
//     let wordCount: number | null = null;

//     if (file.type === "text/plain") {
//       file.text().then((text) => {
//         wordCount = text.split(/\s+/).filter(Boolean).length;
//       });
//     }
//     return { fileSizeMb, wordCount };
//   };

//   const handleFileUpload = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!file) {
//       setError("Please select a file.");
//       return;
//     }

//     setIsUploading(true);
//     setError(null);

//     try {
//       const { data: userData } = await supabase.auth.getUser();
//       if (!userData.user) throw new Error("User not authenticated");

//       const filePath = `${userData.user.id}/${Date.now()}-${file.name}`;
//       const { fileSizeMb, wordCount } = analyzeDocument(file);

//       const { error: uploadError } = await supabase.storage
//         .from("documents")
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       const { error: insertError } = await supabase
//         .from("documents")
//         .insert([
//           {
//             user_id: userData.user.id,
//             file_name: file.name,
//             uploaded_at: new Date().toISOString(),
//             file_size_mb: fileSizeMb,
//             word_count: wordCount,
//           },
//         ]);

//       if (insertError) throw insertError;

//       const { data, error: fetchError } = await supabase
//         .from("documents")
//         .select("id, user_id, file_name, uploaded_at, file_size_mb, word_count")
//         .eq("user_id", userData.user.id)
//         .order("uploaded_at", { ascending: false });

//       if (fetchError) throw fetchError;

//       setDocuments(data || []);
//       setFile(null);
//     } catch (err: any) {
//       setError(`Failed to upload: ${err.message}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const getDownloadUrl = (fileName: string, userId: string) => {
//     const { data } = supabase.storage
//       .from("documents")
//       .getPublicUrl(`${userId}/${fileName.split("/").pop()}`);
//     return data.publicUrl;
//   };

//   const getAnalysisFeedback = (doc: Document): string => {
//     const sizeFeedback = `Size: ${doc.file_size_mb?.toFixed(2)} MB`;
//     const wordFeedback = doc.word_count ? `Words: ${doc.word_count}` : "Words: N/A";
//     return `${sizeFeedback} | ${wordFeedback}`;
//   };

//   return (
//     <div className="py-16">
//       <div className="container">
//         <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Document Analysis</h2>
//         <form onSubmit={handleFileUpload} className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-custom space-y-6">
//           <div>
//             <label htmlFor="file" className="block mb-1 font-semibold text-gray-800">Upload Document</label>
//             <input
//               type="file"
//               id="file"
//               accept=".pdf,.docx,.txt"
//               onChange={(e) => setFile(e.target.files?.[0] || null)}
//               className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
//             disabled={isUploading || !file}
//           >
//             <FaFileUpload /> {isUploading ? "Uploading..." : "Upload & Analyze"}
//           </button>
//         </form>
//         {error && <p className="mt-4 text-center text-red-500">{error}</p>}
//         {documents.length > 0 && (
//           <div className="mt-12">
//             <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800">Your Documents</h3>
//             <div className="space-y-6">
//               {documents.map((doc) => (
//                 <div key={doc.id} className="bg-white p-6 rounded-xl shadow-custom">
//                   <p className="text-lg font-semibold text-gray-800">{doc.file_name}</p>
//                   <p className="text-sm text-gray-600">Uploaded: {new Date(doc.uploaded_at).toLocaleString()}</p>
//                   <p className="text-sm text-gray-600">Analysis: <span className="text-blue-600">{getAnalysisFeedback(doc)}</span></p>
//                   <a
//                     href={getDownloadUrl(doc.file_name, doc.user_id)}
//                     className="text-blue-600 hover:underline mt-2 inline-block flex items-center gap-1"
//                     download
//                   >
//                     <FaDownload /> Download
//                   </a>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Documents;

// import { useState, useEffect, FormEvent } from "react";
// import { supabase } from "../supabase";
// import { FaFileUpload, FaDownload } from "react-icons/fa";

// type Document = {
//   id: number;
//   user_id: string;
//   file_name: string;
//   uploaded_at: string;
//   file_size_mb: number | null;
//   word_count: number | null;
// };

// const Documents = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       const { data: userData } = await supabase.auth.getUser();
//       if (!userData.user) return;

//       const { data, error } = await supabase
//         .from("documents")
//         .select("id, user_id, file_name, uploaded_at, file_size_mb, word_count")
//         .eq("user_id", userData.user.id)
//         .order("uploaded_at", { ascending: false });

//       if (error) setError("Failed to load documents.");
//       else setDocuments(data || []);
//     };

//     fetchDocuments();
//   }, []);

//   const analyzeDocument = (file: File): { fileSizeMb: number; wordCount: number | null } => {
//     const fileSizeMb = file.size / (1024 * 1024);
//     let wordCount: number | null = null;

//     if (file.type === "text/plain") {
//       file.text().then((text) => {
//         wordCount = text.split(/\s+/).filter(Boolean).length;
//       });
//     }
//     return { fileSizeMb, wordCount };
//   };

//   const handleFileUpload = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!file) {
//       setError("Please select a file.");
//       return;
//     }

//     setIsUploading(true);
//     setError(null);

//     try {
//       const { data: userData } = await supabase.auth.getUser();
//       if (!userData.user) throw new Error("User not authenticated");

//       const filePath = `${userData.user.id}/${Date.now()}-${file.name}`;
//       const { fileSizeMb, wordCount } = analyzeDocument(file);

//       const { error: uploadError } = await supabase.storage
//         .from("documents")
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       const { error: insertError } = await supabase
//         .from("documents")
//         .insert([
//           {
//             user_id: userData.user.id,
//             file_name: file.name,
//             uploaded_at: new Date().toISOString(),
//             file_size_mb: fileSizeMb,
//             word_count: wordCount,
//           },
//         ]);

//       if (insertError) throw insertError;

//       const { data, error: fetchError } = await supabase
//         .from("documents")
//         .select("id, user_id, file_name, uploaded_at, file_size_mb, word_count")
//         .eq("user_id", userData.user.id)
//         .order("uploaded_at", { ascending: false });

//       if (fetchError) throw fetchError;

//       setDocuments(data || []);
//       setFile(null);
//     } catch (err: any) {
//       setError(`Failed to upload: ${err.message}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const getDownloadUrl = (fileName: string, userId: string) => {
//     const { data } = supabase.storage
//       .from("documents")
//       .getPublicUrl(`${userId}/${fileName.split("/").pop()}`);
//     return data.publicUrl;
//   };

//   const getAnalysisFeedback = (doc: Document): string => {
//     const sizeFeedback = `Size: ${doc.file_size_mb?.toFixed(2)} MB`;
//     const wordFeedback = doc.word_count ? `Words: ${doc.word_count}` : "Words: N/A";
//     return `${sizeFeedback} | ${wordFeedback}`;
//   };

//   return (
//     <div className="py-16 bg-gray-dim font-montserrat">
//       <div className="container">
//         <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">Document Analysis</h2>
//         <form onSubmit={handleFileUpload} className="max-w-lg mx-auto bg-gray-700 p-8 rounded-xl shadow-custom space-y-6">
//           <div>
//             <label htmlFor="file" className="block mb-1 font-semibold text-yellow-400">Upload Document</label>
//             <input
//               type="file"
//               id="file"
//               accept=".pdf,.docx,.txt"
//               onChange={(e) => setFile(e.target.files?.[0] || null)}
//               className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-yellow-400 text-black py-3 px-4 rounded-xl hover:bg-yellow-600 transition-all duration-300 flex items-center justify-center gap-2"
//             disabled={isUploading || !file}
//           >
//             <FaFileUpload /> {isUploading ? "Uploading..." : "Upload & Analyze"}
//           </button>
//         </form>
//         {error && <p className="mt-4 text-center text-red-500">{error}</p>}
//         {documents.length > 0 && (
//           <div className="mt-12">
//             <h3 className="text-2xl font-semibold text-center mb-6 text-yellow-400">Your Documents</h3>
//             <div className="space-y-6">
//               {documents.map((doc) => (
//                 <div key={doc.id} className="bg-gray-700 p-6 rounded-xl shadow-custom">
//                   <p className="text-lg font-semibold text-yellow-400">{doc.file_name}</p>
//                   <p className="text-sm text-gray-300">Uploaded: {new Date(doc.uploaded_at).toLocaleString()}</p>
//                   <p className="text-sm text-gray-300">Analysis: <span className="text-yellow-400">{getAnalysisFeedback(doc)}</span></p>
//                   <a
//                     href={getDownloadUrl(doc.file_name, doc.user_id)}
//                     className="text-yellow-400 hover:underline mt-2 inline-block flex items-center gap-1"
//                     download
//                   >
//                     <FaDownload /> Download
//                   </a>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Documents;

import { useState, useEffect, FormEvent } from "react";
import { supabase } from "../supabase";
import { FaFileUpload, FaDownload } from "react-icons/fa";

type Document = {
  id: number;
  user_id: string;
  file_name: string;
  uploaded_at: string;
  file_size_mb: number | null;
  word_count: number | null;
};

const Documents = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from("documents")
        .select("id, user_id, file_name, uploaded_at, file_size_mb, word_count")
        .eq("user_id", userData.user.id)
        .order("uploaded_at", { ascending: false });

      if (error) setError("Failed to load documents.");
      else setDocuments(data || []);
    };

    fetchDocuments();
  }, []);

  const analyzeDocument = (file: File): { fileSizeMb: number; wordCount: number | null } => {
    const fileSizeMb = file.size / (1024 * 1024);
    let wordCount: number | null = null;

    if (file.type === "text/plain") {
      file.text().then((text) => {
        wordCount = text.split(/\s+/).filter(Boolean).length;
      });
    }
    return { fileSizeMb, wordCount };
  };

  const handleFileUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const filePath = `${userData.user.id}/${Date.now()}-${file.name}`;
      const { fileSizeMb, wordCount } = analyzeDocument(file);

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from("documents")
        .insert([
          {
            user_id: userData.user.id,
            file_name: file.name,
            uploaded_at: new Date().toISOString(),
            file_size_mb: fileSizeMb,
            word_count: wordCount,
          },
        ]);

      if (insertError) throw insertError;

      const { data, error: fetchError } = await supabase
        .from("documents")
        .select("id, user_id, file_name, uploaded_at, file_size_mb, word_count")
        .eq("user_id", userData.user.id)
        .order("uploaded_at", { ascending: false });

      if (fetchError) throw fetchError;

      setDocuments(data || []);
      setFile(null);
    } catch (err: any) {
      setError(`Failed to upload: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getDownloadUrl = (fileName: string, userId: string) => {
    const { data } = supabase.storage
      .from("documents")
      .getPublicUrl(`${userId}/${fileName.split("/").pop()}`);
    return data.publicUrl;
  };

  const getAnalysisFeedback = (doc: Document): string => {
    const sizeFeedback = `Size: ${doc.file_size_mb?.toFixed(2)} MB`;
    const wordFeedback = doc.word_count ? `Words: ${doc.word_count}` : "Words: N/A";
    return `${sizeFeedback} | ${wordFeedback}`;
  };

  return (
    <div className="py-16 bg-gray-dim font-montserrat">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">Document Analysis</h2>
        <form onSubmit={handleFileUpload} className="max-w-lg mx-auto bg-gray-700 p-8 rounded-xl shadow-custom space-y-6">
          <div>
            <label htmlFor="file" className="block mb-1 font-semibold text-yellow-400">Upload Document</label>
            <input
              type="file"
              id="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-3 px-4 rounded-xl hover:bg-yellow-600 transition-all duration-300 flex items-center justify-center gap-2"
            disabled={isUploading || !file}
          >
            <FaFileUpload /> {isUploading ? "Uploading..." : "Upload & Analyze"}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {documents.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-center mb-6 text-yellow-400">Your Documents</h3>
            <div className="space-y-6">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-gray-700 p-6 rounded-xl shadow-custom">
                  <p className="text-lg font-semibold text-yellow-400">{doc.file_name}</p>
                  <p className="text-sm text-gray-300">Uploaded: {new Date(doc.uploaded_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-300">Analysis: <span className="text-yellow-400">{getAnalysisFeedback(doc)}</span></p>
                  <a
                    href={getDownloadUrl(doc.file_name, doc.user_id)}
                    className="text-yellow-400 hover:underline mt-2 inline-block flex items-center gap-1"
                    download
                  >
                    <FaDownload /> Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;