import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        setError(error.message);
      } else {
        console.log("Fetched user:", data.user);
        setUser(data.user);
      }
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Sign-out successful");
      setUser(null);
    } catch (err: any) {
      console.error("Sign-out failed:", err.message);
      setError(err.message || "Logout failed.");
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, signOut };
};