import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL; // Haetaan API URL ympäristömuuttujasta

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null); // Nollaa aiemmat virheet
    const user = { name, email, password };

    try {
      const response = await fetch(`${apiUrl}/users/signup`, { // Käytetään apiUrl-muuttujaa
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        // Käytä backendin virheviestiä, jos saatavilla, muuten yleinen virhe
        throw new Error(data.error || "Signup failed. Please try again.");
      }

      // Onnistuneen rekisteröinnin jälkeen voidaan ohjata kirjautumissivulle
      // tai näyttää onnistumisviesti.
      history.push("/login");
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
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email:</label>
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
          <label htmlFor="password">Password:</label>
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
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;