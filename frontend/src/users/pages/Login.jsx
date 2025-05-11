import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../../shared/components/context/auth-context";

const Login = () => {
  const history = useHistory();
  const { login } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL; // Haetaan API URL ympäristömuuttujasta

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Nollaa aiemmat virheet
    const credentials = { email, password };

    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // Käytä backendin virheviestiä, jos saatavilla, muuten yleinen virhe
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      // Oletetaan, että backend palauttaa id, token, name ja mahdollisesti admin-statuksen
      // Varmista, että AuthContextin login-funktio tukee admin-parametria
      login(data.id, data.token, data.name, undefined, data.admin);
      history.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        padding: "1rem",
        maxWidth: "400px",
        margin: "2rem auto",
        background: "#fff",
        borderRadius: "5px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email:</label> {/* Lisätty htmlFor */}
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password">Password:</label> {/* Lisätty htmlFor */}
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;