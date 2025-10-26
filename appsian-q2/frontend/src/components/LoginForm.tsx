import { useState, type ChangeEvent, type FormEvent } from "react";
import API from "../services/api";

interface LoginFormProps {
    onLogin: (token: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      onLogin(res.data.token);
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="container mt-5 p-4 rounded-4 shadow" style={{ backgroundColor: "#fff0f6" }}>
      <h3 className="text-center mb-4" style={{ color: "#e75480" }}>Login</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />
        <button className="btn w-100" style={{ backgroundColor: "#ff4d6d", color: "#fff" }}>Login</button>
      </form>
    </div>
  );
}
