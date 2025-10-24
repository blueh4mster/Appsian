import { useState, type ChangeEvent, type FormEvent } from "react";
import API, { type RegisterRequest } from "../services/api";

interface RegisterFormProps {
  onRegister: () => void;
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterRequest>({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      onRegister();
    } catch {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="container mt-5 p-4 rounded-4 shadow" style={{ backgroundColor: "#fff0f6" }}>
      <h3 className="text-center mb-4" style={{ color: "#e75480" }}>Register</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="form-control mb-3"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn w-100" style={{ backgroundColor: "#ff4d6d", color: "#fff" }}>
          Register
        </button>
      </form>
    </div>
  );
}
