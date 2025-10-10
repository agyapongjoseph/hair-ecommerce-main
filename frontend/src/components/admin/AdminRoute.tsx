// src/components/admin/AdminRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient"; // make sure you have this setup
import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

const AdminRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }

      // Fetch user role from Supabase "users" table
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      } else {
        setRole(data?.role || null);
      }

      setCheckingRole(false);
    };

    fetchRole();
  }, [user]);

  if (loading || checkingRole) {
    return <div className="p-4">Loading...</div>;
  }

  // If not logged in, go to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not admin, go to homepage
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show admin page
  return <>{children}</>;
};

export default AdminRoute;
