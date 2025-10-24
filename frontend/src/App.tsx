import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showRegister, setShowRegister] = useState(false);

  if (!token) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#ffe6f0" }}>
        {showRegister ? (
          <RegisterForm onRegister={() => setShowRegister(false)} />
        ) : (
          <LoginForm onLogin={setToken} />
        )}
        <button
          className="btn mt-3"
          style={{ backgroundColor: "#ff4d6d", color: "#fff" }}
          onClick={() => setShowRegister(!showRegister)}
        >
          {showRegister ? "Already have account? Login" : "New user? Register"}
        </button>
      </div>
    );
  }
}
