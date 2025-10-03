// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  id: string;
  email: string;
  role: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, role")
          .eq("id", user.id)
          .single();

        if (profile) setUser(profile);
      }
      setLoading(false);
    };

    getUser();

    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
