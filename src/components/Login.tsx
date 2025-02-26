// import { FormEvent, useState } from "react";
// import { supabase } from "../supabase";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [isSignup, setIsSignup] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       if (isSignup) {
//         const { error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: { data: { name } },
//         });
//         if (error) throw error;
//         alert("Signup successful! Check your email to confirm.");
//         setIsSignup(false);
//       } else {
//         const { error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });
//         if (error) throw error;
//         navigate("/profile");
//       }
//     } catch (err: any) {
//       setError(err.message || "An error occurred.");
//     }
//   };

//   return (
//     <div className="py-10">
//       <div className="container mx-auto max-w-md">
//         <h2 className="text-3xl font-bold text-center mb-6">
//           {isSignup ? "Register" : "Login"}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-md">
//           {isSignup && (
//             <div>
//               <label htmlFor="name" className="block mb-1 font-semibold">Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 required
//               />
//             </div>
//           )}
//           <div>
//             <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//           >
//             {isSignup ? "Register" : "Login"}
//           </button>
//           <button
//             type="button"
//             onClick={() => setIsSignup(!isSignup)}
//             className="w-full text-blue-600 text-sm hover:underline"
//           >
//             {isSignup ? "Already have an account? Login" : "Need an account? Register"}
//           </button>
//         </form>
//         {error && <p className="mt-4 text-center text-red-500">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default Login;

import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { user, loading, error: authError, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/profile");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!email || !password || (isSignup && !name)) {
      setStatus("Please fill out all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus("Please enter a valid email.");
      return;
    }

    try {
      if (isSignup) {
        const signupMessage = await signUp(email, password, name);
        if (signupMessage) {
          setStatus(signupMessage);
          setTimeout(() => {
            setIsSignup(false);
            setName("");
            setPassword("");
            setStatus("Please confirm your email, then log in.");
          }, 3000);
        }
      } else {
        await signIn(email, password);
        if (!authError) {
          setStatus("Login successful!");
          setTimeout(() => navigate("/profile"), 1000);
        }
      }
    } catch (err: any) {
      setStatus(err.message || "An error occurred.");
    }
  };

  return (
    <div className="py-16">
      <div className="container max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center gap-2">
          <FaLock /> {isSignup ? "Register" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-custom space-y-6">
          {isSignup && (
            <div>
              <label htmlFor="name" className="block mb-1 font-semibold text-gray-800">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold text-gray-800">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold text-gray-800">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all"
            disabled={loading}
          >
            {loading ? "Processing..." : isSignup ? "Register" : "Login"}
          </button>
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="w-full text-blue-600 text-sm hover:underline"
          >
            {isSignup ? "Have an account? Login" : "Need an account? Register"}
          </button>
        </form>
        {authError && <p className="mt-4 text-center text-red-500">{authError}</p>}
        {status && (
          <p className={`mt-4 text-center ${status.includes("successful") ? "text-green-600" : "text-red-500"}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;