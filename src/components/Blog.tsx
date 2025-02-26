// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";

// type BlogPost = {
//   id: number;
//   title: string;
//   content: string;
//   author: string;
//   created_at: string;
// };

// const Blog = () => {
//   const [posts, setPosts] = useState<BlogPost[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const { data, error } = await supabase
//         .from("blog")
//         .select("id, title, content, author, created_at")
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Supabase error fetching blog posts:", error);
//         setError("Failed to load blog posts.");
//       } else {
//         setPosts(data || []);
//       }
//     };

//     fetchPosts();
//   }, []);

//   // Excerpt function—limits content to 100 characters
//   const getExcerpt = (content: string) => {
//     return content.length > 100 ? `${content.substring(0, 100)}...` : content;
//   };

//   return (
//     <div className="py-10">
//       <div className="container mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-6">Study Abroad Blog</h2>
//         {error && <p className="text-center text-red-500 mb-4">{error}</p>}
//         {posts.length === 0 && !error ? (
//           <p className="text-center text-gray-600">No blog posts yet—check back soon!</p>
//         ) : (
//           <div className="space-y-6">
//             {posts.map((post) => (
//               <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
//                 <h3 className="text-2xl font-semibold text-gray-800">{post.title}</h3>
//                 <p className="text-sm text-gray-600 mt-1">By {post.author} • {new Date(post.created_at).toLocaleDateString()}</p>
//                 <p className="text-gray-700 mt-2">{getExcerpt(post.content)}</p>
//                 {/* Optional: Add a "Read More" link later */}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Blog;

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { FaBookOpen } from "react-icons/fa";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog")
        .select("id, title, content, author, created_at")
        .order("created_at", { ascending: false });

      if (error) setError("Failed to load posts.");
      else setPosts(data || []);
    };

    fetchPosts();
  }, []);

  const getExcerpt = (content: string) => {
    return content.length > 100 ? `${content.substring(0, 100)}...` : content;
  };

  return (
    <div className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Blog</h2>
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        {posts.length === 0 && !error ? (
          <p className="text-center text-gray-600">No posts yet.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-xl shadow-custom">
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaBookOpen className="text-blue-600" /> {post.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">By {post.author} • {new Date(post.created_at).toLocaleDateString()}</p>
                <p className="text-gray-700 mt-4">{getExcerpt(post.content)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;