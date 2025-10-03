// src/components/admin/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

const AdminRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;
