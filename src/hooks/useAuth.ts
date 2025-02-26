// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";
// import { User, Session } from "@supabase/supabase-js";

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const getSession = async () => {
//       const { data: { session }, error } = await supabase.auth.getSession();
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//       if (error) setError("Failed to load session.");
//     };

//     getSession();

//     const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//       if (event === "SIGNED_IN") setError(null);
//       if (event === "SIGNED_OUT") setError(null);
//     });

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   const signIn = async (email: string, password: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//       if (error) throw error;
//       setSession(data.session);
//       setUser(data.user);
//     } catch (err: any) {
//       setError(err.message || "Login failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signUp = async (email: string, password: string, name?: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: { data: { name: name || email.split("@")[0] } },
//       });
//       if (error) throw error;
//       setSession(data.session);
//       setUser(data.user);
//       return "Signup successful! Check your email to confirm.";
//     } catch (err: any) {
//       setError(err.message || "Signup failed.");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signOut = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       setSession(null);
//       setUser(null);
//     } catch (err: any) {
//       setError(err.message || "Logout failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { user, session, loading, error, signIn, signUp, signOut };
// };

import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return null;
    }
    return "Signup successful! Check your email to confirm.";
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    else setUser(null);
    setLoading(false);
  };

  return { user, loading, error, signIn, signUp, signOut };
};