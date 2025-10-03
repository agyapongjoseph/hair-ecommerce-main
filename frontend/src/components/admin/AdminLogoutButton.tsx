// src/components/admin/AdminLogoutButton.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const AdminLogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <Button
      variant="destructive"
      className="mt-2"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default AdminLogoutButton;
