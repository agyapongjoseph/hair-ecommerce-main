// src/pages/auth/Login.tsx
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErr(null);
      setLoading(true);
      await login(email, password);
      navigate("/"); // redirect home after login
    } catch (error: any) {
      setErr(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {err && <div className="text-red-500 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <Input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
