import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
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

      console.log(`Fetching role for user ID: ${user.id}`);

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      } else {
        console.log(`Fetched role data: ${data?.role}`);
        setRole(data?.role || null);
      }

      // ✅ Delay the end of checking until after role is updated
      setCheckingRole(false);
    };

    if (!loading) {
      fetchRole();
    }
  }, [user, loading]);

  // ✅ Don’t render anything while checking or fetching
  if (loading || checkingRole) {
    return <div className="p-4">Loading...</div>;
  }

  // ✅ Only now, role has been updated
  console.log(`User role is: ${role}`);

  // If not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If not admin
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show admin page
  return <>{children}</>;
};

export default AdminRoute;
