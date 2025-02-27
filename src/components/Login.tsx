import { FormEvent, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import { FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setIsAuthenticated(true);
        const from = (location.state as any)?.from || "/profile";
        console.log("User already logged in, redirecting to:", from);
        navigate(from, { replace: true });
      }
    };
    checkUser();
  }, [navigate, location]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    if (!email || !password || (isSignup && !name)) {
      setStatus("Please fill out all fields.");
      console.log("Form validation failed: Missing fields");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus("Please enter a valid email.");
      console.log("Form validation failed: Invalid email");
      setLoading(false);
      return;
    }

    try {
      if (isSignup) {
        console.log("Attempting signup with:", { email, name });
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) {
          console.error("Sign-up error:", error.message);
          setStatus(error.message);
        } else {
          setStatus("Signup successful! Check your email to confirm.");
          console.log("Signup successful:", email);
          setTimeout(() => {
            setIsSignup(false);
            setName("");
            setPassword("");
            setStatus("Please confirm your email, then log in.");
          }, 3000);
        }
      } else {
        console.log("Attempting sign-in with:", { email });
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.error("Sign-in error:", error.message);
          setStatus(error.message);
        } else {
          console.log("Sign-in successful, user:", data.user);
          setStatus("Login successful!");
          setIsAuthenticated(true);
          const from = (location.state as any)?.from || "/profile";
          console.log("Redirecting to:", from);
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      setStatus(err.message || "An error occurred during authentication.");
      console.error("Authentication error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return null; // Prevent re-rendering after redirect
  }

  return (
    <div className="py-16">
      <div className="container max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center gap-2">
          <FaLock /> {isSignup ? "Register" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-custom space-y-6">
          {isSignup && (
            <div>
              <label htmlFor="name" className="block mb-1 font-semibold text-gray-800">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Full Name"
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
              placeholder="Email"
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
              placeholder="Password"
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
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
          </button>
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="w-full text-blue-600 text-sm hover:underline"
          >
            {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
          </button>
        </form>
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